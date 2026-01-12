'use client';

import { Sandpack } from '@codesandbox/sandpack-react';
import { motion } from 'framer-motion';
import { Play, ExternalLink } from 'lucide-react';

interface LivePreviewProps {
  code: string;
}

export default function LivePreview({ code }: LivePreviewProps) {
  // 包装代码以在Sandpack中运行
  const wrapCode = (rawCode: string) => {
    // 提取组件代码并包装在App组件中
    return `
import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';

// 用户代码
${rawCode}

// 查找并渲染组件
const App = () => {
  // 尝试查找导出的组件
  ${getComponentWrapper(code)}
  return <div>请查看代码预览</div>;
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-xl"
    >
      {/* 头部 */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <Play className="w-4 h-4 text-green-500" />
          <span className="text-sm text-gray-700 dark:text-gray-200 font-medium">实时预览</span>
        </div>
        <a
          href="https://codesandbox.io/s/new"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-xs text-gray-500 hover:text-blue-500 transition-colors"
        >
          <ExternalLink className="w-3 h-3" />
          在CodeSandbox打开
        </a>
      </div>

      {/* Sandpack预览 */}
      <div className="h-[400px]">
        <Sandpack
          template="react-ts"
          files={{
            '/App.tsx': code,
          }}
          options={{
            showNavigator: false,
            showTabs: false,
            showLineNumbers: true,
            editorHeight: 400,
            resizablePanels: true,
            showConsole: false,
            showInlineErrors: true,
          }}
          theme="dark"
        />
      </div>
    </motion.div>
  );
}

// 辅助函数：生成组件包装器
function getComponentWrapper(code: string): string {
  // 尝试找到导出的默认组件或函数组件
  const lines = code.split('\n');
  let componentName = 'Component';

  for (const line of lines) {
    const exportMatch = line.match(/export\s+(?:default\s+)?(?:const|function|class)\s+(\w+)/);
    if (exportMatch) {
      componentName = exportMatch[1];
      break;
    }
  }

  return `
    // 尝试使用找到的组件
    let Component = null;
    try {
      // 尝试不同的组件名称
      const possibleNames = ['${componentName}', 'App', 'DefaultComponent', 'Main'];
      for (const name of possibleNames) {
        if (typeof window !== 'undefined' && (window as any)[name]) {
          Component = (window as any)[name];
          break;
        }
      }
    } catch (e) {}

    // 如果找不到，使用默认导出
    if (!Component && typeof window !== 'undefined') {
      // 渲染到root
    }
  `;
}
