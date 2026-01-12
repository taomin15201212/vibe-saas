'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import PricingPlans from '@/components/PricingPlans';
import UsageQuota from '@/components/UsageQuota';

export default function BillingPage() {
  const [user, setUser] = useState<any>(null);
  const [subscription, setSubscription] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data } = await supabase
          .from('user_subscriptions')
          .select('*, subscription_plans(*)')
          .eq('user_id', user.id)
          .eq('status', 'active')
          .single();

        setSubscription(data);
      }
    };

    checkUser();
  }, []);

  const handleSelectPlan = async (planId: string) => {
    if (!user) {
      window.location.href = '/auth?redirect=/dashboard/billing';
      return;
    }

    if (planId === 'free') {
      // Downgrade to free
      const { error } = await supabase
        .from('user_subscriptions')
        .update({ status: 'cancelled' })
        .eq('user_id', user.id);

      if (!error) {
        window.location.reload();
      }
      return;
    }

    // For paid plans, redirect to checkout (placeholder for Stripe integration)
    alert('订阅功能即将上线，敬请期待！');
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          套餐升级
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          选择适合你的套餐，解锁无限创意
        </p>
      </div>

      {/* Current usage */}
      {user && (
        <div className="max-w-md">
          <UsageQuota />
        </div>
      )}

      {/* Current subscription */}
      {subscription && (
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 dark:text-blue-400">当前套餐</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                {subscription.subscription_plans?.description || '免费版'}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">到期时间</p>
              <p className="text-gray-900 dark:text-white">
                {new Date(subscription.current_period_end).toLocaleDateString('zh-CN')}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Pricing plans */}
      <PricingPlans onSelectPlan={handleSelectPlan} />

      {/* FAQ */}
      <div className="max-w-3xl mx-auto mt-12">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 text-center">
          常见问题
        </h2>
        <div className="space-y-4">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 dark:text-white mb-2">
              付款安全吗？
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              我们使用 Stripe 进行支付处理，你的付款信息不会被我们存储。
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 dark:text-white mb-2">
              可以随时取消吗？
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              可以随时取消，取消后你的套餐将持续到当前计费周期结束。
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 dark:text-white mb-2">
              团队套餐有什么优势？
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              团队套餐支持多人协作，共享模板池，统一管理使用额度，适合公司团队使用。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
