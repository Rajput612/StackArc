import React, { useState, useEffect, useRef } from 'react';

const levels = ['', 'Beginner', 'Intermediate', 'Advanced'];
const statuses = ['', 'available', 'coming-soon'];

interface CourseSidebarFilterProps {
  initialSearchQuery?: string;
  initialSelectedLevel?: string;
  initialSelectedStatus?: string;
}

const CourseSidebarFilter: React.FC<CourseSidebarFilterProps> = ({
  initialSearchQuery = '',
  initialSelectedLevel = '',
  initialSelectedStatus = ''
}) => {
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [selectedLevel, setSelectedLevel] = useState(initialSelectedLevel);
  const [selectedStatus, setSelectedStatus] = useState(initialSelectedStatus);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const updateFilters = () => {
      const params = new URLSearchParams();

      // Search
      if (searchQuery.trim()) {
        params.set('search', searchQuery.trim());
      }

      // Level
      if (selectedLevel) {
        params.set('level', selectedLevel);
      }

      // Status
      if (selectedStatus) {
        params.set('status', selectedStatus);
      }

      // Dispatch custom event with filter parameters
      window.dispatchEvent(new CustomEvent('course-filter-change', {
        detail: { params: params.toString() }
      }));
    };

    updateFilters();
  }, [searchQuery, selectedLevel, selectedStatus]);

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedLevel('');
    setSelectedStatus('');
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    searchInputRef.current?.focus();
  };

  return (
    <div className="space-y-6">
      {/* Search Input */}
      <div>
        <label 
          htmlFor="course-search" 
          className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
        >
          Search Courses
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              strokeWidth={1.5} 
              stroke="currentColor" 
              className="h-5 w-5 text-gray-400 dark:text-gray-500"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" 
              />
            </svg>
          </div>
          <input 
            type="search" 
            id="course-search" 
            ref={searchInputRef}
            name="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search courses..." 
            className="block w-full pl-10 pr-10 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                strokeWidth={1.5} 
                stroke="currentColor" 
                className="h-5 w-5 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  d="M6 18 18 6M6 6l12 12" 
                />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Level Filter */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-200">Level</h3>
        <div className="mt-2 space-y-2">
          {levels.map((level) => (
            <div key={level} className="flex items-center">
              <input
                id={`level-${level || 'all'}`}
                name="level"
                type="radio"
                value={level}
                checked={selectedLevel === level}
                onChange={() => setSelectedLevel(level)}
                className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label 
                htmlFor={`level-${level || 'all'}`} 
                className="ml-3 block text-sm text-gray-700 dark:text-gray-300 capitalize"
              >
                {level || 'All Levels'}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Status Filter */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-200">Status</h3>
        <div className="mt-2 space-y-2">
          {statuses.map((status) => (
            <div key={status} className="flex items-center">
              <input
                id={`status-${status || 'all'}`}
                name="status"
                type="radio"
                value={status}
                checked={selectedStatus === status}
                onChange={() => setSelectedStatus(status)}
                className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label 
                htmlFor={`status-${status || 'all'}`} 
                className="ml-3 block text-sm text-gray-700 dark:text-gray-300 capitalize"
              >
                {status === 'coming-soon' ? 'Coming Soon' : (status || 'All Statuses')}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Clear Filters Button */}
      <div className="pt-2">
        <button
          type="button"
          onClick={handleClearFilters}
          className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
};

export default CourseSidebarFilter;
