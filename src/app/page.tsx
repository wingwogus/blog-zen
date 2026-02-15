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
  Moon,
  Sun
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

  // Load keys from localStorage on mount
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
    <div className="min-h-screen bg-[#FDFDFD] dark:bg-[#0A0A0A] text-zinc-900 dark:text-zinc-100 selection:bg-blue-100 dark:selection:bg-blue-900/40 transition-colors duration-300">
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-40 dark:opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-400/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-400/20 blur-[120px] rounded-full" />
      </div>

      <div className="relative max-w-[1400px] mx-auto px-6 lg:px-12 py-10 lg:py-16">
        {/* Navigation / Header */}
        <nav className="flex items-center justify-between mb-20 animate-in fade-in slide-in-from-top-4 duration-1000">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-zinc-900 dark:bg-zinc-50 rounded-xl flex items-center justify-center shadow-lg">
              <Sparkles className="w-6 h-6 text-white dark:text-black" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Blog Zen</h1>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500">
                Premium Engine
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <a 
              href="https://github.com/wingwogus/blog-zen" 
              target="_blank" 
              className="p-2.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
            >
              <Github className="w-5 h-5" />
            </a>
            <button
              onClick={() => setShowSettings(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-sm font-semibold shadow-sm hover:shadow-md hover:border-zinc-300 dark:hover:border-zinc-700 transition-all"
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </button>
          </div>
        </nav>

        <main className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          {/* Left Panel: Inputs */}
          <div className="lg:col-span-5 space-y-10 animate-in fade-in slide-in-from-left-8 duration-1000 delay-200">
            <div className="space-y-4">
              <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.1]">
                Masterful drafts, <br />
                <span className="text-blue-600 dark:text-blue-500">Zero effort.</span>
              </h2>
              <p className="text-lg text-zinc-500 dark:text-zinc-400 max-w-md leading-relaxed">
                Connect your style, define your topic, and let the most advanced models do the heavy lifting.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 p-1 w-full">
              <div className="group space-y-2">
                <label className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.15em] text-zinc-400 group-focus-within:text-blue-500 transition-colors">
                  <Globe className="w-3.5 h-3.5" />
                  Reference Blog URL
                </label>
                <input
                  type="url"
                  value={blogUrl}
                  onChange={(e) => setBlogUrl(e.target.value)}
                  placeholder="https://tistory.com/..."
                  className="w-full px-5 py-4 rounded-2xl bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all placeholder:text-zinc-300 dark:placeholder:text-zinc-700"
                />
              </div>

              <div className="group space-y-2">
                <label className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.15em] text-zinc-400 group-focus-within:text-blue-500 transition-colors">
                  <Layout className="w-3.5 h-3.5" />
                  Writing Topic
                </label>
                <textarea
                  rows={6}
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="What's on your mind today?"
                  className="w-full px-5 py-4 rounded-2xl bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all resize-none placeholder:text-zinc-300 dark:placeholder:text-zinc-700"
                />
              </div>

              <button
                type="submit"
                disabled={isGenerating || !topic.trim()}
                className="group relative w-full py-5 bg-zinc-900 dark:bg-white text-white dark:text-black font-bold rounded-2xl hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-30 disabled:hover:scale-100 shadow-xl shadow-zinc-900/20 dark:shadow-white/10 overflow-hidden"
              >
                <div className="relative z-10 flex items-center justify-center gap-2">
                  {isGenerating ? (
                    <>
                      <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      <span>Synthesizing...</span>
                    </>
                  ) : (
                    <>
                      <span>Generate Professional Draft</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-10 transition-opacity" />
              </button>
            </form>
          </div>

          {/* Right Panel: Output */}
          <div className="lg:col-span-7 h-full animate-in fade-in slide-in-from-right-8 duration-1000 delay-400">
            {result ? (
              <div className="bg-white dark:bg-zinc-900 rounded-[32px] border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden h-fit">
                <div className="px-8 py-6 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-800/30">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-400" />
                    <div className="w-2 h-2 rounded-full bg-amber-400" />
                    <div className="w-2 h-2 rounded-full bg-green-400" />
                    <span className="ml-3 text-[11px] font-bold text-zinc-400 uppercase tracking-widest">
                      AI Generated Output
                    </span>
                  </div>
                  <button 
                    onClick={handleCopy}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-bold hover:bg-zinc-50 transition-all active:scale-95 shadow-sm"
                  >
                    {copied ? (
                      <><Check className="w-3.5 h-3.5 text-green-500" /> Copied</>
                    ) : (
                      <><Copy className="w-3.5 h-3.5" /> Copy Markdown</>
                    )}
                  </button>
                </div>
                <div className="p-8 lg:p-12 max-h-[70vh] overflow-y-auto custom-scrollbar">
                  <article className="prose dark:prose-invert prose-zinc max-w-none prose-headings:font-black prose-p:text-zinc-600 dark:prose-p:text-zinc-400 prose-p:leading-relaxed">
                    <ReactMarkdown>{result}</ReactMarkdown>
                  </article>
                </div>
              </div>
            ) : (
              <div className="h-full min-h-[500px] flex flex-col items-center justify-center bg-zinc-50/50 dark:bg-zinc-900/30 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-[32px] text-zinc-400 transition-colors">
                <div className="w-20 h-20 bg-white dark:bg-zinc-900 rounded-3xl flex items-center justify-center shadow-sm mb-6">
                  <Send className="w-8 h-8 opacity-20" />
                </div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-2">Ready to write</h3>
                <p className="text-sm max-w-[240px] text-center leading-relaxed">
                  Fill in the details on the left and witness the magic of modern AI.
                </p>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-6 animate-in fade-in duration-300">
          <div className="bg-white dark:bg-zinc-900 p-10 rounded-[32px] max-w-md w-full shadow-2xl border border-zinc-200 dark:border-zinc-800 animate-in zoom-in-95 duration-300">
            <h2 className="text-3xl font-black mb-2 dark:text-zinc-50">Engine Config</h2>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-8">
              Your keys are stored locally and never touch our servers.
            </p>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-widest text-zinc-400">OpenAI Secret Key</label>
                <input
                  type="password"
                  value={apiKeys.openai}
                  onChange={(e) => setApiKeys({...apiKeys, openai: e.target.value})}
                  placeholder="sk-..."
                  className="w-full px-5 py-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 outline-none focus:border-blue-500 transition-all font-mono text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-widest text-zinc-400">Google Gemini Key</label>
                <input
                  type="password"
                  value={apiKeys.gemini}
                  onChange={(e) => setApiKeys({...apiKeys, gemini: e.target.value})}
                  placeholder="AIza..."
                  className="w-full px-5 py-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 outline-none focus:border-blue-500 transition-all font-mono text-sm"
                />
              </div>
            </div>
            <div className="mt-12 flex gap-4">
              <button
                onClick={() => saveKeys(apiKeys)}
                className="flex-1 py-4 bg-zinc-950 dark:bg-zinc-50 text-white dark:text-black font-bold rounded-2xl hover:shadow-lg transition-all"
              >
                Save Configuration
              </button>
              <button
                onClick={() => setShowSettings(false)}
                className="px-6 py-4 font-bold text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e4e4e7;
          border-radius: 10px;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #27272a;
        }
      `}</style>
    </div>
  );
}
