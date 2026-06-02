import { useState } from 'react';
import { Send, Loader2, RotateCcw, MessageSquare } from 'lucide-react';
import { PreAnalysisMessage } from './types';
import { ChatMessage } from './ChatMessage';
import { AppSettings } from '../../App';

interface PreAnalysisChatProps {
  onInstructionsChange: (instructions: string[]) => void;
  settings: AppSettings;
}

export function PreAnalysisChat({
  onInstructionsChange,
  settings,
}: PreAnalysisChatProps) {
  const [messages, setMessages] = useState<PreAnalysisMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const send = async () => {
    if (!input.trim() || loading) return;

    const userMessage: PreAnalysisMessage = {
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
        console.log(settings.model);
      const res = await fetch('http://52.201.213.172:8080/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: 'pre-analysis',
          message: userMessage.content,
          model: settings.model,
          temperature: settings.temperature,
          maxTokens: settings.maxTokens,
        }),
      });

      const data = await res.json();

      const aiMessage: PreAnalysisMessage = {
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);

      onInstructionsChange((prev) => [...prev, userMessage.content]);
    } catch (err) {
      console.error('Chat error', err);
    } finally {
      setLoading(false);
    }
  };

  const resetConversation = () => {
    setMessages([]);
    setInput('');
  };

  return (
    <div>
<div className="border border-slate-200 rounded-lg overflow-hidden">
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 px-4 py-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-purple-600" />
                <h4 className="text-slate-900">Ask anything about coding</h4>
              </div>
              <p className="text-slate-600 text-sm mt-1">
                Chat with AI anything about coding, code information, notions or alghoritms
              </p>
            </div>
            </div>
    <div className="border rounded-lg bg-slate-50 p-4 w-full max-w-xl">

      {/* ===== MESSAGES ===== */}
        {messages.map((m, i) => (
          <ChatMessage key={i} message={m} />
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Loader2 className="w-4 h-4 animate-spin" />
            AI is typing...
          </div>
        )}

      {/* ===== INPUT + ACTIONS ===== */}
      <div className="flex gap-2 pt-2 border-t">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 border rounded-lg px-3 py-2"
          placeholder="Ask a question.."
          disabled={loading}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              send();
            }
          }}
        />

        {/* RESET */}
        <button
          onClick={resetConversation}
          disabled={loading || messages.length === 0}
          title="Reset conversation"
          className="bg-slate-200 text-slate-700 px-3 py-2 rounded-lg
                     hover:bg-slate-300 transition-colors
                     disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* SEND */}
        <button
          onClick={send}
          disabled={loading}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg
                     hover:bg-purple-700 transition-colors"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send />
          )}
        </button>
      </div>
    </div>
   </div>
  );
}
