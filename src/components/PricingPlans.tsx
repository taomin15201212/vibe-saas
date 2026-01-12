'use client';

import { useState, useEffect } from 'react';
import { Check, Zap, Users, Crown, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface Plan {
  id: string;
  name: string;
  description: string;
  price_monthly: number;
  price_yearly: number;
  generation_limit: number;
  team_members: number;
  features: string[];
  is_popular?: boolean;
}

export default function PricingPlans({ onSelectPlan }: { onSelectPlan?: (planId: string) => void }) {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const supabase = createClient();

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const { data } = await supabase
          .from('subscription_plans')
          .select('*')
          .eq('is_active', true)
          .order('price_monthly');

        if (data) {
          // Add popular flag
          const plansWithPopular = data.map((plan, index) => ({
            ...plan,
            is_popular: index === 1, // Mark pro as popular
          }));
          setPlans(plansWithPopular);
        }
      } catch (error) {
        console.error('Error fetching plans:', error);
        // Use default plans
        setPlans([
          {
            id: 'free',
            name: 'free',
            description: '免费套餐',
            price_monthly: 0,
            price_yearly: 0,
            generation_limit: 10,
            team_members: 1,
            features: ['基础代码生成', '每日10次限制', '3天历史记录'],
          },
          {
            id: 'pro',
            name: 'pro',
            description: '专业套餐',
            price_monthly: 29,
            price_yearly: 290,
            generation_limit: 500,
            team_members: 5,
            features: ['无限代码生成', '历史记录保存', '模板收藏', '优先支持'],
            is_popular: true,
          },
          {
            id: 'team',
            name: 'team',
            description: '团队套餐',
            price_monthly: 99,
            price_yearly: 990,
            generation_limit: 2000,
            team_members: 20,
            features: ['无限代码生成', '团队协作', '共享模板', 'API访问', '专属支持'],
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const getPrice = (plan: Plan) => {
    return billingCycle === 'monthly' ? plan.price_monthly : plan.price_yearly;
  };

  const getIcon = (name: string) => {
    switch (name) {
      case 'free': return Zap;
      case 'pro': return Crown;
      case 'team': return Users;
      default: return Zap;
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Billing cycle toggle */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex items-center gap-3 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              billingCycle === 'monthly'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            月付
          </button>
          <button
            onClick={() => setBillingCycle('yearly')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              billingCycle === 'yearly'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            年付
            <span className="ml-1 text-xs text-green-600">省17%</span>
          </button>
        </div>
      </div>

      {/* Plans grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const Icon = getIcon(plan.name);
          const price = getPrice(plan);

          return (
            <div
              key={plan.id}
              className={`relative rounded-2xl p-6 transition-all duration-200 ${
                plan.is_popular
                  ? 'bg-gradient-to-b from-blue-50 to-white dark:from-blue-900/20 dark:to-gray-900 border-2 border-blue-500 scale-105 shadow-xl'
                  : 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 hover:shadow-lg'
              }`}
            >
              {plan.is_popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded-full">
                  最受欢迎
                </div>
              )}

              <div className="flex items-center gap-3 mb-4">
                <div className={`p-2 rounded-lg ${
                  plan.name === 'free'
                    ? 'bg-gray-100 dark:bg-gray-800'
                    : plan.name === 'pro'
                    ? 'bg-purple-100 dark:bg-purple-900/30'
                    : 'bg-blue-100 dark:bg-blue-900/30'
                }`}>
                  <Icon className={`w-5 h-5 ${
                    plan.name === 'free'
                      ? 'text-gray-600'
                      : plan.name === 'pro'
                      ? 'text-purple-600'
                      : 'text-blue-600'
                  }`} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    {plan.description}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {plan.generation_limit === -1 ? '无限' : plan.generation_limit} 次/月
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-gray-900 dark:text-white">
                    {price === 0 ? '免费' : `¥${price}`}
                  </span>
                  {price > 0 && (
                    <span className="text-gray-500">/{billingCycle === 'monthly' ? '月' : '年'}</span>
                  )}
                </div>
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">{feature}</span>
                  </li>
                ))}
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {plan.team_members} 名团队成员
                  </span>
                </li>
              </ul>

              <button
                onClick={() => onSelectPlan?.(plan.id)}
                className={`w-full py-3 px-4 rounded-xl font-medium transition-colors ${
                  plan.name === 'free'
                    ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700'
                    : plan.is_popular
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100'
                }`}
              >
                {price === 0 ? '当前套餐' : '选择此套餐'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
