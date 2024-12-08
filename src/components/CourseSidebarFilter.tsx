import React, { useState, useEffect } from 'react';

interface CourseSidebarFilterProps {
  initialSelectedLevel?: string;
  initialSearchQuery?: string;
  initialSelectedStatus?: string;
}

const CourseSidebarFilter: React.FC<CourseSidebarFilterProps> = ({
  initialSelectedLevel = '',
  initialSearchQuery = '',
  initialSelectedStatus = ''
}) => {
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [selectedLevel, setSelectedLevel] = useState(initialSelectedLevel);
  const [selectedStatus, setSelectedStatus] = useState(initialSelectedStatus);

  useEffect(() => {
    const updateURL = () => {
      const currentParams = new URLSearchParams(window.location.search);

      // Update search parameter
      if (searchQuery) {
        currentParams.set('search', searchQuery);
      } else {
        currentParams.delete('search');
      }

      // Update level parameter
      if (selectedLevel) {
        currentParams.set('level', selectedLevel);
      } else {
        currentParams.delete('level');
      }

      // Update status parameter
      if (selectedStatus) {
        currentParams.set('status', selectedStatus);
      } else {
        currentParams.delete('status');
      }

      const newURL = `${window.location.pathname}?${currentParams.toString()}`;
      window.history.pushState({ path: newURL }, '', newURL);
      
      // Dispatch custom event for filtering
      window.dispatchEvent(new CustomEvent('course-filter-change', {
        detail: { params: currentParams.toString() }
      }));
    };

    updateURL();
  }, [searchQuery, selectedLevel, selectedStatus]);

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedLevel('');
    setSelectedStatus('');
  };

  return (
    <div className="space-y-6">
      {/* Search */}
      <div>
        <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
          Search Courses
        </label>
        <div className="mt-1">
          <input
            type="search"
            name="search"
            id="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Search courses..."
          />
        </div>
      </div>

      {/* Level Filter */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-200">Level</h3>
        <div className="mt-2 space-y-2">
          {['', 'beginner', 'intermediate', 'advanced'].map((level) => (
            <div key={level} className="flex items-center">
              <input
                id={`level-${level || 'all'}`}
                name="level"
                type="radio"
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
          {['', 'available', 'coming-soon'].map((status) => (
            <div key={status} className="flex items-center">
              <input
                id={`status-${status || 'all'}`}
                name="status"
                type="radio"
                checked={selectedStatus === status}
                onChange={() => setSelectedStatus(status)}
                className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label 
                htmlFor={`status-${status || 'all'}`} 
                className="ml-3 block text-sm text-gray-700 dark:text-gray-300 capitalize"
              >
                {status || 'All Statuses'}
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
