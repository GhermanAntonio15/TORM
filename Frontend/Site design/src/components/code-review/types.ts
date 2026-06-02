export interface Issue {
  message: string;
  severity?: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface Analysis {
  score: number;
  summary: string;
  issues: string[];
  suggestions: string[];
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface PreAnalysisMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface SupportedLanguage {
  value: string;
  label: string;
  extensions: string[];
}
