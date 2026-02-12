'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Code2, Eye, Zap, User, Save, FolderOpen } from 'lucide-react';
import Link from 'next/link';
import PromptInput from '@/components/PromptInput';
import CodePreview from '@/components/CodePreview';
import LivePreview from '@/components/LivePreview';
import { createClient } from '@/lib/supabase/client';

type ViewMode = 'split' | 'code' | 'preview';

export default function DemoPage() {
  const [prompt, setPrompt] = useState('');
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('split');
  const [provider, setProvider] = useState<'openai' | 'zhipu' | 'glm5'>('openai');
  const [user, setUser] = useState<any>(null);
  const [saved, setSaved] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  const handleGenerate = async (input: string) => {
    setPrompt(input);
    setIsLoading(true);
    setError('');
    setCode('');
    setSaved(false);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: input, provider }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.code === 'USAGE_LIMIT_EXCEEDED') {
          setError(
            <div className="flex flex-col gap-2">
              <span>{data.error}</span>
              <button
                onClick={() => (window.location.href = '/dashboard/billing')}
                className="text-blue-600 dark:text-blue-400 hover:underline text-left"
              >
                升级套餐获取更多次数 →
              </button>
            </div>
          );
        } else {
          throw new Error(data.error || '生成失败，请重试');
        }
        return;
      }

      setCode(data.code);
    } catch (err) {
      setError(err instanceof Error ? err.message : '生成失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) {
      window.location.href = '/auth';
      return;
    }

    try {
      const response = await fetch('/api/generations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          code,
          provider,
          is_template: false,
        }),
      });

      if (response.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    } catch (err) {
      console.error('Save error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900">
      {/* 顶部导航 */}
      <header className="border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              VibeSaaS
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* AI Provider 选择 */}
            <select
              value={provider}
              onChange={(e) => setProvider(e.target.value as 'openai' | 'zhipu' | 'glm5')}
              className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-800 rounded-lg border-0 focus:ring-2 focus:ring-blue-500"
            >
              <option value="openai">OpenAI</option>
              <option value="zhipu">智谱AI (GLM-4)</option>
              <option value="glm5">智谱AI (GLM-5)</option>
            </select>

            {user ? (
              <Link
                href="/dashboard"
                className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                <User className="w-4 h-4" />
                我的控制台
              </Link>
            ) : (
              <Link
                href="/auth"
                className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                <User className="w-4 h-4" />
                登录
              </Link>
            )}

            <a
              href="/"
              className="text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              返回首页
            </a>
          </div>
        </div>
      </header>

      {/* 主要内容 */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero区域 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
            用自然语言构建 <span className="text-blue-600">Web应用</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            描述你想要的功能，AI立即生成可运行的React代码。体验vibe coding的魅力！
          </p>
        </motion.div>

        {/* 输入区域 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <PromptInput
            onSubmit={handleGenerate}
            isLoading={isLoading}
            placeholder="描述你想要的功能，例如：创建一个待办事项列表..."
          />
        </motion.div>

        {/* 错误提示 */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400"
            >
              {typeof error === 'string' ? error : error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* 结果区域 */}
        <AnimatePresence mode="wait">
          {code && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
            >
              {/* 工具栏 */}
              <div className="flex items-center justify-between mb-4">
                {/* 视图切换 */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setViewMode('split')}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      viewMode === 'split'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Code2 className="w-4 h-4" />
                    代码+预览
                  </button>
                  <button
                    onClick={() => setViewMode('code')}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      viewMode === 'code'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Code2 className="w-4 h-4" />
                    仅代码
                  </button>
                  <button
                    onClick={() => setViewMode('preview')}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      viewMode === 'preview'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Eye className="w-4 h-4" />
                    仅预览
                  </button>
                </div>

                {/* 保存按钮 */}
                <button
                  onClick={handleSave}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    saved
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  <Save className="w-4 h-4" />
                  {saved ? '已保存' : '保存记录'}
                </button>
              </div>

              {/* 内容展示 */}
              <div
                className={`grid gap-4 ${
                  viewMode === 'split' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'
                }`}
              >
                {/* 代码区域 */}
                {(viewMode === 'split' || viewMode === 'code') && (
                  <div>
                    <h3 className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300 mb-3">
                      <Code2 className="w-4 h-4" />
                      生成的代码
                    </h3>
                    <CodePreview code={code} />
                  </div>
                )}

                {/* 预览区域 */}
                {(viewMode === 'split' || viewMode === 'preview') && (
                  <div>
                    <h3 className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300 mb-3">
                      <Eye className="w-4 h-4" />
                      实时预览
                    </h3>
                    <LivePreview code={code} />
                  </div>
                )}
              </div>

              {/* 操作提示 */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800"
              >
                <div className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                      继续优化
                    </h4>
                    <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
                      如果结果不完全符合预期，可以继续描述你的修改需求：
                    </p>
                    <PromptInput
                      onSubmit={handleGenerate}
                      placeholder="修改需求，例如：把背景改成蓝色，添加删除功能..."
                    />
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* 底部 */}
      <footer className="border-t border-gray-200 dark:border-gray-800 mt-16 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>Powered by VibeSaaS • 用自然语言构建你的想法</p>
        </div>
      </footer>
    </div>
  );
}
