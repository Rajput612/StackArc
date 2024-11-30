import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const VariableAnimation = ({ code = '', debuggerState = null }) => {
  const [variables, setVariables] = useState([]);

  useEffect(() => {
    if (!debuggerState || !debuggerState.code) return;

    // Parse variables from the current line
    const line = debuggerState.code.trim();
    
    if (line.includes('=')) {
      const [left, right] = line.split('=').map(s => s.trim());
      const varName = left.split(' ')[0];  // Handle 'name = "value"'
      
      // Handle deletion
      if (line.startsWith('del ')) {
        setVariables(prev => prev.filter(v => v.name !== line.split(' ')[1]));
        return;
      }

      // Parse value and determine type
      let value = right;
      let type = 'Unknown';
      let color = '#a855f7';  // Default purple
      
      if (value.startsWith('"') || value.startsWith("'")) {
        type = 'String';
        color = '#ef4444';  // Red
        value = value.slice(1, -1);
      } else if (value === 'True' || value === 'False') {
        type = 'Boolean';
        color = '#22c55e';  // Green
      } else if (value.includes('.')) {
        type = 'Float';
        color = '#3b82f6';  // Blue
        value = parseFloat(value);
      } else if (!isNaN(value)) {
        type = 'Integer';
        color = '#14b8a6';  // Teal
        value = parseInt(value);
      }

      setVariables(prev => {
        const newVars = prev.filter(v => v.name !== varName);
        return [...newVars, { name: varName, value, type, color }];
      });
    }
  }, [debuggerState]);

  // Reset variables when debugging stops
  useEffect(() => {
    if (debuggerState?.isStopped || debuggerState?.isFinished) {
      setVariables([]);
    }
  }, [debuggerState?.isStopped, debuggerState?.isFinished]);

  return (
    <div data-component="variable-animation" className="p-4 bg-gray-900 rounded-lg">
      <h3 className="text-lg font-semibold text-white mb-4">Variables in Memory</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence>
          {variables.map((variable) => (
            <motion.div
              key={`${variable.name}-${variable.value}`}
              initial={{ scale: 0, opacity: 0, rotate: -180 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              exit={{ scale: 0, opacity: 0, rotate: 180 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 20
              }}
              className="relative p-4 bg-gray-800 rounded-lg border-2"
              style={{ borderColor: variable.color }}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-white font-mono">{variable.name}</h4>
                  <p className="text-gray-400 text-sm">Type: {variable.type}</p>
                </div>
                <motion.div
                  className="text-white font-mono bg-gray-700 px-2 py-1 rounded"
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {variable.value.toString()}
                </motion.div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      {variables.length === 0 && (
        <p className="text-gray-500 text-center">No variables defined yet</p>
      )}
    </div>
  );
};

export default VariableAnimation;
