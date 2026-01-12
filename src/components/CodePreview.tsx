'use client';

import { useState } from 'react';
import { Copy, Check, Code2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface CodePreviewProps {
  code: string;
  language?: string;
}

export default function CodePreview({ code, language = 'tsx' }: CodePreviewProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-900 shadow-xl"
    >
      {/* 头部 */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <Code2 className="w-4 h-4 text-blue-400" />
          <span className="text-sm text-gray-300 font-mono">Component.tsx</span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2 py-1 text-xs text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-green-400" />
              <span className="text-green-400">已复制</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>复制代码</span>
            </>
          )}
        </button>
      </div>

      {/* 代码内容 */}
      <div className="relative max-h-[500px] overflow-auto">
        <pre className="p-4 text-sm font-mono text-gray-100 leading-relaxed overflow-x-auto">
          <code>{code}</code>
        </pre>
      </div>

      {/* 行号装饰（简单实现） */}
      <style jsx>{`
        pre {
          counter-reset: line;
        }
        code::before {
          counter-increment: line;
          content: counter(line);
          display: inline-block;
          width: 1rem;
          margin-right: 1rem;
          text-align: right;
          color: #4b5563;
          user-select: none;
        }
        code {
          counter-set: line;
        }
      `}</style>
    </motion.div>
  );
}
