// Usage tracking utility functions
import { createClient } from '@/lib/supabase/client';

export interface UsageInfo {
  current_count: number;
  limit_count: number;
  remaining_count: number;
  period_start: string;
  period_end: string;
  plan_name: string;
  is_premium: boolean;
}

export interface UsageCheckResult {
  allowed: boolean;
  reason?: string;
  usage?: UsageInfo;
}

/**
 * Get current usage information for a user
 */
export async function getUsageInfo(): Promise<UsageInfo | null> {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .rpc('get_user_usage_info', {
        p_user_id: (await supabase.auth.getUser()).data.user?.id
      });

    if (error) {
      console.error('Error fetching usage info:', error);
      return null;
    }

    if (data && data.length > 0) {
      return data[0] as UsageInfo;
    }

    return null;
  } catch (error) {
    console.error('Error in getUsageInfo:', error);
    return null;
  }
}

/**
 * Check if user can make another generation
 */
export async function checkUsageAllowed(): Promise<UsageCheckResult> {
  const supabase = createClient();

  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { allowed: false, reason: 'Please sign in to continue' };
    }

    // Call the database function
    const { data: available, error } = await supabase
      .rpc('check_usage_available', { p_user_id: user.id });

    if (error) {
      console.error('Error checking usage:', error);
      return { allowed: false, reason: 'Failed to check usage' };
    }

    if (!available) {
      const usageInfo = await getUsageInfo();
      return {
        allowed: false,
        reason: 'You have reached your monthly generation limit. Upgrade to Pro for unlimited generations.',
        usage: usageInfo || undefined
      };
    }

    const usageInfo = await getUsageInfo();
    return { allowed: true, usage: usageInfo || undefined };
  } catch (error) {
    console.error('Error in checkUsageAllowed:', error);
    return { allowed: false, reason: 'Failed to check usage' };
  }
}

/**
 * Record a generation (increment usage count)
 */
export async function recordGeneration(): Promise<boolean> {
  const supabase = createClient();

  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return false;
    }

    const { error } = await supabase
      .rpc('increment_usage', { p_user_id: user.id });

    if (error) {
      console.error('Error recording generation:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in recordGeneration:', error);
    return false;
  }
}

/**
 * Format usage display text
 */
export function formatUsageDisplay(usage: UsageInfo): string {
  return `${usage.current_count} / ${usage.limit_count} 次`;
}

/**
 * Get usage percentage
 */
export function getUsagePercentage(usage: UsageInfo): number {
  return Math.min((usage.current_count / usage.limit_count) * 100, 100);
}

/**
 * Check if usage is running low (below 20%)
 */
export function isUsageLow(usage: UsageInfo): boolean {
  return usage.current_count / usage.limit_count > 0.8;
}

/**
 * Get days remaining in current period
 */
export function getDaysRemaining(usage: UsageInfo): number {
  const end = new Date(usage.period_end);
  const now = new Date();
  const diff = end.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}
