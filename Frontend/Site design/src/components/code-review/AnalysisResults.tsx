import { useEffect, useRef, useState } from 'react';
import {
  CheckCircle,
  AlertTriangle,
  XCircle,
  Info,
  MessageSquare,
  Loader2,
  Send,
} from 'lucide-react';
import { Analysis, ChatMessage } from './types';
import { AppSettings } from '../../App';

interface AnalysisResultsProps {
  analysis: Analysis;
  model: string;
}

/* ================= HELPERS ================= */

const getSeverityIcon = (severity?: string) => {
  switch (severity) {
    case 'HIGH':
      return <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />;
    case 'MEDIUM':
      return <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0" />;
    case 'LOW':
      return <Info className="w-5 h-5 text-blue-500 flex-shrink-0" />;
    default:
      return <Info className="w-5 h-5 text-slate-400 flex-shrink-0" />;
  }
};

/* ================= COMPONENT ================= */

export function AnalysisResults({ analysis, model}: AnalysisResultsProps) {
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isSendingMessage, setIsSendingMessage] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);

  const issues = analysis.issues ?? [];
  const suggestions = analysis.suggestions ?? [];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isSendingMessage]);

const handleSendMessage = async () => {
  if (!chatInput.trim() || isSendingMessage) return;

  const userMessage: ChatMessage = {
    role: 'user',
    content: chatInput,
    timestamp: new Date(),
  };

  setChatMessages((prev) => [...prev, userMessage]);
  setChatInput('');
  setIsSendingMessage(true);

  try {
    console.log(model);
    const res = await fetch('http://52.201.213.172:8080/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: 'analysis-chat',
        message: userMessage.content,
        model: model,
      }),
    });

    if (!res.ok) {
      throw new Error('Failed to send chat message');
    }

    const data = await res.json();

    const aiMessage: ChatMessage = {
      role: 'assistant',
      content: data.response,
      timestamp: new Date(),
    };

    setChatMessages((prev) => [...prev, aiMessage]);
    
  } catch (err) {
    console.error('Analysis chat error:', err);

    setChatMessages((prev) => [
      ...prev,
      {
        role: 'assistant',
        content: 'Sorry, something went wrong while contacting the AI.',
        timestamp: new Date(),
      },
    ]);
  } finally {
    setIsSendingMessage(false);
  }
};

  return (
    <div className="w-full pt-6 border-t border-slate-200">
      {/* ===== HEADER ===== */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-slate-900">Analysis Results</h3>
        <button
          onClick={() => setShowChat((v) => !v)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            showChat
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>{showChat ? 'Hide Chat' : 'Ask AI Questions'}</span>
        </button>
      </div>

      {/* ===== MAIN FLEX ROW ===== */}
      <div className={showChat ? 'flex w-full gap-8 items-start' : 'w-full'}>
        {/* ===== LEFT COLUMN – RESULTS ===== */}
        <div className={showChat ? 'flex-1 min-w-0' : 'w-full'}>
          {/* Score */}
          <div className="mb-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-700">Code Quality Score</span>
              <span className="text-3xl text-slate-900">
                {analysis.score}/100
              </span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${analysis.score}%` }}
              />
            </div>
          </div>

          {/* Summary */}
          <div className="mb-6 p-4 bg-slate-50 rounded-lg">
            <p className="text-slate-700">{analysis.summary}</p>
          </div>

          {/* Issues */}
          {issues.length > 0 && (
            <div className="mb-6">
              <h4 className="text-slate-900 mb-3">Issues Found</h4>
              <div className="space-y-2">
                {issues.map((issue, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-4 bg-white border border-slate-200 rounded-lg"
                  >
                    <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0" />
                    <p className="text-slate-900">{issue}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Suggestions */}
          {suggestions.length > 0 && (
            <div>
              <h4 className="text-slate-900 mb-3">Suggestions</h4>
              <div className="space-y-2">
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg"
                  >
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <p className="text-slate-700">{suggestion}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ===== RIGHT COLUMN – CHAT ===== */}
        {showChat && (
          <div className="flex-1 min-w-0 sticky top-8">
            <div className="bg-slate-50 rounded-lg border border-slate-200 overflow-hidden h-[calc(100vh-16rem)]">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-3 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-blue-600" />
                  <h4 className="text-slate-900 font-medium">
                    AI Assistant
                  </h4>
                </div>
                <p className="text-slate-600 text-sm mt-1">
                  Ask questions about your code review
                </p>
              </div>

              {/* Messages */}
              <div className="h-[calc(100%-180px)] overflow-y-auto p-4 space-y-4">
                {chatMessages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      message.role === 'user'
                        ? 'justify-end'
                        : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[85%] rounded-lg p-3 ${
                        message.role === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-white border border-slate-200 text-slate-900'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">
                        {message.content}
                      </p>
                      <p
                        className={`text-xs mt-1 ${
                          message.role === 'user'
                            ? 'text-blue-100'
                            : 'text-slate-400'
                        }`}
                      >
                        {message.timestamp.toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                ))}

                {isSendingMessage && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-slate-200 rounded-lg p-3">
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin text-slate-600" />
                        <p className="text-sm text-slate-600">
                          AI is typing...
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={chatEndRef} />
              </div>

              {/* Input */}
              <div className="border-t border-slate-200 p-4 bg-white">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === 'Enter' && handleSendMessage()
                    }
                    placeholder="Ask about the review results..."
                    className="flex-1 px-4 py-2 border border-slate-300 rounded-lg
                               focus:outline-none focus:ring-2 focus:ring-blue-500
                               text-sm"
                    disabled={isSendingMessage}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!chatInput.trim() || isSendingMessage}
                    className="px-3 py-2 bg-blue-600 text-white rounded-lg
                               hover:bg-blue-700 transition-colors
                               disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
