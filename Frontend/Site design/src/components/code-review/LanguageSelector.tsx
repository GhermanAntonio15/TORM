import { Edit2, FileCode, Loader2 } from 'lucide-react';
import { SupportedLanguage } from './types';

export function LanguageSelector({
  detectedLanguage,
  isEditingLanguage,
  languages,
  onToggleEdit,
  onLanguageChange,
  getLanguageLabel
}: LanguageSelectorProps) {
  return (
    <div className="space-y-4">
      {/* ===== Language Detection ===== */}
      <div className="p-4 bg-white border border-slate-200 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-slate-700">Detected Language:</span>

            {!isEditingLanguage ? (
              <>
                <span
                  className={`px-3 py-1 rounded-lg text-sm ${
                    detectedLanguage === 'unknown'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-green-100 text-green-700'
                  }`}
                >
                  {getLanguageLabel(detectedLanguage)}
                </span>

                {detectedLanguage === 'unknown' && (
                  <span className="text-amber-600 text-sm">
                    Please select the correct language
                  </span>
                )}
              </>
            ) : (
              <select
                value={detectedLanguage}
                onChange={(e) => onLanguageChange(e.target.value)}
                className="px-3 py-1.5 border border-slate-300 rounded-lg
                           focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              >
                <option value="unknown">Select a language...</option>
                {languages.map((lang) => (
                  <option key={lang.value} value={lang.value}>
                    {lang.label}
                  </option>
                ))}
              </select>
            )}
          </div>

          <button
            onClick={onToggleEdit}
            className="flex items-center gap-2 px-3 py-1.5
                       text-slate-600 hover:text-slate-900
                       hover:bg-slate-100 rounded-lg transition-colors"
          >
            <Edit2 className="w-4 h-4" />
            <span className="text-sm">
              {isEditingLanguage ? 'Cancel' : 'Change'}
            </span>
          </button>
        </div>

        {detectedLanguage !== 'unknown' && !isEditingLanguage && (
          <p className="text-slate-500 text-sm mt-2">
            Analysis will be optimized for{' '}
            <strong>{getLanguageLabel(detectedLanguage)}</strong> code
          </p>
        )}
      </div>

    </div>
  );
}
