'use client';
import { useState } from 'react';
import { useUser } from '../contexts/UserContext';
import { userThemes } from '../config/themes';
import { arrayContent } from '../config/content';

const CodePlayground = ({ 
  topic = 'prefix_sum',
  height = "h-96", 
  showExamples = true
}) => {
  const { userType, theme } = useUser();
  const content = arrayContent[userType][topic];

  const [code, setCode] = useState(content.code);
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const runCode = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8080/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });

      const result = await response.json();
      
      if (result.success) {
        setOutput(result.output || 'No output');
      } else {
        setOutput(`Error: ${result.error}`);
      }
    } catch (error) {
      setOutput(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const containerClasses = isFullscreen 
    ? "fixed inset-0 z-50 bg-gray-900 overflow-auto" 
    : "w-full mx-auto";

  return (
    <div className={containerClasses}>
      <div className={`${theme.colors.card} ${theme.playground.borderRadius} shadow-2xl overflow-hidden border ${theme.colors.border}`}>
        {/* Header */}
        <div className={`bg-gradient-to-r ${theme.colors.primary} px-4 py-3 flex items-center justify-between border-b ${theme.colors.border}`}>
          <div className="flex items-center space-x-3">
            <div className="flex space-x-2">
              {userType === 'children' && (
                <>
                  <div className="w-4 h-4 rounded-full bg-yellow-400 animate-bounce"></div>
                  <div className="w-4 h-4 rounded-full bg-pink-400 animate-bounce delay-100"></div>
                  <div className="w-4 h-4 rounded-full bg-purple-400 animate-bounce delay-200"></div>
                </>
              )}
              {userType === 'intermediate' && (
                <>
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </>
              )}
              {userType === 'professional' && (
                <>
                  <div className="w-2.5 h-2.5 rounded-sm bg-gray-500"></div>
                  <div className="w-2.5 h-2.5 rounded-sm bg-gray-500"></div>
                  <div className="w-2.5 h-2.5 rounded-sm bg-gray-500"></div>
                </>
              )}
            </div>
            <span className={`${theme.colors.text} font-medium ${theme.playground.fontSize}`}>
              {content.title}
            </span>
          </div>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="text-white hover:text-gray-200 focus:outline-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-${theme.icons.size} w-${theme.icons.size}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isFullscreen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v4m16-4v4M4 20v-4m16 4v-4" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 16v-4m16-4v4M4 8h16" />
              )}
            </svg>
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Description */}
          <div className={`${theme.colors.text} ${theme.playground.fontSize}`}>
            {content.description}
          </div>

          {/* Code Editor */}
          <div className="relative">
            <div className="absolute top-0 right-0 p-2 flex space-x-2">
              <button
                onClick={runCode}
                disabled={isLoading}
                className={`px-4 py-2 bg-gradient-to-r ${theme.colors.primary} text-white ${theme.playground.fontSize} ${theme.playground.controls} hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 transition-colors duration-200 flex items-center space-x-2`}
              >
                {isLoading ? (
                  <>
                    <svg className={`animate-spin h-${theme.icons.size} w-${theme.icons.size} text-white`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>{userType === 'children' ? 'Running your code! ' : 'Running...'}</span>
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-${theme.icons.size} w-${theme.icons.size}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{userType === 'children' ? 'Try it out! ' : 'Run Code'}</span>
                  </>
                )}
              </button>
            </div>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className={`w-full ${height} p-4 font-mono ${theme.colors.text} bg-gray-800 ${theme.playground.borderRadius} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 resize-none leading-relaxed ${theme.playground.fontSize}`}
              style={{ 
                tabSize: 4,
                caretColor: '#818cf8',
                lineHeight: '1.6'
              }}
              spellCheck="false"
            />
          </div>

          {/* Output Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className={`${theme.playground.fontSize} font-medium ${theme.colors.text}`}>
                {userType === 'children' ? ' Your Output ' : 'Output'}
              </h3>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 ${theme.playground.controls} ${isLoading ? 'bg-yellow-500' : output ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                <span className={`text-xs ${theme.colors.text}`}>
                  {isLoading 
                    ? (userType === 'children' ? ' Running your code...' : 'Running') 
                    : output 
                      ? (userType === 'children' ? ' All done!' : 'Completed') 
                      : (userType === 'children' ? ' Ready to start!' : 'Ready')}
                </span>
              </div>
            </div>
            <div className={`bg-gray-800 ${theme.playground.borderRadius} p-4 min-h-[100px] max-h-[300px] overflow-auto`}>
              <pre className={`${theme.playground.fontSize} text-gray-300 font-mono whitespace-pre-wrap`}>
                {output || (userType === 'children' 
                  ? ' Your code output will appear here! Ready to learn? ' 
                  : 'Code output will appear here...')}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodePlayground;
