'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { History, FolderOpen, Settings, LogOut, CreditCard } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';

export default function DashboardSidebar({ userId }: { userId: string }) {
  const pathname = usePathname();
  const supabase = createClient();
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const getProfile = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      setProfile(data);
    };
    getProfile();
  }, [userId]);

  const signOut = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  const navItems = [
    { href: '/dashboard', label: '生成历史', icon: History },
    { href: '/dashboard/templates', label: '我的模板', icon: FolderOpen },
    { href: '/dashboard/billing', label: '套餐升级', icon: CreditCard },
    { href: '/dashboard/settings', label: '设置', icon: Settings },
  ];

  return (
    <aside className="fixed left-0 top-16 bottom-0 w-64 py-6 px-4 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hidden md:block">
      <nav className="space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                isActive
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                  : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}

        <hr className="my-4 border-gray-200 dark:border-gray-700" />

        {/* User info */}
        <div className="flex items-center gap-3 px-4 py-3 mb-4">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-medium">
            {profile?.full_name?.[0] || userId[0]?.toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {profile?.full_name || '用户'}
            </p>
          </div>
        </div>

        <button
          onClick={signOut}
          className="w-full flex items-center gap-3 px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
        >
          <LogOut className="w-5 h-5" />
          退出登录
        </button>
      </nav>
    </aside>
  );
}
