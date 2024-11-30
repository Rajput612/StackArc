import React, { useEffect, useRef, useState } from 'react';
import { Editor } from '@monaco-editor/react';

const CodePlayground = ({ initialCode = '# Write your Python code here\n' }) => {
  const editorRef = useRef(null);
  const containerRef = useRef(null);
  const [code, setCode] = useState(initialCode);
  const [breakpoints, setBreakpoints] = useState(new Set());
  const [currentLine, setCurrentLine] = useState(null);
  const [isDebugging, setIsDebugging] = useState(false);
  const [executionQueue, setExecutionQueue] = useState([]);

  // Custom event emitter
  const emitEvent = (name, detail) => {
    if (!containerRef.current) return;
    const event = new CustomEvent(name, { detail, bubbles: true });
    containerRef.current.dispatchEvent(event);
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
    emitEvent('codeChange', value);
  }

  const executeCode = () => {
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
    setCurrentLine(executionLines[0]?.lineNumber);

    emitEvent('debuggerUpdate', {
      isStarting: true,
      currentLine: executionLines[0]?.lineNumber,
      code: executionLines[0]?.line
    });
  };

  const stepForward = () => {
    if (!isDebugging || executionQueue.length === 0) return;

    const currentIndex = executionQueue.findIndex(item => item.lineNumber === currentLine);
    const nextIndex = currentIndex + 1;

    if (nextIndex < executionQueue.length) {
      const nextLine = executionQueue[nextIndex];
      setCurrentLine(nextLine.lineNumber);
      
      emitEvent('debuggerUpdate', {
        currentLine: nextLine.lineNumber,
        code: nextLine.line,
        isBreakpoint: nextLine.isBreakpoint
      });
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
    emitEvent('debuggerUpdate', { isStopped: true });
  };

  return (
    <div ref={containerRef} data-component="code-playground" className="space-y-4">
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
          }}
        />
        {currentLine && (
          <div
            className="absolute left-0 right-0 bg-blue-500/20 pointer-events-none"
            style={{
              top: `${(currentLine - 1) * 19}px`,
              height: '19px'
            }}
          />
        )}
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
    </div>
  );
};

export default CodePlayground;
