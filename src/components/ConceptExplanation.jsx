import React from 'react';
import CodeBlock from './CodeBlock';

const ConceptExplanation = ({ concept }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">{concept.title}</h2>
        <div className="prose max-w-none">
          <p className="text-gray-600">{concept.description}</p>
          
          {concept.keyPoints && (
            <div className="mt-4">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Key Points</h3>
              <ul className="list-disc list-inside space-y-2">
                {concept.keyPoints.map((point, idx) => (
                  <li key={idx} className="text-gray-600">{point}</li>
                ))}
              </ul>
            </div>
          )}
          
          {concept.example && (
            <div className="mt-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Example</h3>
              <CodeBlock code={concept.example} language="python" />
              <p className="mt-2 text-gray-600">{concept.exampleExplanation}</p>
            </div>
          )}
          
          {concept.commonMistakes && (
            <div className="mt-6 bg-red-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-red-800 mb-2">Common Mistakes</h3>
              <ul className="list-disc list-inside space-y-2">
                {concept.commonMistakes.map((mistake, idx) => (
                  <li key={idx} className="text-gray-700">{mistake}</li>
                ))}
              </ul>
            </div>
          )}
          
          {concept.tips && (
            <div className="mt-6 bg-green-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-green-800 mb-2">Pro Tips</h3>
              <ul className="list-disc list-inside space-y-2">
                {concept.tips.map((tip, idx) => (
                  <li key={idx} className="text-gray-700">{tip}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConceptExplanation;