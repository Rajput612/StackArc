import React from 'react';
import CodeBlock from './CodeBlock';

const TechniqueExplanation = ({ technique }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
      <h3 className="text-2xl font-semibold text-gray-800 mb-4">{technique.name}</h3>
      <div className="prose max-w-none">
        <p className="text-gray-600 mb-4">{technique.description}</p>
        
        <div className="mb-6">
          <h4 className="text-xl font-semibold text-gray-800 mb-3">How it Works</h4>
          <p className="text-gray-600">{technique.explanation}</p>
        </div>

        <div className="mb-6">
          <h4 className="text-xl font-semibold text-gray-800 mb-3">Implementation</h4>
          <CodeBlock code={technique.implementation} language="python" />
          <div className="mt-4 space-y-2">
            {technique.steps.map((step, idx) => (
              <div key={idx} className="flex items-start space-x-2">
                <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">{idx + 1}</span>
                <p className="text-gray-600">{step}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h4 className="text-xl font-semibold text-gray-800 mb-3">Time & Space Complexity</h4>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-600">Time: {technique.timeComplexity}</p>
            <p className="text-gray-600">Space: {technique.spaceComplexity}</p>
            <p className="text-gray-600 mt-2">{technique.complexityExplanation}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechniqueExplanation;