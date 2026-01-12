import { createClient } from '@/lib/supabase/server';
import { Sparkles, Clock, ChevronRight, Copy, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow } from '@/lib/utils';
import UsageQuota from '@/components/UsageQuota';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  // Fetch generation history
  const { data: history } = await supabase
    .from('generations')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(20);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            生成历史
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            查看你所有的AI代码生成记录
          </p>
        </div>
        <Link
          href="/demo"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <Sparkles className="w-4 h-4" />
          新建生成
        </Link>
      </div>

      {/* Usage quota */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <UsageQuota />
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
          <div className="text-3xl font-bold text-gray-900 dark:text-white">
            {history?.length || 0}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            总生成次数
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
          <div className="text-3xl font-bold text-gray-900 dark:text-white">
            {history?.filter(g => g.is_template).length || 0}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            保存的模板
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
          <div className="text-3xl font-bold text-gray-900 dark:text-white">
            {history ? formatDistanceToNow(new Date(history[history.length - 1]?.created_at || Date.now())) : '-'}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            最近活动
          </div>
        </div>
      </div>

      {/* History list */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        {history && history.length > 0 ? (
          <div className="divide-y divide-gray-200 dark:divide-gray-800">
            {history.map((item) => (
              <div
                key={item.id}
                className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {item.prompt}
                      </span>
                      {item.is_template && (
                        <span className="px-2 py-0.5 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full">
                          模板
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {formatDistanceToNow(new Date(item.created_at))}
                      </span>
                      <span className="capitalize">
                        {item.provider}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/demo?prompt=${encodeURIComponent(item.prompt)}&code=${encodeURIComponent(item.code)}`}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      title="继续编辑"
                    >
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <Sparkles className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              还没有生成记录
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              开始你的第一次AI代码生成吧！
            </p>
            <Link
              href="/demo"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              立即体验
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
