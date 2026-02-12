// 智谱AI API (https://bigmodel.cn/dev/howuse/intelligent-model)
// 注意：需要安装 zhipu-sdk 或使用REST API

const ZHIPU_API_BASE = 'https://open.bigmodel.cn/api/paas/v4';

export interface ZhipuMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export async function generateCodeWithZhipu(prompt: string, model: 'glm-4-plus' | 'glm-5' = 'glm-4-plus'): Promise<string> {
  const apiKey = process.env.ZHIPU_API_KEY;

  if (!apiKey) {
    throw new Error('ZHIPU_API_KEY not configured');
  }

  const response = await fetch(`${ZHIPU_API_BASE}/chat/completions`, {
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
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Zhipu API error: ${error}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || '';
}

export default { generateCode: generateCodeWithZhipu };
