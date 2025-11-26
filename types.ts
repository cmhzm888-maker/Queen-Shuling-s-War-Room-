export interface MomBriefing {
  errorType: string;
  psychologicalInsight: string;
  teachingStrategy: string;
  conversationGuide: string;
}

export interface ShulingTutorial {
  title: string;
  content: string; // Markdown supported
}

export interface AnalysisResult {
  briefing: MomBriefing;
  tutorial: ShulingTutorial;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
