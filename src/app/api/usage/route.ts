import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

// GET /api/usage - Get current usage info
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Call the get_user_usage_info function
    const { data: usageInfo, error: usageError } = await supabase
      .rpc('get_user_usage_info', { p_user_id: user.id });

    if (usageError) {
      console.error('Error fetching usage info:', usageError);
      // Fallback: get from usage_records directly
      const { data: records, error: recordError } = await supabase
        .from('usage_records')
        .select('*')
        .eq('user_id', user.id)
        .lte('period_start', new Date().toISOString())
        .gt('period_end', new Date().toISOString())
        .single();

      if (recordError) {
        // No usage record exists, return default
        return NextResponse.json({
          current_count: 0,
          limit_count: 10,
          remaining_count: 10,
          period_start: new Date().toISOString(),
          period_end: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString(),
          plan_name: 'free',
          is_premium: false
        });
      }

      return NextResponse.json({
        current_count: records.generation_count,
        limit_count: 10,
        remaining_count: 10 - records.generation_count,
        period_start: records.period_start,
        period_end: records.period_end,
        plan_name: 'free',
        is_premium: false
      });
    }

    if (usageInfo && usageInfo.length > 0) {
      return NextResponse.json(usageInfo[0]);
    }

    // No usage record, return default
    return NextResponse.json({
      current_count: 0,
      limit_count: 10,
      remaining_count: 10,
      period_start: new Date().toISOString(),
      period_end: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString(),
      plan_name: 'free',
      is_premium: false
    });
  } catch (error) {
    console.error('Usage API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch usage info' },
      { status: 500 }
    );
  }
}

// POST /api/usage - Increment usage count (called after successful generation)
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if usage is available first
    const { data: usageAvailable, error: checkError } = await supabase
      .rpc('check_usage_available', { p_user_id: user.id });

    if (checkError) {
      console.error('Error checking usage:', checkError);
      return NextResponse.json(
        { error: 'Failed to check usage availability' },
        { status: 500 }
      );
    }

    if (!usageAvailable) {
      return NextResponse.json(
        { error: 'Usage limit exceeded. Please upgrade your plan.' },
        { status: 403 }
      );
    }

    // Increment usage
    const { data: newCount, error: incrementError } = await supabase
      .rpc('increment_usage', { p_user_id: user.id });

    if (incrementError) {
      console.error('Error incrementing usage:', incrementError);
      return NextResponse.json(
        { error: 'Failed to increment usage' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      new_count: newCount
    });
  } catch (error) {
    console.error('Usage increment error:', error);
    return NextResponse.json(
      { error: 'Failed to record usage' },
      { status: 500 }
    );
  }
}
