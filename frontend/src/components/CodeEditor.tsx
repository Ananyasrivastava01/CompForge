'use client';

import { useState } from 'react';
import { Copy, Download } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface CodeEditorProps {
  jsxCode: string;
  cssCode: string;
  onCopy?: (code: string) => void;
  onDownload?: () => void;
}

type TabType = 'jsx' | 'css';

export default function CodeEditor({ jsxCode, cssCode, onCopy, onDownload }: CodeEditorProps) {
  const [activeTab, setActiveTab] = useState<TabType>('jsx');

  const handleCopy = () => {
    const codeToCopy = activeTab === 'jsx' ? jsxCode : cssCode;
    navigator.clipboard.writeText(codeToCopy);
    onCopy?.(codeToCopy);
  };

  const handleDownload = () => {
    onDownload?.();
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      {/* Tab Headers */}
      <div className="flex border-b bg-gray-50">
        <button
          onClick={() => setActiveTab('jsx')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'jsx'
              ? 'text-blue-600 border-b-2 border-blue-600 bg-white'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          JSX/TSX
        </button>
        <button
          onClick={() => setActiveTab('css')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'css'
              ? 'text-blue-600 border-b-2 border-blue-600 bg-white'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          CSS
        </button>
        
        {/* Action Buttons */}
        <div className="ml-auto flex items-center space-x-2 px-4">
          <button
            onClick={handleCopy}
            className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
            title="Copy code"
          >
            <Copy className="h-4 w-4" />
          </button>
          <button
            onClick={handleDownload}
            className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
            title="Download code"
          >
            <Download className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Code Display */}
      <div className="bg-gray-900">
        {activeTab === 'jsx' ? (
          <SyntaxHighlighter
            language="jsx"
            style={tomorrow}
            customStyle={{
              margin: 0,
              padding: '1rem',
              fontSize: '0.875rem',
              lineHeight: '1.5',
              backgroundColor: 'transparent',
            }}
            showLineNumbers={true}
            wrapLines={true}
          >
            {jsxCode || '// No JSX code available'}
          </SyntaxHighlighter>
        ) : (
          <SyntaxHighlighter
            language="css"
            style={tomorrow}
            customStyle={{
              margin: 0,
              padding: '1rem',
              fontSize: '0.875rem',
              lineHeight: '1.5',
              backgroundColor: 'transparent',
            }}
            showLineNumbers={true}
            wrapLines={true}
          >
            {cssCode || '/* No CSS code available */'}
          </SyntaxHighlighter>
        )}
      </div>
    </div>
  );
} 