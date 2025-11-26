import React, { useState, useRef } from 'react';
import { ImageUpload } from './components/ImageUpload';
import { BriefingCard } from './components/BriefingCard';
import { TutorialCard } from './components/TutorialCard';
import { ChatAssistant } from './components/ChatAssistant';
import { analyzeImage, createChatSession } from './services/geminiService';
import { AnalysisResult } from './types';
import { Chat } from '@google/genai';
import { Scroll, Sparkles } from 'lucide-react';

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Maintain chat session ref so it persists across renders
  const chatSession = useRef<Chat | null>(null);

  // Initialize chat session once on mount or when needed
  if (!chatSession.current) {
    chatSession.current = createChatSession();
  }

  const handleImageSelected = async (base64: string, mimeType: string) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await analyzeImage(base64, mimeType);
      setResult(data);

      // Optionally, feed the context into the chat session for follow-ups
      if (chatSession.current) {
        // Send a hidden message to context to update the chat about the current problem
        // We use sendMessage (not stream) and ignore response just to seed context
        try {
            await chatSession.current.sendMessage({
                message: `Context update: User uploaded a problem.
                Analysis Result: ${JSON.stringify(data)}.
                Use this context if the user asks follow-up questions.`
            });
        } catch (e) {
            console.warn("Failed to seed chat context", e);
        }
      }

    } catch (err) {
      setError("Failed to analyze the mission. Please check your connection or try a clearer photo.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-3 bg-indigo-900 rounded-full mb-4 shadow-lg border-2 border-yellow-500">
             <Sparkles className="text-yellow-400" size={32} />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-indigo-900 font-serif-sc mb-2">
            闻书灵女王<span className="text-indigo-600">皇家智囊团</span>
          </h1>
          <p className="text-slate-500 font-medium">
            针对性战术分析 & 皇家御用讲解 (生活化定制版)
          </p>
        </header>

        {/* Input Section */}
        <section>
          <ImageUpload onImageSelected={handleImageSelected} isLoading={isLoading} />
        </section>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-8 text-center">
            {error}
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
            <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                <p className="text-indigo-600 font-medium animate-pulse">正在调动 Gemini 3 智囊团...</p>
            </div>
        )}

        {/* Results Section */}
        {result && (
          <div className="space-y-8">
            <div className="flex items-center gap-2 text-slate-400 text-sm font-bold uppercase tracking-widest mb-2 px-2">
               <Scroll size={14} />
               <span>Analysis Report</span>
            </div>
            <BriefingCard data={result.briefing} />
            <TutorialCard data={result.tutorial} />
          </div>
        )}

        <ChatAssistant chatSession={chatSession} />
      </div>
    </div>
  );
}