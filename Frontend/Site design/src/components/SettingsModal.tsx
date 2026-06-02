import { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { AppSettings } from '../App';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onSave: (settings: AppSettings) => void;
}

const MODEL_OPTIONS = [
  { value: 'gemma3:1b', label: 'Gemma 2b', provider: 'Google' },
  { value: 'gemma3:1b', label: 'Gemma3 1b', provider: 'Google' },
];

export function SettingsModal({ isOpen, onClose, settings, onSave }: SettingsModalProps) {
  const [localSettings, setLocalSettings] = useState<AppSettings>(settings);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(localSettings);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200">
            <h2 className="text-slate-900">Settings</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Model Selection */}
            <div>
              <label className="block text-slate-700 mb-2">
                LLM Model
              </label>
              <select
                value={localSettings.model}
                onChange={(e) =>
                  setLocalSettings({ ...localSettings, model: e.target.value })
                }
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {MODEL_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label} ({option.provider})
                  </option>
                ))}
              </select>
              <p className="mt-2 text-sm text-slate-500">
                Select the AI model to use for code analysis and generation
              </p>
            </div>

            {/* Temperature */}
            <div>
              <label className="block text-slate-700 mb-2">
                Temperature: {localSettings.temperature}
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={localSettings.temperature}
                onChange={(e) =>
                  setLocalSettings({
                    ...localSettings,
                    temperature: parseFloat(e.target.value),
                  })
                }
                className="w-full"
              />
              <div className="flex justify-between text-sm text-slate-500 mt-1">
                <span>More Focused (0)</span>
                <span>More Creative (1)</span>
              </div>
              <p className="mt-2 text-sm text-slate-500">
                Controls randomness in the model's responses
              </p>
            </div>

            {/* Max Tokens */}
            <div>
              <label className="block text-slate-700 mb-2">
                Max Tokens
              </label>
              <input
                type="number"
                value={localSettings.maxTokens}
                onChange={(e) =>
                  setLocalSettings({
                    ...localSettings,
                    maxTokens: parseInt(e.target.value) || 2000,
                  })
                }
                min="100"
                max="8000"
                step="100"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="mt-2 text-sm text-slate-500">
                Maximum length of generated responses (100-8000)
              </p>
            </div>

            {/* Info Box */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-900 text-sm">
                💡 <span>Note: Currently using simulated responses. Connect your API key to enable real AI-powered analysis and generation.</span>
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200 bg-slate-50">
            <button
              onClick={onClose}
              className="px-4 py-2 text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Save className="w-4 h-4" />
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
