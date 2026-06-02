import { useState } from 'react';
import { AppSettings } from '../../App';
import { FileUpload } from './FileUpload';
import { LanguageSelector } from './LanguageSelector';
import { CodeViewer } from './CodeViewer';
import { PreAnalysisChat } from './PreAnalysisChat';
import { AnalysisResults } from './AnalysisResults';
import { Analysis, ChatMessage, SupportedLanguage } from './types';

/* ================= HELPERS ================= */

const getModelLabel = (modelValue: string): string => {
  const modelMap: Record<string, string> = {
    'codegemma:2b': 'Gemma 2B',
    'gemma3:1b': 'Gemma 3 1B',
  };

  return modelMap[modelValue] || modelValue;
};

const SUPPORTED_LANGUAGES: SupportedLanguage[] = [
  { value: 'java', label: 'Java', extensions: ['.java'] },
  { value: 'typescript', label: 'TypeScript', extensions: ['.ts', '.tsx'] },
  { value: 'javascript', label: 'JavaScript', extensions: ['.js', '.jsx'] },
  { value: 'python', label: 'Python', extensions: ['.py'] },
  { value: 'cpp', label: 'C++', extensions: ['.cpp', '.cc', '.cxx'] },
  { value: 'c', label: 'C', extensions: ['.c', '.h'] },
  { value: 'html', label: 'HTML', extensions: ['.html', '.htm'] },
  { value: 'css', label: 'CSS', extensions: ['.css'] },
];

const getLanguageLabel = (value: string): string => {
  const lang = SUPPORTED_LANGUAGES.find((l) => l.value === value);
  return lang?.label || 'Unknown';
};

const detectLanguageFromFile = (
  fileName: string,
  languages: SupportedLanguage[]
): string => {
  const lower = fileName.toLowerCase();

  for (const lang of languages) {
    if (lang.extensions.some((ext) => lower.endsWith(ext))) {
      return lang.value;
    }
  }

  return 'unknown';
};

/* ================= COMPONENT ================= */

export function CodeReview({ settings }: { settings: AppSettings }) {
  /* ---------- state ---------- */
  const [code, setCode] = useState('');
  const [fileName, setFileName] = useState('');
  const [detectedLanguage, setDetectedLanguage] = useState<string>('unknown');
  const [isEditingLanguage, setIsEditingLanguage] = useState(false);

  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [instructions, setInstructions] = useState<string[]>([]);

  /* ---------- handlers ---------- */

  const handleFileUpload = (file: File) => {
    setFileName(file.name);

    // 🔍 detectare automată limbaj
    const detected = detectLanguageFromFile(file.name, SUPPORTED_LANGUAGES);
    setDetectedLanguage(detected);
    setIsEditingLanguage(false);

    const reader = new FileReader();
    reader.onload = () => {
      setCode(reader.result as string);
      setAnalysis(null); // reset analysis
    };
    reader.readAsText(file);
  };

  const analyzeCode = async () => {
    if (!code || detectedLanguage === 'unknown') return;

    setIsAnalyzing(true);

    try {
      // 🔁 aici vei apela backend-ul real
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // mock result
      setAnalysis({
        summary: 'Code analysis completed successfully.',
        issues: ["test1", "text2"],
        score: 90,
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  /* ================= RENDER ================= */

 return (
  <div className="p-8">
    {/* ---------- Header ---------- */}
    <div className="mb-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-slate-900 mb-2">Code Review</h2>
          <p className="text-slate-600">
            Upload your code file for automated analysis and suggestions
          </p>
        </div>

        <div className="text-right">
          <p className="text-sm text-slate-500">Using model:</p>
          <p className="text-slate-900">{getModelLabel(settings.model)}</p>
        </div>
      </div>
    </div>

    {/* ---------- MAIN CONTENT ---------- */}
    <div className="flex flex-col gap-6 w-full">
      
      {/* Pre-analysis Chat */}
      <div className="h-[350px] max-h-[350px] overflow-hidden">
        <PreAnalysisChat
          settings={settings}
          onInstructionsChange={setInstructions}
        />
      </div>

      {/* Upload */}
      <FileUpload
        code={code}
        fileName={fileName}
        isAnalyzing={isAnalyzing}
        model={settings.model}
        onFileSelected={handleFileUpload}
        onAnalyzeSuccess={(result) => setAnalysis(result)}
      />

      {/* Language selector */}
      {code && (
        <LanguageSelector
          detectedLanguage={detectedLanguage}
          isEditingLanguage={isEditingLanguage}
          languages={SUPPORTED_LANGUAGES}
          getLanguageLabel={getLanguageLabel}
          onToggleEdit={() => setIsEditingLanguage((prev) => !prev)}
          onLanguageChange={(lang) => {
            setDetectedLanguage(lang);
            setIsEditingLanguage(false);
          }}
        />
      )}

      {/* Code Viewer */}
      {code && <CodeViewer code={code} />}
    </div>

    {/* ---------- ANALYSIS RESULTS ---------- */}
    {analysis && (
      <div className="w-full mt-8">
        <AnalysisResults analysis={analysis} model={settings.model}/>
      </div>
    )}
  </div>
);
}
