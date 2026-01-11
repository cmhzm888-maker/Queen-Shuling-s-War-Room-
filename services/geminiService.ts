import { GoogleGenAI, Type, Schema, Chat } from "@google/genai";
import { AnalysisResult } from "../types";
import { SYSTEM_INSTRUCTION, SHULING_PROFILE } from "../constants";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Define the schema for the structured output
const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    briefing: {
      type: Type.OBJECT,
      properties: {
        errorType: { type: Type.STRING, description: "一句话指出错误类型" },
        psychologicalInsight: { type: Type.STRING, description: "一句话点明女儿可能的心理卡点" },
        teachingStrategy: { type: Type.STRING, description: "一句话概括本次教学的核心战术" },
        conversationGuide: { type: Type.STRING, description: "话术要点：提醒一两句关键的话术禁忌 (宜/忌)" },
      },
      required: ["errorType", "psychologicalInsight", "teachingStrategy", "conversationGuide"],
    },
    tutorial: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING, description: "A fun, engaging title for the session (Daily life/Mystery theme)." },
        content: { type: Type.STRING, description: "A step-by-step ROLEPLAY SCRIPT for the mother. Formatted in Markdown. Must include '【动作指令】' (Action) and '【女王话术】' (Dialogue) sections for each step." },
      },
      required: ["title", "content"],
    },
  },
  required: ["briefing", "tutorial"],
};

export const analyzeImage = async (base64Image: string, mimeType: string): Promise<AnalysisResult> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview", // Using Gemini 3 as requested
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Image,
            },
          },
          {
            text: "Analyze this math problem according to Wen Shuling's profile. Provide the Strategic Briefing for Mom and the Roleplay Script for Mom to teach Shuling.",
          },
        ],
      },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        temperature: 0.7,
      },
    });

    const text = response.text;
    if (!text) {
        throw new Error("No response text from Gemini");
    }
    return JSON.parse(text) as AnalysisResult;
  } catch (error) {
    console.error("Error analyzing image:", error);
    throw error;
  }
};

export const createChatSession = (): Chat => {
  return ai.chats.create({
    model: "gemini-3-flash-preview",
    config: {
      systemInstruction: `You are a helpful teaching assistant for Wen Shuling's mother.
      
      CONTEXT:
      ${SHULING_PROFILE}
      
      RULES FOR YOUR RESPONSES:
      1. **STRUCTURE IS MANDATORY**: Do not output long blocks of text. Use bullet points, numbered lists, and bold headers.
      2. **BE CONCISE**: Keep explanations short and actionable. Mom is busy.
      3. **ROLEPLAY**: If asked for examples, provide specific "Say this" / "Do this" scripts using daily life metaphors (Cats, School, Food).
      4. **TONE**: Encouraging, strategic, but grounded in reality.
      
      Example Format:
      **Strategy:**
      * Point 1
      * Point 2
      
      **Script Example:**
      * "Say: ..."
      `,
    },
  });
};
