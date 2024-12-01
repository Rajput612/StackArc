import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const VariableAnimation = () => {
  const containerRef = useRef(null);
  const [variables, setVariables] = useState(new Map());
  const [operationsLog, setOperationsLog] = useState([]);
  const MAX_LOG_SIZE = 5;

  // Handle debugger events
  useEffect(() => {
    const handleDebuggerEvent = (event) => {
      const { detail } = event;
      if (!detail) return;

      if (detail.isStarting) {
        setVariables(new Map());
        setOperationsLog([]);
        return;
      }

      if (!detail.variables) return;

      const { operation, name, value, state } = detail.variables;
      const isUndo = detail.isUndo;

      if (isUndo && operation === 'restore') {
        setVariables(new Map(state));
        return;
      }

      if (operation === 'delete') {
        setVariables(prev => {
          const newVars = new Map(prev);
          newVars.delete(name);
          return newVars;
        });
        setOperationsLog(prev => [...prev.slice(-MAX_LOG_SIZE), {
          operation: 'delete',
          name,
          timestamp: Date.now()
        }]);
      }

      if (operation === 'assign') {
        setVariables(prev => {
          const newVars = new Map(prev);
          newVars.set(name, value);
          return newVars;
        });
        setOperationsLog(prev => [...prev.slice(-MAX_LOG_SIZE), {
          operation: 'assign',
          name,
          value,
          timestamp: Date.now()
        }]);
      }
    };

    window.addEventListener('debuggerUpdate', handleDebuggerEvent);
    return () => window.removeEventListener('debuggerUpdate', handleDebuggerEvent);
  }, []);

  const typeColors = {
    string: 'bg-blue-500',
    number: 'bg-green-500',
    boolean: 'bg-purple-500',
    unknown: 'bg-gray-500'
  };

  const getType = (value) => {
    if (typeof value === 'string' && !['True', 'False'].includes(value)) return 'string';
    if (typeof value === 'number' || !isNaN(value)) return 'number';
    if (typeof value === 'boolean' || ['True', 'False'].includes(value)) return 'boolean';
    return 'unknown';
  };

  return (
    <div ref={containerRef} className="relative w-full h-full bg-gray-900 p-4">
      <div className="grid grid-cols-3 gap-4 mb-16">
        <AnimatePresence>
          {[...variables.entries()].map(([name, value]) => (
            <motion.div
              key={name}
              layout
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col items-center"
            >
              <div className={`w-24 h-24 ${typeColors[getType(value)]} rounded-xl shadow-lg 
                             flex items-center justify-center p-2 text-white`}>
                <div className="text-center">
                  <div className="font-mono font-bold">{name}</div>
                  <div className="text-sm mt-1 opacity-90">{String(value)}</div>
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-400 uppercase">
                {getType(value)}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="absolute bottom-0 left-0 right-0 bg-gray-800 p-3 max-h-[100px] overflow-y-auto">
        {operationsLog.map((op, i) => (
          <div key={i} className="text-sm font-mono mb-1">
            {op.operation === 'assign' && (
              <span className="text-green-400">
                {op.name} = <span className="text-blue-300">{op.value}</span>
              </span>
            )}
            {op.operation === 'delete' && (
              <span className="text-red-400">del {op.name}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default React.memo(VariableAnimation);
