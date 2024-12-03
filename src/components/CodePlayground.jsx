import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Editor } from '@monaco-editor/react';

const MAX_HISTORY_SIZE = 50; // Limit history size
const MAX_OUTPUT_SIZE = 100; // Limit output size

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
          const newHistory = [...prev, prevResult].slice(-MAX_HISTORY_SIZE);
          return newHistory;
        });
        setVariables(prevResult.variables);
        
        if (prevResult.output !== null) {
          setOutput(prev => [...prev.slice(-MAX_OUTPUT_SIZE), prevResult.output]);
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

  // Toggle solution
  const toggleSolution = () => {
    if (!solution) return;

    if (!showSolution) {
      // Store current code before replacing
      localStorage.setItem(`${id}-original-code`, code);
      setCode(solution);
      setShowSolution(true);
    } else {
      // Restore original code
      const originalCode = localStorage.getItem(`${id}-original-code`) || initialCode;
      setCode(originalCode);
      setShowSolution(false);
    }
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
    <div className="bg-gray-900 rounded-lg overflow-hidden">
      <style>{`
        .current-line-highlight {
          background-color: rgba(66, 153, 225, 0.1);
          border-left: 2px solid #4299e1;
        }
      `}</style>

      <div className="border-b border-gray-800 p-4">
        <div className="flex justify-between items-center">
          <div className="flex space-x-2">
            <button
              onClick={startDebugging}
              disabled={isDebugging}
              className={`px-3 py-1 rounded ${
                isDebugging
                  ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              Debug
            </button>
            <button
              onClick={stepBackward}
              disabled={!isDebugging || historyIndex <= 0}
              className={`px-3 py-1 rounded ${
                !isDebugging || historyIndex <= 0
                  ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              Previous
            </button>
            <button
              onClick={stepForward}
              disabled={!isDebugging}
              className={`px-3 py-1 rounded ${
                !isDebugging
                  ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              Next
            </button>
            <button
              onClick={stopDebugging}
              disabled={!isDebugging}
              className={`px-3 py-1 rounded ${
                !isDebugging
                  ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  : 'bg-red-600 text-white hover:bg-red-700'
              }`}
            >
              Stop
            </button>
          </div>
          <div className="ml-auto">
            <button
              onClick={toggleSolution}
              disabled={!solution}
              className={`px-3 py-1 rounded ${
                !solution
                  ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  : showSolution
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              {showSolution ? 'Hide Solution' : 'Show Solution'}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 p-4">
        <div className="h-[400px]">
          <Editor
            height="100%"
            defaultLanguage="python"
            theme="vs-dark"
            value={code}
            onChange={setCode}
            onMount={(editor) => { editorRef.current = editor; }}
            options={{
              minimap: { enabled: false },
              lineNumbers: 'on',
              roundedSelection: false,
              scrollBeyondLastLine: false,
              readOnly: isDebugging,
              glyphMargin: true,
              lineDecorationsWidth: 5,
              renderWhitespace: 'none',
              wordWrap: 'on'
            }}
          />
        </div>

        <div className="bg-gray-800 p-4 rounded h-[400px] overflow-auto">
          <h3 className="text-white mb-4">Output</h3>
          <div className="font-mono text-sm">
            {output.map((line, index) => (
              <div key={index} className="text-gray-300">
                {line}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(CodePlayground);
