import Link from 'next/link';
import { Sparkles, Code2, Zap, Globe, ChevronRight, Rocket } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900">
      {/* 导航栏 */}
      <nav className="border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
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
            <Link
              href="/demo"
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              在线演示
            </Link>
            <Link
              href="/demo"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              立即体验
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 pt-20 pb-32">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-full border border-blue-200 dark:border-blue-800 mb-8">
            <Zap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm text-blue-700 dark:text-blue-300">
              AI驱动的Web开发新时代
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            用自然语言
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              构建Web应用
            </span>
          </h1>

          <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto">
            告别繁琐的代码编写。只需描述你想要的功能，AI立即生成可运行的React代码。
            体验vibe coding的魅力，让开发变得简单又有趣。
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/demo"
              className="group flex items-center gap-2 px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              <Rocket className="w-5 h-5" />
              开始免费体验
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="#features"
              className="flex items-center gap-2 px-8 py-4 text-lg font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              了解更多
            </Link>
          </div>
        </div>

        {/* 特性展示 */}
        <section id="features" className="mt-32">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-16">
            三大核心优势
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* 特性1 */}
            <div className="group p-8 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-colors shadow-lg hover:shadow-xl">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Globe className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                自然语言交互
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                用中文描述你想要的功能，AI理解你的意图并生成代码。不需要精通编程语法，只需表达清楚需求。
              </p>
            </div>

            {/* 特性2 */}
            <div className="group p-8 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-purple-500 dark:hover:border-purple-500 transition-colors shadow-lg hover:shadow-xl">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Code2 className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                即时代码生成
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                基于先进的AI模型，在几秒钟内生成完整、可运行的React组件代码。代码质量高，结构清晰。
              </p>
            </div>

            {/* 特性3 */}
            <div className="group p-8 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-pink-500 dark:hover:border-pink-500 transition-colors shadow-lg hover:shadow-xl">
              <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                实时预览
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                生成代码后立即看到效果。支持在线预览和迭代修改，所见即所得的開發体验。
              </p>
            </div>
          </div>
        </section>

        {/* 使用场景 */}
        <section className="mt-32">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-4">
            谁适合使用
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto">
            无论你是编程新手还是专业开发者，VibeSaaS都能帮助你更快地实现想法
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: '🎯', title: '创业者', desc: '快速验证想法' },
              { icon: '📚', title: '学习者', desc: '学习React开发' },
              { icon: '💼', title: '产品经理', desc: '快速原型设计' },
              { icon: '🛠️', title: '开发者', desc: '加速开发效率' },
            ].map((item) => (
              <div
                key={item.title}
                className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 text-center"
              >
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mt-32 text-center">
          <div className="p-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl">
            <h2 className="text-3xl font-bold text-white mb-4">
              准备好开始了吗？
            </h2>
            <p className="text-blue-100 mb-8 max-w-xl mx-auto">
              立即体验用自然语言构建Web应用的乐趣。第一次使用完全免费！
            </p>
            <Link
              href="/demo"
              className="inline-flex items-center gap-2 px-8 py-4 text-lg font-semibold text-blue-600 bg-white rounded-xl hover:bg-blue-50 transition-colors shadow-lg"
            >
              立即开始
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-gray-900 dark:text-white">
                VibeSaaS
              </span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              用自然语言构建你的想法 • AI驱动的Web开发工具
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
