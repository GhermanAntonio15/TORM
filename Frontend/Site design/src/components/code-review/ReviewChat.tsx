import { useState } from 'react';
import { Send } from 'lucide-react';
import { ChatMessage } from './types';

interface ReviewChatProps {
  messages: ChatMessage[];
  onSend: (msg: string) => void;
  isLoading: boolean;
}

export function ReviewChat({ messages, onSend, isLoading }: ReviewChatProps) {
  const [input, setInput] = useState('');

  const send = () => {
    if (!input.trim()) return;
    onSend(input);
    setInput('');
  };

  return (
    <div className="border rounded-lg p-4">
      <div className="h-48 overflow-y-auto mb-3 space-y-2">
        {messages.map((m, i) => (
          <div key={i} className={m.role === 'user' ? 'text-right' : 'text-left'}>
            <span>{m.content}</span>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 border rounded-lg px-3 py-2"
          placeholder="Ask about the review..."
        />
        <button
          onClick={send}
          disabled={isLoading}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
