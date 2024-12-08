import React, { useState, useEffect } from 'react';

const sortOptions = [
  { value: '', label: 'Default Sorting' },
  { value: 'title', label: 'Title (A-Z)' },
  { value: '-title', label: 'Title (Z-A)' },
  { value: 'level', label: 'Level (Ascending)' },
  { value: '-level', label: 'Level (Descending)' },
  { value: 'created_at', label: 'Newest First' },
  { value: '-created_at', label: 'Oldest First' }
];

interface CourseSortingProps {
  initialSort?: string;
}

const CourseSorting: React.FC<CourseSortingProps> = ({ 
  initialSort = '' 
}) => {
  const [selectedSort, setSelectedSort] = useState(initialSort);

  useEffect(() => {
    const updateSorting = () => {
      // Dispatch custom event with sort parameter
      window.dispatchEvent(new CustomEvent('course-sort-change', {
        detail: { sort: selectedSort }
      }));
    };

    updateSorting();
  }, [selectedSort]);

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSort(event.target.value);
  };

  return (
    <div className="flex items-center space-x-3 w-full">
      <label 
        htmlFor="course-sorting" 
        className="text-sm font-medium text-gray-700 dark:text-gray-200 whitespace-nowrap"
      >
        Sort By:
      </label>
      <div className="flex-grow">
        <select 
          id="course-sorting" 
          name="ordering"
          value={selectedSort}
          onChange={handleSortChange}
          className="block w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm py-2 px-3"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default CourseSorting;
