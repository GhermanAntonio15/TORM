import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { PreAnalysisMessage } from "./types";

export function ChatMessage({ message }: { message: PreAnalysisMessage }) {
  const isUser = message.role === "user";

  return (
    <div
      className={`rounded-lg p-3 text-sm ${
        isUser
          ? "bg-white border"
          : "bg-purple-50 border border-purple-200"
      }`}
    >
      <div className="mb-1 font-semibold text-slate-600">
        {isUser ? "You" : "AI"}
      </div>

      <div className="prose prose-slate max-w-none">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            code({ inline, className, children }) {
              const match = /language-(\w+)/.exec(className || "");
              return !inline && match ? (
                <SyntaxHighlighter
                  style={oneDark}
                  language={match[1]}
                  PreTag="div"
                >
                  {String(children).replace(/\n$/, "")}
                </SyntaxHighlighter>
              ) : (
                <code className="bg-slate-100 px-1 rounded">
                  {children}
                </code>
              );
            },
          }}
        >
          {message.content}
        </ReactMarkdown>
      </div>
    </div>
  );
}
