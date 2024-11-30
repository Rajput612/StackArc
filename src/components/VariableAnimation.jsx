import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const VariableAnimation = () => {
  const [variables, setVariables] = useState(new Map());
  const [values, setValues] = useState(new Map());

  useEffect(() => {
    const handleDebuggerUpdate = (event) => {
      console.log('Received debugger update:', event.detail); // Debug log
      const { variables: varUpdate, isStarting, isStopped } = event.detail;
      
      // Reset state on new debug session
      if (isStarting) {
        setVariables(new Map());
        setValues(new Map());
        return;
      }

      // Clear state when debugging stops
      if (isStopped) {
        setVariables(new Map());
        setValues(new Map());
        return;
      }

      if (!varUpdate) return;

      setVariables(prevVariables => {
        const newVariables = new Map(prevVariables);
        
        if (varUpdate.operation === 'assign') {
          try {
            // Handle variable assignment
            let value = varUpdate.value.trim();
            let type = 'unknown';
            
            // Determine type and clean value
            if ((value.startsWith('"') && value.endsWith('"')) || 
                (value.startsWith("'") && value.endsWith("'"))) {
              value = value.slice(1, -1);
              type = 'string';
            } else if (value === 'True' || value === 'False') {
              type = 'boolean';
            } else if (!isNaN(value)) {
              type = 'number';
              if (value.includes('.')) {
                value = parseFloat(value);
              } else {
                value = parseInt(value);
              }
            }
            
            const valueKey = `${value}_${type}`;
            newVariables.set(varUpdate.name, valueKey);
            
            // Update values map
            setValues(prevValues => {
              const newValues = new Map(prevValues);
              if (!newValues.has(valueKey)) {
                newValues.set(valueKey, {
                  value: value,
                  type: type,
                  refCount: 1
                });
              } else {
                const valueObj = newValues.get(valueKey);
                newValues.set(valueKey, {
                  ...valueObj,
                  refCount: valueObj.refCount + 1
                });
              }
              return newValues;
            });
          } catch (error) {
            console.error('Error processing variable:', error);
          }
        } else if (varUpdate.operation === 'delete') {
          // Handle variable deletion
          const valueKey = newVariables.get(varUpdate.name);
          if (valueKey) {
            setValues(prevValues => {
              const newValues = new Map(prevValues);
              const valueObj = newValues.get(valueKey);
              if (valueObj && valueObj.refCount > 1) {
                newValues.set(valueKey, {
                  ...valueObj,
                  refCount: valueObj.refCount - 1
                });
              } else {
                newValues.delete(valueKey);
              }
              return newValues;
            });
          }
          newVariables.delete(varUpdate.name);
        }
        
        return newVariables;
      });
    };

    window.addEventListener('debuggerUpdate', handleDebuggerUpdate);
    return () => window.removeEventListener('debuggerUpdate', handleDebuggerUpdate);
  }, []);

  const getTypeColor = (type) => {
    switch (type) {
      case 'string': return '#4CAF50';
      case 'number': return '#2196F3';
      case 'boolean': return '#FF9800';
      default: return '#9E9E9E';
    }
  };

  return (
    <div className="bg-gray-900 p-6 rounded-lg">
      <h2 className="text-xl text-white mb-4">Variables in Memory</h2>
      <div className="grid grid-cols-2 gap-8">
        <div>
          <h3 className="text-gray-400 mb-2">Variables</h3>
          <AnimatePresence>
            {Array.from(variables.entries()).map(([name, valueKey]) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-gray-800 p-3 rounded mb-2 flex items-center"
              >
                <span className="text-white font-mono">{name}</span>
                <motion.div
                  className="flex-1 mx-4"
                  style={{
                    height: '2px',
                    background: getTypeColor(values.get(valueKey)?.type)
                  }}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.2 }}
                />
              </motion.div>
            ))}
          </AnimatePresence>
          {variables.size === 0 && (
            <div className="text-gray-500 text-center">
              No variables defined yet
            </div>
          )}
        </div>
        
        <div>
          <h3 className="text-gray-400 mb-2">Values</h3>
          <AnimatePresence>
            {Array.from(values.entries()).map(([key, { value, type, refCount }]) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-gray-800 p-3 rounded mb-2"
                style={{ borderLeft: `4px solid ${getTypeColor(type)}` }}
              >
                <div className="flex justify-between items-center">
                  <span className="text-white font-mono">{value.toString()}</span>
                  {refCount > 1 && (
                    <span className="text-gray-400 text-sm">
                      {refCount} references
                    </span>
                  )}
                </div>
                <div className="text-gray-400 text-sm mt-1">
                  Type: {type}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {values.size === 0 && (
            <div className="text-gray-500 text-center">
              No values in memory
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VariableAnimation;
