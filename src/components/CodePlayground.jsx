import React, { useEffect, useRef, useState } from 'react';
import { Editor } from '@monaco-editor/react';

const CodePlayground = ({ initialCode = '# Write your Python code here\n' }) => {
  const editorRef = useRef(null);
  const containerRef = useRef(null);
  const decorationsRef = useRef([]);
  const [code, setCode] = useState(initialCode);
  const [breakpoints, setBreakpoints] = useState(new Set());
  const [currentLine, setCurrentLine] = useState(null);
  const [isDebugging, setIsDebugging] = useState(false);
  const [executionQueue, setExecutionQueue] = useState([]);
  const [output, setOutput] = useState([]);

  // Custom event emitter
  const emitEvent = (name, detail) => {
    console.log('Emitting event:', name, detail); // Debug log
    const event = new CustomEvent(name, { 
      detail,
      bubbles: true,
      composed: true 
    });
    window.dispatchEvent(event); // Use window instead of containerRef
  };

  // Process Python line
  const processLine = (line) => {
    const trimmedLine = line.trim();
    
    // Skip empty lines and comments
    if (!trimmedLine || trimmedLine.startsWith('#')) {
      return null;
    }

    // Handle variable assignment
    if (trimmedLine.includes('=')) {
      const parts = trimmedLine.split('=');
      const varName = parts[0].trim();
      const varValue = parts.slice(1).join('=').trim();
      return {
        type: 'assignment',
        name: varName,
        value: varValue
      };
    }

    // Handle del statement
    if (trimmedLine.startsWith('del ')) {
      return {
        type: 'deletion',
        name: trimmedLine.slice(4).trim()
      };
    }

    // Handle print statement
    if (trimmedLine.startsWith('print(')) {
      return {
        type: 'print',
        value: trimmedLine.slice(6, -1).trim()
      };
    }

    return null;
  };

  // Execute a single line of code
  const executeLine = (line, lineNumber) => {
    try {
      const processed = processLine(line);
      if (!processed) return;

      console.log('Executing line:', processed); // Debug log

      switch (processed.type) {
        case 'assignment':
          emitEvent('debuggerUpdate', {
            currentLine: lineNumber,
            code: line,
            variables: {
              name: processed.name,
              value: processed.value,
              operation: 'assign'
            }
          });
          break;

        case 'deletion':
          emitEvent('debuggerUpdate', {
            currentLine: lineNumber,
            code: line,
            variables: {
              name: processed.name,
              operation: 'delete'
            }
          });
          break;

        case 'print':
          setOutput(prev => [...prev, processed.value]);
          emitEvent('debuggerUpdate', {
            currentLine: lineNumber,
            code: line
          });
          break;
      }
    } catch (error) {
      console.error('Error executing line:', error); // Debug log
      setOutput(prev => [...prev, `Error: ${error.message}`]);
    }
  };

  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;

    // Add click handler for breakpoints
    editor.onMouseDown((e) => {
      if (e.target.type === monaco.editor.MouseTargetType.GUTTER_GLYPH_MARGIN) {
        const lineNumber = e.target.position.lineNumber;
        const newBreakpoints = new Set(breakpoints);
        
        if (newBreakpoints.has(lineNumber)) {
          newBreakpoints.delete(lineNumber);
        } else {
          newBreakpoints.add(lineNumber);
        }
        
        setBreakpoints(newBreakpoints);
      }
    });
  }

  function handleEditorChange(value) {
    setCode(value);
  }

  // Update editor decorations when currentLine changes
  useEffect(() => {
    if (!editorRef.current || currentLine === null) {
      if (decorationsRef.current.length > 0) {
        editorRef.current?.deltaDecorations(decorationsRef.current, []);
        decorationsRef.current = [];
      }
      return;
    }

    const editor = editorRef.current;
    const model = editor.getModel();
    
    if (!model) return;

    // Create decoration for the current line
    const newDecorations = [{
      range: {
        startLineNumber: currentLine,
        startColumn: 1,
        endLineNumber: currentLine,
        endColumn: model.getLineMaxColumn(currentLine)
      },
      options: {
        inlineClassName: 'currentLineText',
        className: 'currentLine'
      }
    }];

    // Update decorations
    decorationsRef.current = editor.deltaDecorations(
      decorationsRef.current,
      newDecorations
    );
  }, [currentLine]);

  const executeCode = () => {
    setOutput([]);
    const lines = code.split('\n');
    const executionLines = lines
      .map((line, index) => ({
        line: line.trim(),
        lineNumber: index + 1,
        isBreakpoint: breakpoints.has(index + 1)
      }))
      .filter(item => item.line && !item.line.startsWith('#'));

    setExecutionQueue(executionLines);
    setIsDebugging(true);
    
    console.log('Starting debug session'); // Debug log
    emitEvent('debuggerUpdate', { isStarting: true });

    // Execute first line
    if (executionLines[0]) {
      setCurrentLine(executionLines[0].lineNumber);
      executeLine(executionLines[0].line, executionLines[0].lineNumber);
    }
  };

  const stepForward = () => {
    if (!isDebugging || executionQueue.length === 0) return;

    const currentIndex = executionQueue.findIndex(item => item.lineNumber === currentLine);
    const nextIndex = currentIndex + 1;

    if (nextIndex < executionQueue.length) {
      const nextLine = executionQueue[nextIndex];
      setCurrentLine(nextLine.lineNumber);
      executeLine(nextLine.line, nextLine.lineNumber);
    } else {
      // Execution finished
      setIsDebugging(false);
      setCurrentLine(null);
      emitEvent('debuggerUpdate', { isFinished: true });
    }
  };

  const stopDebugging = () => {
    setIsDebugging(false);
    setCurrentLine(null);
    setExecutionQueue([]);
    setOutput([]);
    emitEvent('debuggerUpdate', { isStopped: true });
  };

  return (
    <div ref={containerRef} data-component="code-playground" className="space-y-4">
      <style>{`
        .currentLine {
          background-color: rgba(239, 68, 68, 0.1);
        }
        .currentLineText {
          color: rgb(239, 68, 68) !important;
        }
      `}</style>
      <div className="relative">
        <Editor
          height="300px"
          defaultLanguage="python"
          theme="vs-dark"
          value={code}
          onChange={handleEditorChange}
          onMount={handleEditorDidMount}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            glyphMargin: true,
            folding: false,
            lineDecorationsWidth: 0,
            lineNumbersMinChars: 3,
            renderLineHighlight: 'none'
          }}
        />
      </div>
      <div className="flex space-x-4">
        {!isDebugging ? (
          <button
            onClick={executeCode}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
          >
            Debug
          </button>
        ) : (
          <>
            <button
              onClick={stepForward}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Step Forward
            </button>
            <button
              onClick={stopDebugging}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Stop
            </button>
          </>
        )}
      </div>
      {output.length > 0 && (
        <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm">
          <h3 className="text-white font-semibold mb-2">Output:</h3>
          <div className="text-gray-300">
            {output.map((line, i) => (
              <div key={i} className="text-white">
                {line}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CodePlayground;
