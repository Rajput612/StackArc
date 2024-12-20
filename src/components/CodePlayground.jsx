import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Editor } from '@monaco-editor/react';

// Utility function to safely execute Python code
const executePythonCode = async (code) => {
  try {
    // Wait for Pyodide to be ready
    const pyodide = await window.pyodideReadyPromise;
    
    // Redirect Python print to our console
    pyodide.runPython(`
import sys
import io

class CaptureOutput:
    def __init__(self):
        self.output = []
    def write(self, text):
        self.output.append(text.strip())
    def flush(self):
        pass

capture = CaptureOutput()
sys.stdout = capture
sys.stderr = capture
`);

    // Execute the code
    pyodide.runPython(code);
    
    // Get captured output
    const capturedOutput = pyodide.runPython('capture.output');
    return capturedOutput.toJs();
  } catch (error) {
    return [`Error: ${error.message}`];
  }
};

const CodePlayground = ({ 
  id,
  initialCode = '# Write your Python code here\n', 
  solution = null 
}) => {
  const editorRef = useRef(null);
  const [code, setCode] = useState(initialCode);
  const [currentLine, setCurrentLine] = useState(null);
  const [isDebugging, setIsDebugging] = useState(false);
  const [executionHistory, setExecutionHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [output, setOutput] = useState([]);
  const [variables, setVariables] = useState(new Map());
  const [showSolution, setShowSolution] = useState(false);
  const [originalCode, setOriginalCode] = useState(initialCode);
  const [theme, setTheme] = useState('vs-light');
  const [isPyodideReady, setIsPyodideReady] = useState(false);

  useEffect(() => {
    const loadPyodide = async () => {
      if (!window.pyodideReadyPromise) {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/pyodide/v0.22.1/full/pyodide.js';
        script.async = true;
        
        script.onload = async () => {
          try {
            window.pyodideReadyPromise = loadPyodide({
              indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.22.1/full/',
              stdout: (text) => console.log(text),
              stderr: (text) => console.error(text)
            });
            await window.pyodideReadyPromise;
            setIsPyodideReady(true);
          } catch (error) {
            console.error('Error loading Pyodide:', error);
          }
        };
        
        document.body.appendChild(script);
      } else {
        setIsPyodideReady(true);
      }
    };
    
    loadPyodide();
  }, []);

  // Toggle solution visibility
  const toggleSolution = () => {
    if (solution) {
      if (showSolution) {
        setCode(originalCode);
        setShowSolution(false);
      } else {
        setOriginalCode(code);
        setCode(solution);
        setShowSolution(true);
      }
    }
  };

  // Execute code 
  const executeCode = async () => {
    if (!isPyodideReady) {
      setOutput(['Loading Python environment...']);
      return;
    }
    try {
      setOutput([]);
      const executionOutput = await executePythonCode(code);
      setOutput(executionOutput || ['No output']);
    } catch (error) {
      setOutput([`Error: ${error.message}`]);
    }
  };

  // Memoized event emitter
  const emitDebuggerEvent = useCallback((detail) => {
    window.dispatchEvent(new CustomEvent('debuggerUpdate', { 
      detail,
      bubbles: true,
      composed: true 
    }));
  }, []);

  // Process Python line - memoized for performance
  const processLine = useCallback((line) => {
    const trimmedLine = line.trim();
    if (!trimmedLine || trimmedLine.startsWith('#')) return null;

    if (trimmedLine.includes('=')) {
      const [varName, ...valueParts] = trimmedLine.split('=');
      return {
        type: 'assignment',
        name: varName.trim(),
        value: valueParts.join('=').trim()
      };
    }

    if (trimmedLine.startsWith('del ')) {
      return {
        type: 'deletion',
        names: trimmedLine.slice(4).split(',').map(name => name.trim())
      };
    }

    if (trimmedLine.startsWith('print(')) {
      return {
        type: 'print',
        value: trimmedLine.slice(6, -1).trim()
      };
    }

    return null;
  }, []);

  // Execute a single line of code - memoized for performance
  const executeLine = useCallback((line, lineNumber) => {
    try {
      const processed = processLine(line);
      if (!processed) return null;

      const result = {
        line: lineNumber,
        code: line,
        type: processed.type,
        output: null,
        variables: new Map(variables),
        event: null,
        undoEvent: null,
        lineState: new Map(variables)
      };

      switch (processed.type) {
        case 'assignment': {
          const oldValue = result.variables.get(processed.name);
          result.variables.set(processed.name, processed.value);
          result.event = {
            name: processed.name,
            value: processed.value,
            operation: 'assign'
          };
          break;
        }
        case 'deletion': {
          processed.names.forEach(name => {
            if (result.variables.has(name)) {
              result.variables.delete(name);
              result.event = {
                name,
                operation: 'delete',
                executeImmediately: true
              };
            }
          });
          break;
        }
        case 'print': {
          let value = processed.value;
          result.variables.forEach((val, name) => {
            value = value.replace(new RegExp(name, 'g'), val);
          });
          try {
            value = Function('"use strict";return (' + value + ')')();
          } catch (e) {
            // If evaluation fails, use raw value
          }
          result.output = value;
          break;
        }
      }

      return result;
    } catch (error) {
      console.error('Error executing line:', error);
      return null;
    }
  }, [processLine, variables]);

  // Start debugging - memoized
  const startDebugging = useCallback(() => {
    if (!isPyodideReady) {
      setOutput(['Pyodide not loaded']);
      return;
    }
    setIsDebugging(true);
    setCurrentLine(null);
    setOutput([]);
    setVariables(new Map());
    setHistoryIndex(-1);
    setExecutionHistory([]);
    emitDebuggerEvent({ isStarting: true });
  }, [emitDebuggerEvent]);

  // Step forward - memoized
  const stepForward = useCallback(() => {
    if (!isDebugging) return;

    const lines = code.split('\n');
    const nextLine = historyIndex + 1;
    
    if (nextLine >= lines.length) {
      stopDebugging();
      return;
    }

    // First highlight the next line
    setCurrentLine(nextLine);
    setHistoryIndex(nextLine);

    // Execute the previous line's result if it exists
    if (nextLine > 0) {
      const prevResult = executeLine(lines[nextLine - 1], nextLine - 1);
      if (prevResult) {
        setExecutionHistory(prev => {
          const newHistory = [...prev, prevResult].slice(-50);
          return newHistory;
        });
        setVariables(prevResult.variables);
        
        if (prevResult.output !== null) {
          setOutput(prev => [...prev.slice(-100), prevResult.output]);
        }

        if (prevResult.event) {
          emitDebuggerEvent({
            currentLine: nextLine - 1,
            code: prevResult.code,
            variables: prevResult.event,
            executeImmediately: prevResult.event.executeImmediately
          });
        }
      }
    }
  }, [isDebugging, code, historyIndex, executeLine, emitDebuggerEvent]);

  // Step backward - memoized
  const stepBackward = useCallback(() => {
    if (!isDebugging || historyIndex <= 0) return;

    const prevIndex = historyIndex - 1;
    setHistoryIndex(prevIndex);
    setCurrentLine(prevIndex);

    // Get the state at the previous line
    const prevState = executionHistory[prevIndex];
    if (prevState) {
      // Restore the exact state from that line
      setVariables(new Map(prevState.lineState));

      // Emit event for visualization
      emitDebuggerEvent({
        currentLine: prevIndex,
        code: prevState.code,
        variables: {
          operation: 'restore',
          state: prevState.lineState
        },
        isUndo: true
      });
    }
  }, [isDebugging, historyIndex, executionHistory, emitDebuggerEvent]);

  // Stop debugging - memoized
  const stopDebugging = useCallback(() => {
    setIsDebugging(false);
    setCurrentLine(null);
    setHistoryIndex(-1);
    setExecutionHistory([]);
    emitDebuggerEvent({ isStopped: true });
  }, [emitDebuggerEvent]);

  // Effect to update theme based on user preference
  useEffect(() => {
    const updateTheme = () => {
      const currentTheme = document.body.classList.contains('dark') ? 'vs-dark' : 'vs-light';
      setTheme(currentTheme);
    };

    // Initial theme setting
    updateTheme();

    // Listen for changes to the theme
    document.body.addEventListener('classChange', updateTheme);

    // Cleanup listener on unmount
    return () => {
      document.body.removeEventListener('classChange', updateTheme);
    };
  }, []);

  // Monaco Editor options with dynamic theme support
  const editorOptions = {
    theme: theme,
    minimap: { enabled: false },
    fontSize: 14,
    lineHeight: 24,
    padding: { top: 15, bottom: 15 },
    automaticLayout: true,
    scrollbar: {
      vertical: 'auto',
      horizontal: 'auto',
      verticalScrollbarSize: 10,
      horizontalScrollbarSize: 10,
    },
    // Light theme specific styling
    colorDecorators: true,
    renderLineHighlight: 'all',
    renderWhitespace: 'all',
    renderControlCharacters: true,
    guides: {
      indentation: true,
      highlightActiveIndentation: true,
    },
    // Accessibility and readability
    accessibilitySupport: 'on',
    ariaLabel: 'Python Code Editor',
    smoothScrolling: true,
  };

  // Handle editor mount
  const handleEditorMount = (editor, monaco) => {
    editorRef.current = editor;

    // Detect system theme and adjust accordingly
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    editor.updateOptions({
      theme: prefersDarkScheme.matches ? 'vs-dark' : 'vs-light'
    });

    // Listen for theme changes
    prefersDarkScheme.addEventListener('change', (e) => {
      editor.updateOptions({
        theme: e.matches ? 'vs-dark' : 'vs-light'
      });
    });
  };

  // Highlight current line - using RAF for performance
  useEffect(() => {
    if (!editorRef.current) return;

    let decorations = [];
    const updateDecorations = () => {
      decorations = editorRef.current.deltaDecorations(decorations, 
        currentLine !== null ? [{
          range: {
            startLineNumber: currentLine + 1,
            startColumn: 1,
            endLineNumber: currentLine + 1,
            endColumn: 1
          },
          options: {
            isWholeLine: true,
            className: 'current-line-highlight'
          }
        }] : []
      );
    };

    requestAnimationFrame(updateDecorations);

    return () => {
      if (editorRef.current && decorations.length) {
        editorRef.current.deltaDecorations(decorations, []);
      }
    };
  }, [currentLine]);

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-md">
      <div className="w-full h-[400px] border-b border-gray-200 dark:border-gray-700">
        <Editor
          height="100%"
          defaultLanguage="python"
          value={code}
          onChange={(value) => setCode(value || '')}
          options={editorOptions}
          onMount={handleEditorMount}
          className="rounded-t-lg"
        />
      </div>
      {output.length > 0 && (
        <div className="p-4 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-mono text-sm">
          <strong>Output:</strong>
          {output.map((line, index) => (
            <div key={index} className="py-1">{line}</div>
          ))}
        </div>
      )}
      <div className="flex justify-between p-3 bg-gray-100 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
        <div className="flex space-x-3">
          <button 
            onClick={executeCode} 
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            disabled={!isPyodideReady}
          >
            {isPyodideReady ? 'Run' : 'Loading...'}
          </button>
          {solution && (
            <button 
              onClick={toggleSolution} 
              className={`px-4 py-2 ${showSolution ? 'bg-red-600' : 'bg-green-600'} text-white rounded-lg hover:${showSolution ? 'bg-red-700' : 'bg-green-700'} transition-colors`}
            >
              {showSolution ? 'Hide Solution' : 'Show Solution'}
            </button>
          )}
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={startDebugging} 
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            disabled={!isPyodideReady}
          >
            Debug
          </button>
          <button 
            onClick={stepBackward} 
            disabled={!isDebugging || historyIndex <= 0}
            className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors disabled:opacity-50"
          >
            ← Back
          </button>
          <button 
            onClick={stepForward} 
            disabled={!isDebugging}
            className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors disabled:opacity-50"
          >
            Next →
          </button>
          <button 
            onClick={stopDebugging} 
            disabled={!isDebugging}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            Stop
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(CodePlayground);
