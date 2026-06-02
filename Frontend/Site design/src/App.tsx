import { useState } from 'react';
import { Code2, FileCode, Sparkles, Settings } from 'lucide-react';
import { CodeReview } from './components/code-review/CodeReview';
import { CodeGeneration } from './components/CodeGeneration';
import { SettingsModal } from './components/SettingsModal';

type Tab = 'review' ;

export interface AppSettings {
  model: string;
  temperature: number;
  maxTokens: number;
  apiKey: string;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('review');
  const [showSettings, setShowSettings] = useState(false);

  // 🔑 SINGLE SOURCE OF TRUTH pentru settings
  const [settings, setSettings] = useState<AppSettings>({
    model: 'gemma3:1b',   
    temperature: 0.7,
    maxTokens: 2000,
    apiKey: '',
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* ================= HEADER ================= */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Code2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-slate-900">CodeAssist</h1>
                <p className="text-slate-600 text-sm">
                  AI-powered code review and generation
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowSettings(true)}
              className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
            >
              <Settings className="w-5 h-5" />
              <span>Settings</span>
            </button>
          </div>
        </div>
      </header>

      {/* ================= MAIN ================= */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Tabs */}
        {/* <div className="flex gap-2 mb-8">
          <button
            onClick={() => setActiveTab('review')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all ${
              activeTab === 'review'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-slate-600 hover:bg-white/50'
            }`}
          >
            <FileCode className="w-5 h-5" />
            <span>Code Review</span>
          </button>

          <button
            onClick={() => setActiveTab('generate')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all ${
              activeTab === 'generate'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-slate-600 hover:bg-white/50'
            }`}
          >
            <Sparkles className="w-5 h-5" />
            <span>Code Generation</span>
          </button>
        </div> */}

        {/* Content */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          {activeTab === 'review' ? (
            <CodeReview settings={settings} />
          ) : (
            <CodeGeneration settings={settings} />
          )}
        </div>
      </main>

      {/* ================= FOOTER ================= */}
      <footer className="max-w-7xl mx-auto px-6 py-6 mt-12">
        <p className="text-center text-slate-500 text-sm">
          Powered by AG
        </p>
      </footer>

      {/* ================= SETTINGS MODAL ================= */}
      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        settings={settings}
        onSave={setSettings}  
      />
    </div>
  );
}
