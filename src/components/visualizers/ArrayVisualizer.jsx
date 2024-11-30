import React, { useState } from 'react';

const ArrayVisualizer = () => {
  const [array, setArray] = useState([1, 3, 5, 7, 9]);
  const [newValue, setNewValue] = useState('');
  const [index, setIndex] = useState('');

  const handleInsert = () => {
    if (newValue && index !== '') {
      const newArray = [...array];
      newArray.splice(parseInt(index), 0, parseInt(newValue));
      setArray(newArray);
      setNewValue('');
      setIndex('');
    }
  };

  const handleDelete = (idx) => {
    const newArray = array.filter((_, i) => i !== idx);
    setArray(newArray);
  };

  return (
    <div className="space-y-6">
      <div className="flex space-x-4">
        {array.map((num, idx) => (
          <div
            key={idx}
            className="w-12 h-12 flex items-center justify-center bg-indigo-100 border border-indigo-200 rounded-lg relative"
          >
            <span className="text-indigo-800 font-semibold">{num}</span>
            <span className="absolute -bottom-6 text-sm text-gray-500">
              {idx}
            </span>
            <button
              onClick={() => handleDelete(idx)}
              className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 text-white rounded-full text-xs flex items-center justify-center"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <div className="flex space-x-4">
        <input
          type="number"
          value={newValue}
          onChange={(e) => setNewValue(e.target.value)}
          placeholder="Value"
          className="border rounded px-3 py-2 w-24"
        />
        <input
          type="number"
          value={index}
          onChange={(e) => setIndex(e.target.value)}
          placeholder="Index"
          className="border rounded px-3 py-2 w-24"
        />
        <button
          onClick={handleInsert}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          Insert
        </button>
      </div>
    </div>
  );
};

export default ArrayVisualizer;