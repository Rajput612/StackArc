import React, { useState, useEffect } from 'react';

const CourseSorting: React.FC = () => {
  const [selectedSort, setSelectedSort] = useState('newest');

  useEffect(() => {
    const updateURL = () => {
      const currentParams = new URLSearchParams(window.location.search);
      
      // Update sort parameter
      if (selectedSort) {
        currentParams.set('sort', selectedSort);
      } else {
        currentParams.delete('sort');
      }

      const newURL = `${window.location.pathname}?${currentParams.toString()}`;
      window.history.pushState({ path: newURL }, '', newURL);
      
      // Dispatch custom event for filtering
      window.dispatchEvent(new CustomEvent('course-filter-change', {
        detail: { params: currentParams.toString() }
      }));
    };

    updateURL();
  }, [selectedSort]);

  return (
    <div>
      <select
        name="sort"
        value={selectedSort}
        onChange={(e) => setSelectedSort(e.target.value)}
        className="block w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
      >
        <option value="newest">Newest First</option>
        <option value="oldest">Oldest First</option>
        <option value="name">Name (A-Z)</option>
        <option value="name-desc">Name (Z-A)</option>
        <option value="level">Level (Ascending)</option>
        <option value="level-desc">Level (Descending)</option>
      </select>
    </div>
  );
};

export default CourseSorting;
