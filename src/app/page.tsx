'use client';

import { useState } from 'react';

export default function Home() {
  const [topic, setTopic] = useState('');
  const [blogUrl, setBlogUrl] = useState(''); // New field
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [apiKeys, setApiKeys] = useState({
    openai: typeof window !== 'undefined' ? localStorage.getItem('openai_key') || '' : '',
    gemini: typeof window !== 'undefined' ? localStorage.getItem('gemini_key') || '' : '',
  });

  const saveKeys = (newKeys: typeof apiKeys) => {
    setApiKeys(newKeys);
    localStorage.setItem('openai_key', newKeys.openai);
    localStorage.setItem('gemini_key', newKeys.gemini);
    setShowSettings(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    const activeKey = apiKeys.openai || apiKeys.gemini;
    if (!activeKey) {
      alert('설정에서 API Key를 먼저 등록해주세요.');
      setShowSettings(true);
      return;
    }

    setIsGenerating(true);
    try {
      const { generateBlogDraft } = await import('./actions');
      // Pass both topic and blogUrl
      const draft = await generateBlogDraft(topic, activeKey, blogUrl);
      setResult(draft);
    } catch (error) {
      console.error('Generation failed:', error);
      setResult('오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] py-16 px-4 sm:px-6 lg:px-8 dark:bg-[#050505] font-sans selection:bg-blue-100 dark:selection:bg-blue-900/30">
      <div className="max-w-4xl mx-auto">
        <header className="mb-16 flex items-end justify-between border-b border-zinc-200 dark:border-zinc-800 pb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">🚀</span>
              <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                Blog Zen
              </h1>
            </div>
            <p className="text-zinc-500 dark:text-zinc-400 font-medium">
              AI-Powered Premium Blog Draft Generator
            </p>
          </div>
          <button
            onClick={() => setShowSettings(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-sm font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all shadow-sm"
          >
            <span>⚙️</span> API Settings
          </button>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Input Area */}
          <div className="lg:col-span-5 space-y-8">
            <section className="bg-white dark:bg-zinc-900/50 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-xl shadow-zinc-200/20 dark:shadow-none backdrop-blur-sm">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="blogUrl" className="block text-xs font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                    My Blog URL (Optional)
                  </label>
                  <input
                    type="url"
                    id="blogUrl"
                    value={blogUrl}
                    onChange={(e) => setBlogUrl(e.target.value)}
                    placeholder="https://yourblog.com"
                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="topic" className="block text-xs font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                    Blog Topic
                  </label>
                  <textarea
                    id="topic"
                    rows={4}
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="작성하고 싶은 블로그의 주제나 핵심 키워드를 입력하세요."
                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all resize-none placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isGenerating || !topic.trim()}
                  className="w-full py-4 bg-zinc-950 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-950 font-bold rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:hover:scale-100 shadow-lg shadow-zinc-950/20 dark:shadow-zinc-50/10"
                >
                  {isGenerating ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      Generating...
                    </span>
                  ) : 'Create Draft'}
                </button>
              </form>
            </section>
          </div>

          {/* Result Area */}
          <div className="lg:col-span-7">
            {result ? (
              <section className="bg-white dark:bg-zinc-900 p-10 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-2xl animate-in fade-in slide-in-from-right-8 duration-700">
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-zinc-100 dark:border-zinc-800">
                  <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-400">
                    Draft Output
                  </h2>
                  <button 
                    onClick={() => navigator.clipboard.writeText(result)}
                    className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Copy Markdown
                  </button>
                </div>
                <div className="prose dark:prose-invert max-w-none text-zinc-800 dark:text-zinc-200 leading-relaxed">
                  <div className="whitespace-pre-wrap">{result}</div>
                </div>
              </section>
            ) : (
              <div className="h-full min-h-[400px] flex flex-col items-center justify-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl text-zinc-400">
                <span className="text-4xl mb-4">✍️</span>
                <p className="font-medium text-sm">입력창에 주제를 넣고 초안을 생성해 보세요.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
