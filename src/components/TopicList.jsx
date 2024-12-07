import React from 'react';
import { Link } from 'react-router-dom';
import { LockIcon } from './LockIcon';
import { useAuth } from '../contexts/AuthContext';

export const TopicList = ({ topics, courseSlug }) => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="space-y-4">
      {topics.map((topic) => {
        const isAccessible = topic.is_preview || isAuthenticated;
        
        return (
          <div
            key={topic.slug}
            className={`p-4 rounded-lg border ${
              isAccessible ? 'bg-white' : 'bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <LockIcon locked={!isAccessible} />
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {topic.title}
                  </h3>
                  {topic.is_preview && (
                    <span className="text-sm text-green-600">Preview Available</span>
                  )}
                </div>
              </div>
              {topic.is_completed && (
                <span className="text-green-600">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </span>
              )}
            </div>
            <p className="mt-1 text-sm text-gray-600">{topic.description}</p>
            <div className="mt-4">
              <Link
                to={`/courses/${courseSlug}/${topic.slug}`}
                className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium ${
                  isAccessible
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                }`}
                onClick={(e) => !isAccessible && e.preventDefault()}
              >
                {isAccessible ? 'Start Learning' : 'Login to Access'}
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
};
