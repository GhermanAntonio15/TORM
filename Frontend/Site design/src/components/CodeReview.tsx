import { useState, useRef } from 'react';
import { Upload, FileCode, AlertCircle, CheckCircle, Info, Loader2, Edit2, MessageSquare, Send, X } from 'lucide-react';
import { AppSettings } from '../App';

interface Analysis {
  summary: string;
  issues: { severity: 'error' | 'warning' | 'info'; message: string }[];
  suggestions: string[];
  score: number;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface PreAnalysisMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface CodeReviewProps {
  settings: AppSettings;
}

const SUPPORTED_LANGUAGES = [
  { value: 'javascript', label: 'JavaScript', extensions: ['.js', '.mjs', '.cjs'] },
  { value: 'typescript', label: 'TypeScript', extensions: ['.ts'] },
  { value: 'react', label: 'React (JSX/TSX)', extensions: ['.jsx', '.tsx'] },
  { value: 'python', label: 'Python', extensions: ['.py'] },
  { value: 'java', label: 'Java', extensions: ['.java'] },
  { value: 'cpp', label: 'C++', extensions: ['.cpp', '.cc', '.cxx'] },
  { value: 'c', label: 'C', extensions: ['.c', '.h'] },
  { value: 'css', label: 'CSS', extensions: ['.css'] },
  { value: 'html', label: 'HTML', extensions: ['.html', '.htm'] },
  { value: 'json', label: 'JSON', extensions: ['.json'] },
  { value: 'php', label: 'PHP', extensions: ['.php'] },
  { value: 'ruby', label: 'Ruby', extensions: ['.rb'] },
  { value: 'go', label: 'Go', extensions: ['.go'] },
  { value: 'rust', label: 'Rust', extensions: ['.rs'] },
];

export function CodeReview({ settings }: CodeReviewProps) {
  const [code, setCode] = useState('');
  const [fileName, setFileName] = useState('');
  const [detectedLanguage, setDetectedLanguage] = useState('');
  const [isEditingLanguage, setIsEditingLanguage] = useState(false);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [preAnalysisMessages, setPreAnalysisMessages] = useState<PreAnalysisMessage[]>([]);
  const [preAnalysisInput, setPreAnalysisInput] = useState('');
  const [isSendingPreAnalysis, setIsSendingPreAnalysis] = useState(false);
  const [analysisInstructions, setAnalysisInstructions] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const preAnalysisChatEndRef = useRef<HTMLDivElement>(null);

  const detectLanguage = (filename: string): string => {
    const extension = '.' + filename.split('.').pop()?.toLowerCase();
    const language = SUPPORTED_LANGUAGES.find(lang => 
      lang.extensions.includes(extension)
    );
    return language?.value || 'unknown';
  };

  const getLanguageLabel = (value: string): string => {
    const language = SUPPORTED_LANGUAGES.find(lang => lang.value === value);
    return language?.label || 'Unknown';
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const detected = detectLanguage(file.name);
      setDetectedLanguage(detected);
      setIsEditingLanguage(false);
      setPreAnalysisMessages([]);
      setAnalysisInstructions([]);
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setCode(content);
        setAnalysis(null);
      };
      reader.readAsText(file);
    }
  };

  const handleSendPreAnalysis = async () => {
    if (!preAnalysisInput.trim() || isSendingPreAnalysis) return;

    const userMessage: PreAnalysisMessage = {
      role: 'user',
      content: preAnalysisInput,
      timestamp: new Date(),
    };

    setPreAnalysisMessages(prev => [...prev, userMessage]);
    setPreAnalysisInput('');
    setIsSendingPreAnalysis(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1200));

    // Mock AI response and extract instructions
    const { response, instruction } = generatePreAnalysisResponse(preAnalysisInput);
    
    const aiResponse: PreAnalysisMessage = {
      role: 'assistant',
      content: response,
      timestamp: new Date(),
    };

    setPreAnalysisMessages(prev => [...prev, aiResponse]);
    if (instruction) {
      setAnalysisInstructions(prev => [...prev, instruction]);
    }
    setIsSendingPreAnalysis(false);

    // Auto-scroll to bottom
    setTimeout(() => {
      preAnalysisChatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const generatePreAnalysisResponse = (message: string): { response: string; instruction: string | null } => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('focus on') || lowerMessage.includes('concentrate on')) {
      return {
        response: "I'll focus the analysis on that specific aspect. This will be prioritized in the code review.",
        instruction: `Focus on: ${message.replace(/focus on|concentrate on/gi, '').trim()}`
      };
    } else if (lowerMessage.includes('ignore') || lowerMessage.includes('skip')) {
      return {
        response: "Understood. I'll exclude that from the analysis to keep the review focused on what matters to you.",
        instruction: `Ignore: ${message.replace(/ignore|skip/gi, '').trim()}`
      };
    } else if (lowerMessage.includes('security')) {
      return {
        response: "I'll perform a thorough security analysis, checking for common vulnerabilities like SQL injection, XSS, authentication issues, and data exposure.",
        instruction: "Prioritize security issues and vulnerabilities"
      };
    } else if (lowerMessage.includes('performance')) {
      return {
        response: "I'll analyze the code for performance optimization opportunities, including algorithmic efficiency, memory usage, and potential bottlenecks.",
        instruction: "Focus on performance optimization"
      };
    } else if (lowerMessage.includes('accessibility') || lowerMessage.includes('a11y')) {
      return {
        response: "I'll check for accessibility best practices, including ARIA labels, keyboard navigation, screen reader compatibility, and WCAG compliance.",
        instruction: "Check accessibility (a11y) compliance"
      };
    } else if (lowerMessage.includes('best practice') || lowerMessage.includes('standard')) {
      return {
        response: "I'll evaluate the code against industry best practices and coding standards for the detected language.",
        instruction: "Verify adherence to coding standards and best practices"
      };
    } else if (lowerMessage.includes('test') || lowerMessage.includes('coverage')) {
      return {
        response: "I'll review the test coverage and suggest areas that need additional testing.",
        instruction: "Analyze test coverage and suggest improvements"
      };
    } else {
      return {
        response: "I understand. I'll take that into consideration during the analysis. Feel free to add more specific instructions or ask questions about what I can analyze.",
        instruction: message.length > 20 ? message : null
      };
    }
  };

  const removeInstruction = (index: number) => {
    setAnalysisInstructions(prev => prev.filter((_, i) => i !== index));
  };

  const analyzeCode = async () => {
    if (!code) return;

    setIsAnalyzing(true);
    
    // Simulate API call with selected model
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock analysis results
    const mockAnalysis: Analysis = {
      summary: 'Your code follows good practices with some areas for improvement.',
      issues: [
        { severity: 'warning', message: 'Consider adding error handling for async operations' },
        { severity: 'info', message: 'Variable naming could be more descriptive in some places' },
        { severity: 'error', message: 'Missing input validation on user-provided data' },
      ],
      suggestions: [
        'Add JSDoc comments for better documentation',
        'Consider extracting repeated logic into utility functions',
        'Implement proper error boundaries for React components',
      ],
      score: 78,
    };

    setAnalysis(mockAnalysis);
    setChatMessages([]); // Reset chat when new analysis is done
    setIsAnalyzing(false);
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-amber-500" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-500" />;
      default:
        return null;
    }
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

  const handleSendMessage = async () => {
    if (!chatInput.trim() || isSendingMessage) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: chatInput,
      timestamp: new Date(),
    };

    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');
    setIsSendingMessage(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Mock AI response based on user question
    const aiResponse: ChatMessage = {
      role: 'assistant',
      content: generateMockResponse(chatInput),
      timestamp: new Date(),
    };

    setChatMessages(prev => [...prev, aiResponse]);
    setIsSendingMessage(false);

    // Auto-scroll to bottom
    setTimeout(() => {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const generateMockResponse = (question: string): string => {
    const lowerQuestion = question.toLowerCase();
    
    if (lowerQuestion.includes('error') || lowerQuestion.includes('validation')) {
      return "Input validation is crucial for security and data integrity. I recommend adding validation using a library like Yup or Zod for TypeScript projects. For the specific error about user-provided data, you should validate inputs at entry points using schema validation and sanitize data before processing.";
    } else if (lowerQuestion.includes('async') || lowerQuestion.includes('promise')) {
      return "For async operations, I recommend wrapping your code in try-catch blocks. Use async/await syntax with proper error handling. Consider implementing a global error handler for unhandled promise rejections, and always provide user feedback when async operations fail.";
    } else if (lowerQuestion.includes('naming') || lowerQuestion.includes('variable')) {
      return "Good variable naming improves code readability significantly. Use descriptive names that explain the purpose: instead of 'data' use 'userData' or 'productList'. For booleans, use prefixes like 'is', 'has', or 'should'. Avoid abbreviations unless they're widely known.";
    } else if (lowerQuestion.includes('improve') || lowerQuestion.includes('better')) {
      return "To improve your code quality score, focus on: 1) Adding comprehensive error handling, 2) Improving variable and function naming, 3) Adding documentation and comments, 4) Extracting repeated code into reusable functions, 5) Adding unit tests for critical functions.";
    } else if (lowerQuestion.includes('documentation') || lowerQuestion.includes('comment')) {
      return "Add JSDoc comments above functions with @param and @return tags. Document complex logic with inline comments. Keep comments updated with code changes. Focus on explaining 'why' rather than 'what' - the code should be self-explanatory for 'what' through good naming.";
    } else {
      return "That's a great question! Based on your code analysis, I'd recommend focusing on the critical issues first - particularly the error handling and input validation. These are essential for production-ready code. Would you like me to elaborate on any specific issue from the analysis?";
    }
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-slate-900 mb-2">Code Review</h2>
            <p className="text-slate-600">Upload your code file for automated analysis and suggestions</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-500">Using model:</p>
            <p className="text-slate-900">{getModelLabel(settings.model)}</p>
          </div>
        </div>
      </div>

      {/* Upload Area */}
      <div className="mb-6">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept=".js,.jsx,.ts,.tsx,.py,.java,.cpp,.c,.css,.html"
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full border-2 border-dashed border-slate-300 rounded-lg p-8 hover:border-blue-400 hover:bg-blue-50/50 transition-all"
        >
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Upload className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-slate-900">Click to upload code file</p>
              <p className="text-slate-500 text-sm">Supports .js, .jsx, .ts, .tsx, .py, .java, .cpp, .c, .css, .html</p>
            </div>
          </div>
        </button>
      </div>

      {/* File Info and Code Display */}
      {code && (
        <div className="space-y-4 mb-6">
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
            <div className="flex items-center gap-3 flex-1">
              <FileCode className="w-5 h-5 text-slate-600" />
              <span className="text-slate-900">{fileName}</span>
              <span className="text-slate-500 text-sm">({code.length} characters)</span>
            </div>
            <button
              onClick={analyzeCode}
              disabled={isAnalyzing}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                'Analyze Code'
              )}
            </button>
          </div>

          {/* Language Detection Section */}
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
                    onChange={(e) => {
                      setDetectedLanguage(e.target.value);
                      setIsEditingLanguage(false);
                    }}
                    className="px-3 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    autoFocus
                  >
                    <option value="unknown">Select a language...</option>
                    {SUPPORTED_LANGUAGES.map((lang) => (
                      <option key={lang.value} value={lang.value}>
                        {lang.label}
                      </option>
                    ))}
                  </select>
                )}
              </div>
              <button
                onClick={() => setIsEditingLanguage(!isEditingLanguage)}
                className="flex items-center gap-2 px-3 py-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <Edit2 className="w-4 h-4" />
                <span className="text-sm">
                  {isEditingLanguage ? 'Cancel' : 'Change'}
                </span>
              </button>
            </div>
            {detectedLanguage !== 'unknown' && !isEditingLanguage && (
              <p className="text-slate-500 text-sm mt-2">
                Analysis will be optimized for {getLanguageLabel(detectedLanguage)} code
              </p>
            )}
          </div>

          <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto">
            <pre className="text-slate-100 text-sm">
              <code>{code}</code>
            </pre>
          </div>

          {/* Pre-Analysis Chat Section */}
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 px-4 py-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-purple-600" />
                <h4 className="text-slate-900">Set Analysis Instructions</h4>
              </div>
              <p className="text-slate-600 text-sm mt-1">
                Chat with AI to specify what to focus on, ignore, or prioritize in the code review
              </p>
            </div>

            {/* Analysis Instructions Pills */}
            {analysisInstructions.length > 0 && (
              <div className="bg-white px-4 py-3 border-b border-slate-200">
                <p className="text-xs text-slate-500 mb-2">Active Instructions:</p>
                <div className="flex flex-wrap gap-2">
                  {analysisInstructions.map((instruction, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 px-3 py-1.5 bg-purple-100 text-purple-700 rounded-full text-sm"
                    >
                      <span>{instruction}</span>
                      <button
                        onClick={() => removeInstruction(index)}
                        className="hover:bg-purple-200 rounded-full p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Pre-Analysis Chat Messages */}
            <div className="h-64 overflow-y-auto p-4 space-y-4 bg-slate-50">
              {preAnalysisMessages.length === 0 ? (
                <div className="h-full flex items-center justify-center text-center">
                  <div className="max-w-md">
                    <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <MessageSquare className="w-7 h-7 text-purple-600" />
                    </div>
                    <p className="text-slate-600 mb-2">Customize your code analysis</p>
                    <p className="text-slate-500 text-sm mb-3">
                      Tell the AI what to focus on or what to ignore
                    </p>
                    <div className="text-left bg-white border border-slate-200 rounded-lg p-3 text-xs text-slate-600 space-y-1">
                      <p className="font-medium text-slate-700 mb-1">Examples:</p>
                      <p>• "Focus on security vulnerabilities"</p>
                      <p>• "Ignore code style, check logic only"</p>
                      <p>• "Check for performance issues"</p>
                      <p>• "Prioritize accessibility"</p>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {preAnalysisMessages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.role === 'user'
                            ? 'bg-purple-600 text-white'
                            : 'bg-white border border-slate-200 text-slate-900'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        <p
                          className={`text-xs mt-1 ${
                            message.role === 'user' ? 'text-purple-100' : 'text-slate-400'
                          }`}
                        >
                          {message.timestamp.toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                  {isSendingPreAnalysis && (
                    <div className="flex justify-start">
                      <div className="bg-white border border-slate-200 rounded-lg p-3">
                        <div className="flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin text-slate-600" />
                          <p className="text-sm text-slate-600">AI is typing...</p>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={preAnalysisChatEndRef} />
                </>
              )}
            </div>

            {/* Pre-Analysis Chat Input */}
            <div className="border-t border-slate-200 p-4 bg-white">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={preAnalysisInput}
                  onChange={(e) => setPreAnalysisInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendPreAnalysis()}
                  placeholder="E.g., 'Focus on security' or 'Ignore styling issues'..."
                  className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  disabled={isSendingPreAnalysis}
                />
                <button
                  onClick={handleSendPreAnalysis}
                  disabled={!preAnalysisInput.trim() || isSendingPreAnalysis}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Send</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Analysis Results */}
      {analysis && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="border-t border-slate-200 pt-6">
            <h3 className="text-slate-900 mb-4">Analysis Results</h3>

            {/* Score */}
            <div className="mb-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-700">Code Quality Score</span>
                <span className="text-3xl text-slate-900">{analysis.score}/100</span>
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
            <div className="mb-6">
              <h4 className="text-slate-900 mb-3">Issues Found</h4>
              <div className="space-y-2">
                {analysis.issues.map((issue, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-4 bg-white border border-slate-200 rounded-lg"
                  >
                    {getSeverityIcon(issue.severity)}
                    <div className="flex-1">
                      <p className="text-slate-900">{issue.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Suggestions */}
            <div>
              <h4 className="text-slate-900 mb-3">Suggestions</h4>
              <div className="space-y-2">
                {analysis.suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg"
                  >
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <p className="text-slate-700">{suggestion}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Chat with AI Section */}
            <div className="mt-8 border-t border-slate-200 pt-6">
              <div className="flex items-center gap-2 mb-4">
                <MessageSquare className="w-5 h-5 text-blue-600" />
                <h4 className="text-slate-900">Chat with AI about this review</h4>
              </div>
              
              <div className="bg-slate-50 rounded-lg border border-slate-200 overflow-hidden">
                {/* Chat Messages */}
                <div className="h-80 overflow-y-auto p-4 space-y-4">
                  {chatMessages.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-center">
                      <div className="max-w-sm">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <MessageSquare className="w-8 h-8 text-blue-600" />
                        </div>
                        <p className="text-slate-600 mb-2">Ask questions about your code review</p>
                        <p className="text-slate-500 text-sm">
                          Get clarification on issues, ask for examples, or request additional suggestions
                        </p>
                      </div>
                    </div>
                  ) : (
                    <>
                      {chatMessages.map((message, index) => (
                        <div
                          key={index}
                          className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[80%] rounded-lg p-3 ${
                              message.role === 'user'
                                ? 'bg-blue-600 text-white'
                                : 'bg-white border border-slate-200 text-slate-900'
                            }`}
                          >
                            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                            <p
                              className={`text-xs mt-1 ${
                                message.role === 'user' ? 'text-blue-100' : 'text-slate-400'
                              }`}
                            >
                              {message.timestamp.toLocaleTimeString([], { 
                                hour: '2-digit', 
                                minute: '2-digit' 
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
                              <p className="text-sm text-slate-600">AI is typing...</p>
                            </div>
                          </div>
                        </div>
                      )}
                      <div ref={chatEndRef} />
                    </>
                  )}
                </div>

                {/* Chat Input */}
                <div className="border-t border-slate-200 p-4 bg-white">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Ask about the review results..."
                      className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={isSendingMessage}
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!chatInput.trim() || isSendingMessage}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      <span>Send</span>
                    </button>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    Try asking: "How can I fix the validation error?" or "Can you explain the async handling issue?"
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}