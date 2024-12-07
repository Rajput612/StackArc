import React from 'react';

const DifficultyBadge = ({ difficulty }) => {
  const colors = {
    Beginner: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200',
    Intermediate: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200',
    Advanced: 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-200'
  };

  return (
    <span className={`px-2 py-1 rounded-full text-sm ${colors[difficulty] || colors.Intermediate}`}>
      {difficulty}
    </span>
  );
};

export default function CourseCard({ course }) {
  const statusClass = course.status === 'coming-soon' ? 'bg-gray-100 dark:bg-gray-800' : 'bg-white dark:bg-gray-700';
  const levelColorClass = {
    'Beginner': 'text-green-600 dark:text-green-400',
    'Intermediate': 'text-yellow-600 dark:text-yellow-400',
    'Advanced': 'text-red-600 dark:text-red-400'
  }[course.level] || 'text-gray-600 dark:text-gray-400';

  return (
    <div 
      className={`rounded-lg shadow-md ${statusClass} overflow-hidden transition-transform duration-200 hover:scale-105`}
      role="article"
      aria-label={`${course.title} course card`}
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-4xl" role="img" aria-label="Course icon">
            {course.icon}
          </span>
          <span className={`text-sm font-medium ${levelColorClass}`}>
            {course.level}
          </span>
        </div>
        
        <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
          {course.title}
        </h2>
        
        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
          {course.description}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {course.topic_count} {course.topic_count === 1 ? 'Topic' : 'Topics'}
          </span>
          
          {course.status === 'coming-soon' ? (
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
              Coming Soon
            </span>
          ) : (
            <button 
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
              onClick={() => window.location.href = `/courses/${course.id}`}
            >
              Start Learning
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
