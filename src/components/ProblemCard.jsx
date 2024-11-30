import React from 'react';

const ProblemCard = ({ title, difficulty, description, constraints, examples }) => {
  return (
    <div className="border border-gray-200 rounded-lg p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-xl font-semibold text-gray-800">{title}</h4>
        <span className={`px-3 py-1 rounded-full text-sm ${
          difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
          difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          {difficulty}
        </span>
      </div>
      <p className="text-gray-600 mb-4">{description}</p>
      <div className="mb-4">
        <h5 className="font-semibold text-gray-700 mb-2">Constraints:</h5>
        <ul className="list-disc list-inside text-gray-600">
          {constraints.map((constraint, idx) => (
            <li key={idx}>{constraint}</li>
          ))}
        </ul>
      </div>
      <div>
        <h5 className="font-semibold text-gray-700 mb-2">Examples:</h5>
        {examples.map((example, idx) => (
          <div key={idx} className="mb-2">
            <p className="text-gray-600">
              <span className="font-medium">Input:</span> {example.input}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Output:</span> {example.output}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProblemCard;