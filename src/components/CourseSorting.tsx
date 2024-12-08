import React, { useState, useEffect } from 'react';

const CourseSorting: React.FC = () => {
  const [selectedSort, setSelectedSort] = useState('newest');

  useEffect(() => {
    const updateURL = () => {
      const currentParams = new URLSearchParams(window.location.search);
      
      // Update ordering parameter
      if (selectedSort) {
        currentParams.set('ordering', selectedSort);
      } else {
        currentParams.delete('ordering');
      }

      const newURL = `${window.location.pathname}?${currentParams.toString()}`;
      window.history.pushState({ path: newURL }, '', newURL);
      
      // Dispatch custom event for sorting
      window.dispatchEvent(new CustomEvent('course-sort-change', {
        detail: { sort: selectedSort }
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
        <option value="title">Name (A-Z)</option>
        <option value="-title">Name (Z-A)</option>
        <option value="level">Level (Ascending)</option>
        <option value="-level">Level (Descending)</option>
      </select>
    </div>
  );
};

export default CourseSorting;
