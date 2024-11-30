import React, { useState } from 'react';
import * as d3 from 'd3';

const CodeExecutionVisualizer = ({ code, steps }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [speed, setSpeed] = useState(1000);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying && currentStep < steps.length - 1) {
      const interval = setInterval(() => {
        setCurrentStep(prev => {
          if (prev >= steps.length - 1) {
            clearInterval(interval);
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, speed);
    }
  };

  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm">
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <div className="space-x-2">
            <button
              onClick={handlePrev}
              disabled={currentStep === 0}
              className="px-3 py-1 bg-indigo-600 text-white rounded disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={togglePlay}
              className="px-3 py-1 bg-indigo-600 text-white rounded"
            >
              {isPlaying ? 'Pause' : 'Play'}
            </button>
            <button
              onClick={handleNext}
              disabled={currentStep === steps.length - 1}
              className="px-3 py-1 bg-indigo-600 text-white rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-600">Speed:</label>
            <input
              type="range"
              min="100"
              max="2000"
              value={speed}
              onChange={(e) => setSpeed(parseInt(e.target.value))}
              className="w-32"
            />
          </div>
        </div>
        <div className="h-60 border rounded p-4 bg-gray-50">
          {steps[currentStep]?.visualization}
        </div>
      </div>
      <div className="bg-gray-100 p-4 rounded">
        <pre className="text-sm">
          <code>{steps[currentStep]?.explanation}</code>
        </pre>
      </div>
    </div>
  );
};

export default CodeExecutionVisualizer;