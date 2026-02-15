'use client';

import { useState } from 'react';

export default function Home() {
  const [topic, setTopic] = useState('');
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
      // Pass the key to the server action
      const draft = await generateBlogDraft(topic, activeKey);
      setResult(draft);
    } catch (error) {
      console.error('Generation failed:', error);
      setResult('오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 py-12 px-4 sm:px-6 lg:px-8 dark:bg-zinc-950 font-sans">
      <div className="max-w-3xl mx-auto">
        <header className="mb-12 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-4">
              🚀 블로그 초안 생성기
            </h1>
            <p className="text-lg text-zinc-600 dark:text-zinc-400">
              사용자 API Key를 사용하여 보안과 비용을 한 번에.
            </p>
          </div>
          <button
            onClick={() => setShowSettings(true)}
            className="p-3 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
            title="Settings"
          >
            ⚙️
          </button>
        </header>

        {showSettings && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-zinc-900 p-8 rounded-2xl max-w-md w-full shadow-xl border border-zinc-200 dark:border-zinc-800">
              <h2 className="text-2xl font-bold mb-6 dark:text-zinc-50">API 설정</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1 dark:text-zinc-300">OpenAI Key</label>
                  <input
                    type="password"
                    value={apiKeys.openai}
                    onChange={(e) => setApiKeys({...apiKeys, openai: e.target.value})}
                    placeholder="sk-..."
                    className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent dark:text-zinc-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 dark:text-zinc-300">Gemini Key</label>
                  <input
                    type="password"
                    value={apiKeys.gemini}
                    onChange={(e) => setApiKeys({...apiKeys, gemini: e.target.value})}
                    placeholder="AIza..."
                    className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent dark:text-zinc-100"
                  />
                </div>
              </div>
              <div className="mt-8 flex gap-3">
                <button
                  onClick={() => saveKeys(apiKeys)}
                  className="flex-1 py-2 bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 font-bold rounded-lg"
                >
                  저장하기
                </button>
                <button
                  onClick={() => setShowSettings(false)}
                  className="px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg dark:text-zinc-300"
                >
                  취소
                </button>
              </div>
            </div>
          </div>
        )}

        <main className="space-y-8">
          <section className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="topic" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  블로그 주제
                </label>
                <input
                  type="text"
                  id="topic"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="예: 2026년 AI 트렌드, 건강한 식습관 등"
                  className="w-full px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>
              <button
                type="submit"
                disabled={isGenerating || !topic.trim()}
                className="w-full py-4 bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 font-semibold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {isGenerating ? '⏳ 생성 중...' : '초안 생성하기'}
              </button>
            </form>
          </section>

          {result && (
            <section className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-4 border-b pb-2">
                Draft Result
              </h2>
              <div className="prose dark:prose-invert max-w-none text-zinc-800 dark:text-zinc-200 whitespace-pre-wrap">
                {result}
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
