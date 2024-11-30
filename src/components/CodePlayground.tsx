import React, { useEffect, useRef, useState } from 'react';
import * as monaco from 'monaco-editor';

interface CodePlaygroundProps {
  initialCode?: string;
  language?: string;
  height?: string;
  id?: string;
}

export default function CodePlayground({
  initialCode = '# Write your Python code here\n\n',
  language = 'python',
  height = '400px',
  id = 'editor-' + Math.random().toString(36).substr(2, 9)
}: CodePlaygroundProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [output, setOutput] = useState<string>('');
  const [editor, setEditor] = useState<monaco.editor.IStandaloneCodeEditor | null>(null);

  useEffect(() => {
    if (!editorRef.current) return;

    const isDark = document.documentElement.classList.contains('dark');
    const initialTheme = isDark ? 'vs-dark' : 'vs';

    const ed = monaco.editor.create(editorRef.current, {
      value: initialCode,
      language,
      theme: initialTheme,
      automaticLayout: true,
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      fontSize: 14,
      fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
      lineNumbers: 'on',
      roundedSelection: true,
      scrollbar: {
        verticalScrollbarSize: 8,
        horizontalScrollbarSize: 8
      },
      overviewRulerLanes: 0,
      renderLineHighlight: 'all',
      lineHeight: 21,
      padding: { top: 8, bottom: 8 }
    });

    setEditor(ed);

    // Cleanup
    return () => {
      ed.dispose();
    };
  }, [initialCode, language]);

  const runCode = async () => {
    if (!editor) return;
    const code = editor.getValue();
    setOutput('Running...');

    try {
      const response = await fetch('http://localhost:8080/api/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ code })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setOutput(data.output || 'Code executed successfully!');
      } else {
        setOutput(`Error: ${data.error}`);
      }
    } catch (error) {
      setOutput(`Error: ${error.message}`);
    }
  };

  const resetCode = () => {
    if (editor) {
      editor.setValue(initialCode);
      setOutput('');
    }
  };

  const handleThemeChange = (theme: string) => {
    monaco.editor.setTheme(theme);
  };

  const handleFontSizeChange = (size: string) => {
    if (editor) {
      editor.updateOptions({ fontSize: parseInt(size) });
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex space-x-2">
          <button
            onClick={runCode}
            className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
          >
            Run ▶
          </button>
          <button
            onClick={resetCode}
            className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Reset
          </button>
        </div>
        <div className="flex items-center space-x-4">
          <select
            onChange={(e) => handleThemeChange(e.target.value)}
            className="px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
          >
            <option value="vs">Light</option>
            <option value="vs-dark">Dark</option>
          </select>
          <select
            onChange={(e) => handleFontSizeChange(e.target.value)}
            className="px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
          >
            <option value="12">12px</option>
            <option value="14" selected>14px</option>
            <option value="16">16px</option>
            <option value="18">18px</option>
          </select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-4" style={{ height }}>
        <div className="relative h-full min-h-[300px]">
          <div ref={editorRef} className="absolute inset-0"></div>
        </div>
        
        <div className="border-t lg:border-t-0 lg:border-l border-gray-200 dark:border-gray-700">
          <div className="p-4 h-full">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Output:</h3>
            <pre className="font-mono text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap h-[calc(100%-2rem)] overflow-auto">
              {output}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
