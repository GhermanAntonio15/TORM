import { useRef, useState } from 'react';
import {
  Upload,
  FileCode,
  Loader2,
  Sparkles,
  Settings,
  CheckCircle,
} from 'lucide-react';

/* ================= TYPES ================= */

interface FileUploadProps {
  code: string;
  fileName: string;
  isAnalyzing: boolean;
  model: string;
  onFileSelected: (file: File) => void;
  onAnalyzeSuccess: (result: any) => void;
}

/* ================= CONSTANTS ================= */

const ANALYSIS_FOCUS_OPTIONS = [
  {
    value: 'SECURITY',
    label: 'Security',
    description: 'Vulnerabilities, injections, authentication issues',
  },
  {
    value: 'PERFORMANCE',
    label: 'Performance',
    description: 'Memory usage, time complexity, bottlenecks',
  },
  {
    value: 'CODE_QUALITY',
    label: 'Code Quality',
    description: 'Readability, structure, maintainability',
  },
  {
    value: 'BEST_PRACTICES',
    label: 'Best Practices',
    description: 'Industry standards and conventions',
  },
];

/* ================= COMPONENT ================= */

export function FileUpload({
  code,
  fileName,
  isAnalyzing,
  model,
  onFileSelected,
  onAnalyzeSuccess,
}: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const settingsRef = useRef<HTMLDivElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const [showFocusSettings, setShowFocusSettings] = useState(false);
  const [selectedFocusAreas, setSelectedFocusAreas] = useState<string[]>([
    'SECURITY',
    'CODE_QUALITY',
  ]);

  /* ================= HELPERS ================= */

  const toggleFocusArea = (value: string) => {
    setSelectedFocusAreas((prev) =>
      prev.includes(value)
        ? prev.filter((v) => v !== value)
        : [...prev, value]
    );
  };

  const getFocusAreasDisplay = () => {
    if (selectedFocusAreas.length === 0) return 'None';
    if (selectedFocusAreas.length === ANALYSIS_FOCUS_OPTIONS.length)
      return 'All';

    return ANALYSIS_FOCUS_OPTIONS
      .filter((o) => selectedFocusAreas.includes(o.value))
      .map((o) => o.label)
      .join(', ');
  };

  /* ================= BACKEND ================= */

  const handleAnalyze = async () => {
    if (!selectedFile || loading) return;

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('languageOverride', '');
      formData.append('model', model);
      formData.append(
        'focus',
        selectedFocusAreas.length === 0
          ? 'ALL'
          : selectedFocusAreas.join(',')
      );

      const res = await fetch(
        'http://52.201.213.172:8080/api/review/codeReview',
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!res.ok) {
        throw new Error('Failed to analyze code');
      }

      const data = await res.json();
      console.log(data);
      onAnalyzeSuccess(data);
    } catch (err) {
      console.error('Code review error:', err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= RENDER ================= */

  return (
    <div className="mb-6">
      {/* Hidden input */}
      <input
        type="file"
        ref={fileInputRef}
        accept=".js,.jsx,.ts,.tsx,.py,.java,.cpp,.c,.css,.html"
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.[0]) {
            setSelectedFile(e.target.files[0]);
            onFileSelected(e.target.files[0]);
          }
        }}
      />

      {/* ===== NO FILE ===== */}
      {!code ? (
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full border-2 border-dashed border-slate-300 rounded-lg p-8
                     hover:border-blue-400 hover:bg-blue-50/50 transition-all"
        >
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Upload className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-center">
              <p className="text-slate-900">Click to upload code file</p>
              <p className="text-slate-500 text-sm">
                Supports .js, .jsx, .ts, .tsx, .py, .java, .cpp, .c, .css, .html
              </p>
            </div>
          </div>
        </button>
      ) : (
        /* ===== FILE SELECTED ===== */
        <div className="border-2 border-blue-400 bg-blue-50/30 rounded-lg p-6">
          {/* File info */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3 flex-1">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <FileCode className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-slate-900 truncate">{fileName}</p>
                <p className="text-slate-500 text-sm">
                  {code.length} characters
                </p>
              </div>
            </div>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-3 py-1.5 bg-white
                         border border-slate-300 text-slate-700 rounded-lg
                         hover:bg-slate-50 transition-colors ml-3"
            >
              <Upload className="w-4 h-4" />
              <span className="text-sm">Change File</span>
            </button>
          </div>

          {/* Focus display */}
          <div className="mb-3 p-3 bg-white rounded-lg border border-slate-200">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-slate-600">Analysis Focus:</span>
              <span className="text-slate-900 font-medium">
                {getFocusAreasDisplay()}
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleAnalyze}
              disabled={loading || isAnalyzing}
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg
                         hover:bg-blue-700 transition-colors
                         disabled:opacity-50 disabled:cursor-not-allowed
                         flex items-center justify-center gap-2"
            >
              {loading || isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Analyze Code
                </>
              )}
            </button>

            {/* Focus settings */}
            <div className="relative" ref={settingsRef}>
              <button
                onClick={() => setShowFocusSettings((v) => !v)}
                className="px-4 py-3 bg-white border border-slate-300
                           text-slate-700 rounded-lg hover:bg-slate-50"
                title="Analysis Settings"
              >
                <Settings className="w-5 h-5" />
              </button>

              {showFocusSettings && (
                <div className="absolute right-0 top-full mt-2 w-80
                                bg-white border border-slate-200
                                rounded-lg shadow-lg z-10">
                  <div className="p-4 border-b border-slate-200">
                    <h4 className="text-slate-900 font-medium">
                      Analysis Focus
                    </h4>
                    <p className="text-slate-500 text-sm mt-1">
                      Select what aspects to analyze
                    </p>
                  </div>

                  <div className="p-2">
                    {ANALYSIS_FOCUS_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => toggleFocusArea(option.value)}
                        className={`w-full text-left px-3 py-2.5 rounded-lg mb-1
                          ${
                            selectedFocusAreas.includes(option.value)
                              ? 'bg-blue-50 border border-blue-200'
                              : 'hover:bg-slate-50'
                          }`}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`w-4 h-4 mt-0.5 rounded border-2
                              flex items-center justify-center
                              ${
                                selectedFocusAreas.includes(option.value)
                                  ? 'bg-blue-600 border-blue-600'
                                  : 'border-slate-300'
                              }`}
                          >
                            {selectedFocusAreas.includes(option.value) && (
                              <CheckCircle className="w-3 h-3 text-white" />
                            )}
                          </div>
                          <div>
                            <p className="text-slate-900 text-sm font-medium">
                              {option.label}
                            </p>
                            <p className="text-slate-500 text-xs">
                              {option.description}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="p-3 border-t border-slate-200 bg-slate-50">
                    <button
                      onClick={() => setShowFocusSettings(false)}
                      className="w-full px-4 py-2 bg-blue-600 text-white
                                 rounded-lg hover:bg-blue-700 text-sm"
                    >
                      Done
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
