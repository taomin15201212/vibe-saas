import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateCode(prompt: string, provider: 'openai' | 'zhipu' = 'openai'): Promise<string> {
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

  if (provider === 'openai') {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    return response.choices[0]?.message?.content || '';
  }

  throw new Error('Provider not implemented');
}

export default openai;
