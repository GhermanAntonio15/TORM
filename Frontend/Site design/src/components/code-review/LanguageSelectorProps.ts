import { SupportedLanguage } from './types';

interface LanguageSelectorProps {
  // existing
  detectedLanguage: string;
  isEditingLanguage: boolean;
  languages: SupportedLanguage[];
  onToggleEdit: () => void;
  onLanguageChange: (language: string) => void;
  getLanguageLabel: (value: string) => string;

  // 🆕 new props
  code?: string;
  fileName?: string;
  isAnalyzing: boolean;
  onAnalyze: () => void;
}
