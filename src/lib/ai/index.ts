import { generateCode as generateWithOpenAI } from './openai';
import { generateCodeWithZhipu } from './zhipu';

export type AIProvider = 'openai' | 'zhipu';

export interface GenerateCodeParams {
  prompt: string;
  provider?: AIProvider;
}

export async function generateCode({ prompt, provider = 'openai' }: GenerateCodeParams): Promise<string> {
  switch (provider) {
    case 'openai':
      return generateWithOpenAI(prompt, 'openai');
    case 'zhipu':
      return generateCodeWithZhipu(prompt);
    default:
      return generateWithOpenAI(prompt, 'openai');
  }
}

// 流式生成（未来扩展）
export async function* generateCodeStream(params: GenerateCodeParams) {
  // TODO: 实现流式输出
  const code = await generateCode(params);
  yield code;
}

export { generateWithOpenAI, generateCodeWithZhipu };
