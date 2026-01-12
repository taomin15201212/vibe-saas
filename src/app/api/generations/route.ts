import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: '请先登录' },
        { status: 401 }
      );
    }

    const { prompt, code, provider, is_template, name, description } = await request.json();

    if (!prompt || !code) {
      return NextResponse.json(
        { error: 'Prompt和code不能为空' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('generations')
      .insert({
        user_id: user.id,
        prompt,
        code,
        provider: provider || 'openai',
        is_template: is_template || false,
        name: name || prompt.slice(0, 50),
        description: description || '',
      })
      .select()
      .single();

    if (error) {
      console.error('Save generation error:', error);
      return NextResponse.json(
        { error: '保存失败' },
        { status: 500 }
      );
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Save generation error:', error);
    return NextResponse.json(
      { error: '保存失败，请稍后重试' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: '请先登录' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const templateOnly = searchParams.get('template') === 'true';

    let query = supabase
      .from('generations')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (templateOnly) {
      query = query.eq('is_template', true);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json(
        { error: '获取记录失败' },
        { status: 500 }
      );
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Get generations error:', error);
    return NextResponse.json(
      { error: '获取记录失败' },
      { status: 500 }
    );
  }
}
