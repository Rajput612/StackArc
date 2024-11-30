import React, { useState } from 'react';
import CodeBlock from './CodeBlock';

const ProblemSolution = ({ problem }) => {
  const [showSolution, setShowSolution] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-gray-800">{problem.title}</h3>
        <span className={`px-3 py-1 rounded-full text-sm ${
          problem.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
          problem.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          {problem.difficulty}
        </span>
      </div>

      <p className="text-gray-600 mb-4">{problem.description}</p>

      <div className="mb-4">
        <h4 className="font-semibold text-gray-700 mb-2">Examples:</h4>
        {problem.examples.map((example, idx) => (
          <div key={idx} className="bg-gray-50 p-3 rounded mb-2">
            <p className="font-mono text-sm">Input: {example.input}</p>
            <p className="font-mono text-sm">Output: {example.output}</p>
            {example.explanation && (
              <p className="text-gray-600 text-sm mt-1">Explanation: {example.explanation}</p>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={() => setShowSolution(!showSolution)}
        className="mb-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
      >
        {showSolution ? 'Hide Solution' : 'Show Solution'}
      </button>

      {showSolution && (
        <div className="mt-4">
          <h4 className="font-semibold text-gray-800 mb-3">Solution Approach</h4>
          <p className="text-gray-600 mb-4">{problem.approach}</p>

          <div className="mb-4">
            <h5 className="font-semibold text-gray-700 mb-2">Implementation</h5>
            <CodeBlock code={problem.solution} language="python" />
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h5 className="font-semibold text-gray-700 mb-2">Complexity Analysis</h5>
            <p className="text-gray-600">Time Complexity: {problem.timeComplexity}</p>
            <p className="text-gray-600">Space Complexity: {problem.spaceComplexity}</p>
            <p className="text-gray-600 mt-2">{problem.complexityExplanation}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProblemSolution;