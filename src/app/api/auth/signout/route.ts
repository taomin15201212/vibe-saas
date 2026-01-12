import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    await supabase.auth.signOut();

    return NextResponse.json({ message: '退出成功' });
  } catch (error) {
    console.error('Signout error:', error);
    return NextResponse.json(
      { error: '退出失败，请稍后重试' },
      { status: 500 }
    );
  }
}
