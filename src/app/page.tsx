'use client';

import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { 
  Settings, 
  Send, 
  Copy, 
  Check, 
  Layout, 
  Globe, 
  Sparkles,
  ChevronRight,
  Github,
  Zap,
  Bot
} from 'lucide-react';

export default function Home() {
  const [topic, setTopic] = useState('');
  const [blogUrl, setBlogUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [copied, setCopied] = useState(false);
  const [apiKeys, setApiKeys] = useState({
    openai: '',
    gemini: '',
  });

  useEffect(() => {
    setApiKeys({
      openai: localStorage.getItem('openai_key') || '',
      gemini: localStorage.getItem('gemini_key') || '',
    });
  }, []);

  const saveKeys = (newKeys: typeof apiKeys) => {
    setApiKeys(newKeys);
    localStorage.setItem('openai_key', newKeys.openai);
    localStorage.setItem('gemini_key', newKeys.gemini);
    setShowSettings(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    const activeKey = apiKeys.openai || apiKeys.gemini;
    if (!activeKey) {
      setShowSettings(true);
      return;
    }

    setIsGenerating(true);
    try {
      const { generateBlogDraft } = await import('./actions');
      const draft = await generateBlogDraft(topic, activeKey, blogUrl);
      setResult(draft);
    } catch (error) {
      console.error('Generation failed:', error);
      setResult('### 🚨 Error\nGeneration failed. Please check your API key and connection.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#050505] text-slate-900 dark:text-slate-100 font-sans selection:bg-indigo-100 dark:selection:bg-indigo-900/40">
      {/* Background Gradients */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-gradient-to-br from-indigo-400/20 to-purple-400/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-gradient-to-tl from-blue-400/20 to-teal-400/20 blur-[120px] rounded-full" />
      </div>

      <div className="relative max-w-[1600px] mx-auto px-6 lg:px-12 py-8">
        {/* Header */}
        <header className="flex items-center justify-between mb-12 backdrop-blur-md bg-white/70 dark:bg-black/40 px-6 py-4 rounded-full border border-slate-200/50 dark:border-slate-800/50 sticky top-4 z-50 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400">
              Blog Zen
            </span>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowSettings(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-800 transition-all"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Config</span>
            </button>
          </div>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 min-h-[80vh]">
          {/* Left: Input Panel */}
          <div className="flex flex-col justify-center space-y-8 animate-in fade-in slide-in-from-left-4 duration-700">
            <div className="space-y-4 px-2">
              <h1 className="text-5xl lg:text-6xl font-black tracking-tighter leading-[1.1]">
                Write faster,<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                  Think deeper.
                </span>
              </h1>
              <p className="text-lg text-slate-500 dark:text-slate-400 max-w-md font-medium">
                AI가 당신의 블로그 스타일을 분석하고, <br/>가장 완벽한 초안을 설계합니다.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-slate-900/60 p-8 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-2xl shadow-slate-200/50 dark:shadow-none backdrop-blur-xl">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider pl-1">
                  <Globe className="w-3 h-3" /> Target Blog URL
                </label>
                <input
                  type="url"
                  value={blogUrl}
                  onChange={(e) => setBlogUrl(e.target.value)}
                  placeholder="https://my-blog.com (스타일 분석용)"
                  className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-black/50 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all font-medium"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider pl-1">
                  <Layout className="w-3 h-3" /> Topic & Keywords
                </label>
                <textarea
                  rows={5}
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="작성할 주제를 입력하세요. 구체적일수록 좋습니다."
                  className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-black/50 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all resize-none font-medium leading-relaxed"
                />
              </div>

              <button
                type="submit"
                disabled={isGenerating || !topic.trim()}
                className="w-full py-5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold rounded-2xl transition-all transform hover:scale-[1.01] active:scale-[0.99] shadow-lg shadow-indigo-500/25 disabled:opacity-50 disabled:shadow-none disabled:hover:scale-100"
              >
                {isGenerating ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Generating...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2 text-lg">
                    Generate Draft <ChevronRight className="w-5 h-5" />
                  </span>
                )}
              </button>
            </form>
          </div>

          {/* Right: Output Panel */}
          <div className="relative lg:h-[85vh] animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
            {result ? (
              <div className="h-full flex flex-col bg-white dark:bg-[#0F0F0F] rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/50 backdrop-blur-md">
                  <div className="flex items-center gap-2">
                    <div className="px-2.5 py-1 rounded-md bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold uppercase tracking-wider">
                      Markdown Preview
                    </div>
                  </div>
                  <button 
                    onClick={handleCopy}
                    className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 transition-colors"
                    title="Copy to clipboard"
                  >
                    {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                
                <div className="flex-1 overflow-y-auto custom-scrollbar p-8 lg:p-10">
                  <article className="prose prose-slate dark:prose-invert max-w-none 
                    prose-headings:font-black prose-headings:tracking-tight 
                    prose-h1:text-4xl prose-h1:bg-clip-text prose-h1:text-transparent prose-h1:bg-gradient-to-br prose-h1:from-slate-900 prose-h1:to-slate-600 dark:prose-h1:from-white dark:prose-h1:to-slate-400 prose-h1:mb-8
                    prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:border-b prose-h2:border-slate-100 dark:prose-h2:border-slate-800 prose-h2:pb-2
                    prose-p:text-lg prose-p:leading-8 prose-p:text-slate-600 dark:prose-p:text-slate-300
                    prose-blockquote:border-l-4 prose-blockquote:border-indigo-500 prose-blockquote:bg-slate-50 dark:prose-blockquote:bg-slate-900/50 prose-blockquote:py-2 prose-blockquote:px-5 prose-blockquote:rounded-r-lg prose-blockquote:not-italic
                    prose-li:text-lg prose-li:text-slate-600 dark:prose-li:text-slate-300
                    prose-strong:text-indigo-600 dark:prose-strong:text-indigo-400 prose-strong:font-bold
                    prose-code:bg-slate-100 dark:prose-code:bg-slate-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:text-sm prose-code:font-mono prose-code:text-pink-600 dark:prose-code:text-pink-400 before:prose-code:content-none after:prose-code:content-none">
                    <ReactMarkdown>{result}</ReactMarkdown>
                  </article>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-slate-50/50 dark:bg-slate-900/20 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[32px] group">
                <div className="w-24 h-24 bg-white dark:bg-slate-900 rounded-3xl flex items-center justify-center shadow-lg mb-8 group-hover:scale-110 transition-transform duration-500">
                  <Bot className="w-10 h-10 text-slate-300 dark:text-slate-700" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">AI is ready</h3>
                <p className="text-slate-500 max-w-sm mx-auto leading-relaxed">
                  왼쪽에서 주제를 입력하시면,<br/>
                  당신의 스타일을 완벽하게 학습한 AI가 글을 작성합니다.
                </p>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* API Key Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[100] p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[32px] max-w-sm w-full shadow-2xl border border-slate-100 dark:border-slate-800 animate-in zoom-in-95">
            <h2 className="text-2xl font-bold mb-6">API Configuration</h2>
            <div className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Gemini API Key</label>
                <input
                  type="password"
                  value={apiKeys.gemini}
                  onChange={(e) => setApiKeys({...apiKeys, gemini: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-black/50 border border-slate-200 dark:border-slate-800 focus:border-indigo-500 outline-none transition-all text-sm font-mono"
                  placeholder="AIza..."
                />
              </div>
              <div className="pt-4 flex gap-3">
                <button
                  onClick={() => saveKeys(apiKeys)}
                  className="flex-1 py-3 bg-slate-900 dark:bg-white text-white dark:text-black font-bold rounded-xl"
                >
                  Save
                </button>
                <button
                  onClick={() => setShowSettings(false)}
                  className="px-5 py-3 font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
