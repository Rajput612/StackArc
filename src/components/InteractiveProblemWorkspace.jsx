import React, { useState } from 'react';
import CodeBlock from './CodeBlock';

const InteractiveProblemWorkspace = ({ problem, testCases }) => {
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [activeTest, setActiveTest] = useState(0);

  const runCode = () => {
    try {
      // In a real implementation, this would be handled by a secure backend
      // For demo purposes, we'll just show the concept
      const result = `Test Case ${activeTest + 1}: ${testCases[activeTest].expected}`;
      setOutput(result);
    } catch (error) {
      setOutput(`Error: ${error.message}`);
    }
  };

  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">Problem</h3>
          <div className="bg-gray-50 p-4 rounded mb-4">
            <p className="text-gray-700">{problem.description}</p>
          </div>
          <div className="mb-4">
            <h4 className="font-medium mb-2">Test Cases</h4>
            <div className="space-y-2">
              {testCases.map((test, idx) => (
                <div
                  key={idx}
                  className={`p-2 rounded cursor-pointer ${
                    activeTest === idx ? 'bg-indigo-100' : 'bg-gray-50'
                  }`}
                  onClick={() => setActiveTest(idx)}
                >
                  <div>Input: {test.input}</div>
                  <div>Expected: {test.expected}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Your Solution</h3>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full h-48 p-2 border rounded font-mono text-sm"
            placeholder="Write your solution here..."
          />
          <button
            onClick={runCode}
            className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Run Code
          </button>
          {output && (
            <div className="mt-4">
              <h4 className="font-medium mb-2">Output</h4>
              <pre className="bg-gray-50 p-2 rounded">{output}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InteractiveProblemWorkspace;