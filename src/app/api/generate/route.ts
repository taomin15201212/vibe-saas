import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { createClient } from '@/lib/supabase/server';

// 动态路由，避免构建时初始化
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, provider = 'openai' } = body as { prompt: string; provider?: 'openai' | 'zhipu' | 'glm5' };

    if (!prompt) {
      return NextResponse.json(
        { error: '请输入需求描述' },
        { status: 400 }
      );
    }

    // Check authentication and usage limits
    const supabase = createClient();
    let userId: string | null = null;

    try {
      const { data } = await supabase.auth.getUser();
      userId = data.user?.id || null;
    } catch (e) {
      // User not authenticated, continue as anonymous
      userId = null;
    }

    if (userId) {
      // For logged-in users, check usage limits
      try {
        const { data: usageAvailable, error: checkError } = await supabase
          .rpc('check_usage_available', { p_user_id: userId });

        if (checkError) {
          console.error('Error checking usage:', checkError);
        }

        if (usageAvailable === false) {
          return NextResponse.json(
            {
              error: '已达到本月生成次数上限',
              code: 'USAGE_LIMIT_EXCEEDED',
              upgradeUrl: '/dashboard/billing'
            },
            { status: 403 }
          );
        }
      } catch (e) {
        console.error('Usage check error:', e);
      }
    }

    let code = '';

    if (provider === 'openai') {
      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });

      const systemPrompt = `你是一个专业的React开发助手。用户会用中文描述他们想要的Web界面或功能。

你的任务是：
1. 理解用户需求
2. 生成完整的、可运行的React组件代码
3. 使用Tailwind CSS进行样式设计
4. 代码应该简洁、现代、响应式

请直接输出代码，不要有markdown代码块标记，不要有额外解释。

代码要求：
- 使用TypeScript
- 完整import语句
- 包含必要的样式
- 支持直接复制使用`;

      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      });

      code = response.choices[0]?.message?.content || '';
    } else {
      // 智谱AI (GLM-4 / GLM-5)
      const apiKey = process.env.ZHIPU_API_KEY;
      if (!apiKey) {
        return NextResponse.json(
          { error: '智谱AI API key未配置，请设置ZHIPU_API_KEY环境变量' },
          { status: 500 }
        );
      }

      const model = provider === 'glm5' ? 'glm-5' : 'glm-4-plus';

      const response = await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: [
            {
              role: 'system',
              content: `你是一个专业的React开发助手。用户会用中文描述他们想要的Web界面或功能。

你的任务是：
1. 理解用户需求
2. 生成完整的、可运行的React组件代码
3. 使用Tailwind CSS进行样式设计
4. 代码应该简洁、现代、响应式

请直接输出代码，不要有markdown代码块标记，不要有额外解释。

代码要求：
- 使用TypeScript
- 完整import语句
- 包含必要的样式
- 支持直接复制使用`
            },
            { role: 'user', content: prompt }
          ],
          temperature: 0.7,
          max_tokens: 2000,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`智谱AI API错误: ${error}`);
      }

      const data = await response.json();
      code = data.choices?.[0]?.message?.content || '';
    }

    // 清理代码：移除markdown代码块标记
    const cleanedCode = code
      .replace(/```(?:tsx?|jsx?|typescript|javascript)?\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();

    // Record usage for logged-in users
    if (userId) {
      try {
        await supabase.rpc('increment_usage', { p_user_id: userId });
      } catch (e) {
        console.error('Error recording usage:', e);
      }
    }

    return NextResponse.json({
      code: cleanedCode,
      provider,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Code generation error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '代码生成失败，请稍后重试' },
      { status: 500 }
    );
  }
}
