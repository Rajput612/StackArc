import React from 'react';

const CourseSidebar = () => {
  return (
    <aside className="bg-gray-800 text-white w-64 min-h-screen p-4">
      <h2 className="text-xl font-bold mb-4">Python Basics</h2>
      <nav>
        <ul className="space-y-2">
          <li>
            <a href="/courses/python-basics/introduction" className="block p-2 hover:bg-gray-700 rounded">
              Introduction
            </a>
          </li>
          <li>
            <a href="/courses/python-basics/variables" className="block p-2 bg-blue-600 rounded">
              Variables and Memory
            </a>
          </li>
          <li>
            <a href="/courses/python-basics/data-types" className="block p-2 hover:bg-gray-700 rounded">
              Data Types
            </a>
          </li>
          <li>
            <a href="/courses/python-basics/control-flow" className="block p-2 hover:bg-gray-700 rounded">
              Control Flow
            </a>
          </li>
          <li>
            <a href="/courses/python-basics/functions" className="block p-2 hover:bg-gray-700 rounded">
              Functions
            </a>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default CourseSidebar;
