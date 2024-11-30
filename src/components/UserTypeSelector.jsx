import React from 'react';
import { useUser } from '../contexts/UserContext';
import { userThemes } from '../config/themes';

const UserTypeSelector = () => {
  const { userType, setUserType } = useUser();

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="bg-white rounded-lg shadow-lg p-2 flex gap-2">
        {Object.entries(userThemes).map(([type, theme]) => (
          <button
            key={type}
            onClick={() => setUserType(type)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              userType === type
                ? `bg-gradient-to-r ${theme.colors.primary} text-white`
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {theme.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default UserTypeSelector;
