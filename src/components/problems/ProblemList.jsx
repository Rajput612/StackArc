import React from 'react';
import DifficultyBadge from '../common/DifficultyBadge';
import CodeBlock from '../CodeBlock';

const ProblemList = ({ problems }) => {
  return (
    <div className="space-y-8">
      {problems.map((problem) => (
        <div key={problem.id} className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-800">{problem.title}</h3>
            <DifficultyBadge difficulty={problem.difficulty} />
          </div>
          
          <p className="text-gray-600 mb-4">{problem.description}</p>
          
          <div className="mb-4">
            <h4 className="font-semibold text-gray-700 mb-2">Solution:</h4>
            <CodeBlock code={problem.solution} />
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-700 mb-2">Explanation:</h4>
            <p className="text-gray-600">{problem.explanation}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProblemList;