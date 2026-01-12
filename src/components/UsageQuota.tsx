'use client';

import { useEffect, useState } from 'react';
import { Zap, AlertTriangle, Calendar } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { UsageInfo, getUsagePercentage, getDaysRemaining } from '@/lib/usage';
import Link from 'next/link';

export default function UsageQuota() {
  const [usage, setUsage] = useState<UsageInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchUsage = async () => {
      try {
        const { data } = await supabase
          .rpc('get_user_usage_info', {
            p_user_id: (await supabase.auth.getUser()).data.user?.id
          });

        if (data && data.length > 0) {
          setUsage(data[0] as UsageInfo);
        }
      } catch (error) {
        console.error('Error fetching usage:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsage();
  }, []);

  if (loading) {
    return (
      <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl p-4 animate-pulse">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2"></div>
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
      </div>
    );
  }

  if (!usage) {
    return (
      <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <Zap className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-200">本月使用量</span>
        </div>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">
          0 / 10 <span className="text-sm font-normal text-gray-500">次</span>
        </p>
        <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div className="bg-blue-600 h-2 rounded-full" style={{ width: '0%' }}></div>
        </div>
      </div>
    );
  }

  const percentage = getUsagePercentage(usage);
  const daysLeft = getDaysRemaining(usage);
  const isLow = percentage > 80;
  const isExceeded = percentage >= 100;

  return (
    <div className={`rounded-xl p-4 ${
      isExceeded
        ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
        : 'bg-gradient-to-r from-blue-500/10 to-purple-500/10'
    }`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Zap className={`w-4 h-4 ${isExceeded ? 'text-red-600' : 'text-blue-600'}`} />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-200">本月使用量</span>
        </div>
        {isExceeded ? (
          <span className="text-xs px-2 py-1 bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 rounded-full">
            已用完
          </span>
        ) : (
          <span className="text-xs text-gray-500 flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {daysLeft}天后重置
          </span>
        )}
      </div>

      <p className={`text-2xl font-bold ${isExceeded ? 'text-red-600' : 'text-gray-900 dark:text-white'}`}>
        {usage.current_count} / {usage.limit_count} <span className="text-sm font-normal text-gray-500">次</span>
      </p>

      {/* Progress bar */}
      <div className="mt-3 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${
            isExceeded
              ? 'bg-red-500'
              : isLow
              ? 'bg-yellow-500'
              : 'bg-blue-600'
          }`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>

      {/* Warning message */}
      {isLow && !isExceeded && (
        <div className="mt-3 flex items-center gap-2 text-sm text-yellow-600 dark:text-yellow-400">
          <AlertTriangle className="w-4 h-4" />
          <span>即将用完，升级获取更多次数</span>
        </div>
      )}

      {/* Upgrade CTA */}
      {isLow && (
        <Link
          href="/dashboard/billing"
          className={`mt-3 block w-full py-2 px-4 text-center rounded-lg text-sm font-medium transition-colors ${
            isExceeded
              ? 'bg-red-600 hover:bg-red-700 text-white'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {isExceeded ? '立即升级' : '升级套餐'}
        </Link>
      )}

      {/* Plan info */}
      <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">当前套餐</span>
          <span className={`font-medium ${
            usage.is_premium
              ? 'text-purple-600 dark:text-purple-400'
              : 'text-gray-700 dark:text-gray-200'
          }`}>
            {usage.plan_name === 'free' ? '免费版' :
             usage.plan_name === 'pro' ? '专业版' :
             usage.plan_name === 'team' ? '团队版' : '免费版'}
          </span>
        </div>
      </div>
    </div>
  );
}
