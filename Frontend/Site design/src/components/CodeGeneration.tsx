import { useState } from 'react';
import { Sparkles, Copy, Check, Loader2, Code, Eye } from 'lucide-react';
import { AppSettings } from '../App';

type Framework = 'html' | 'react';
type ViewMode = 'code' | 'preview';

interface CodeGenerationProps {
  settings: AppSettings;
}

export function CodeGeneration({ settings }: CodeGenerationProps) {
  const [description, setDescription] = useState('');
  const [framework, setFramework] = useState<Framework>('react');
  const [generatedCode, setGeneratedCode] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('code');

  const generateCode = async () => {
    if (!description) return;

    setIsGenerating(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2500));

    // Mock generated code based on framework
    const mockCode = framework === 'react'
      ? `import React, { useState } from 'react';

export default function Component() {
  const [count, setCount] = useState(0);

  return (
    <div className="container">
      <h1>Generated Component</h1>
      <p>Based on: ${description}</p>
      <button onClick={() => setCount(count + 1)}>
        Count: {count}
      </button>
    </div>
  );
}`
      : `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Generated Page</title>
  <style>
    body {
      font-family: system-ui, sans-serif;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }
    .container {
      background: #f5f5f5;
      padding: 20px;
      border-radius: 8px;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Generated Page</h1>
    <p>Based on: ${description}</p>
    <button onclick="alert('Hello!')">Click me</button>
  </div>
</body>
</html>`;

    setGeneratedCode(mockCode);
    setIsGenerating(false);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getModelLabel = (modelValue: string) => {
    const modelMap: { [key: string]: string } = {
      'gpt-4': 'GPT-4',
      'gpt-4-turbo': 'GPT-4 Turbo',
      'gpt-3.5-turbo': 'GPT-3.5 Turbo',
      'claude-3-opus': 'Claude 3 Opus',
      'claude-3-sonnet': 'Claude 3 Sonnet',
      'claude-3-haiku': 'Claude 3 Haiku',
      'gemini-pro': 'Gemini Pro',
    };
    return modelMap[modelValue] || modelValue;
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-slate-900 mb-2">Code Generation</h2>
            <p className="text-slate-600">Describe what you want to build and get generated code</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-500">Using model:</p>
            <p className="text-slate-900">{getModelLabel(settings.model)}</p>
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div className="space-y-4 mb-6">
        {/* Framework Selection */}
        <div>
          <label className="block text-slate-700 mb-2">Target Framework</label>
          <div className="flex gap-2">
            <button
              onClick={() => setFramework('react')}
              className={`px-4 py-2 rounded-lg transition-all ${
                framework === 'react'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              React
            </button>
            <button
              onClick={() => setFramework('html')}
              className={`px-4 py-2 rounded-lg transition-all ${
                framework === 'html'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              HTML/CSS/JS
            </button>
          </div>
        </div>

        {/* Description Input */}
        <div>
          <label className="block text-slate-700 mb-2">Describe your component</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="E.g., A responsive pricing card with three tiers, featuring a header, price, feature list, and call-to-action button..."
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={6}
          />
        </div>

        <button
          onClick={generateCode}
          disabled={isGenerating || !description}
          className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Generate Code
            </>
          )}
        </button>
      </div>

      {/* Generated Code Display */}
      {generatedCode && (
        <div className="animate-in fade-in duration-300">
          <div className="border-t border-slate-200 pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-slate-900">Generated Code</h3>
              <div className="flex items-center gap-2">
                {/* View Mode Toggle */}
                <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
                  <button
                    onClick={() => setViewMode('code')}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded transition-all ${
                      viewMode === 'code'
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Code className="w-4 h-4" />
                    <span className="text-sm">Code</span>
                  </button>
                  <button
                    onClick={() => setViewMode('preview')}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded transition-all ${
                      viewMode === 'preview'
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Eye className="w-4 h-4" />
                    <span className="text-sm">Preview</span>
                  </button>
                </div>
                <button
                  onClick={copyCode}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy Code
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Code View */}
            {viewMode === 'code' && (
              <div className="bg-slate-900 rounded-lg p-6 overflow-x-auto">
                <pre className="text-slate-100 text-sm">
                  <code>{generatedCode}</code>
                </pre>
              </div>
            )}

            {/* Preview View */}
            {viewMode === 'preview' && (
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <div className="bg-slate-100 px-4 py-2 border-b border-slate-200">
                  <p className="text-sm text-slate-600">Live Preview</p>
                </div>
                <div className="bg-white p-6 min-h-[400px]">
                  {framework === 'html' ? (
                    <iframe
                      srcDoc={generatedCode}
                      className="w-full h-[500px] border-0"
                      title="Generated HTML Preview"
                      sandbox="allow-scripts"
                    />
                  ) : (
                    <div className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-lg p-8">
                      <div className="max-w-md mx-auto text-center space-y-4">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                          <Eye className="w-8 h-8 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="text-slate-900 mb-2">React Component Preview</h4>
                          <p className="text-slate-600 text-sm">
                            Copy the code and paste it into your React project to see it in action. React components require a build environment to render.
                          </p>
                        </div>
                        <div className="pt-4">
                          <div className="bg-white border border-slate-200 rounded-lg p-6 text-left">
                            <p className="text-sm text-slate-700 mb-3">Quick setup:</p>
                            <ol className="text-sm text-slate-600 space-y-2 list-decimal list-inside">
                              <li>Copy the generated code</li>
                              <li>Create a new .tsx file in your project</li>
                              <li>Import and use the component</li>
                            </ol>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-900 text-sm">
                💡 <span>Tip: This is a simulated response. In production, this would connect to an AI API like OpenAI, Anthropic, or similar LLM service.</span>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}