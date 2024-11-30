import React, { useState, useEffect } from 'react';

const ProgressTracker = ({ topic, subtopics }) => {
  const [progress, setProgress] = useState(() => {
    const saved = localStorage.getItem(`progress_${topic}`);
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem(`progress_${topic}`, JSON.stringify(progress));
  }, [progress, topic]);

  const markComplete = (subtopic) => {
    setProgress(prev => ({
      ...prev,
      [subtopic]: true
    }));
  };

  const calculateProgress = () => {
    const completed = Object.values(progress).filter(Boolean).length;
    return Math.round((completed / subtopics.length) * 100);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Your Progress</h3>
        <span className="text-2xl font-bold text-indigo-600">{calculateProgress()}%</span>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
        <div
          className="bg-indigo-600 h-2.5 rounded-full"
          style={{ width: `${calculateProgress()}%` }}
        ></div>
      </div>
      
      <div className="space-y-3">
        {subtopics.map((subtopic, idx) => (
          <div key={idx} className="flex items-center justify-between">
            <span className="text-gray-700">{subtopic.title}</span>
            <button
              onClick={() => markComplete(subtopic.id)}
              className={`px-3 py-1 rounded ${
                progress[subtopic.id]
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              {progress[subtopic.id] ? 'Completed' : 'Mark Complete'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressTracker;