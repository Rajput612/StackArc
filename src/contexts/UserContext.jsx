import React, { createContext, useContext, useState, useEffect } from 'react';
import { userThemes } from '../config/themes';

const UserContext = createContext();

export function UserProvider({ children }) {
  // Initialize from localStorage or default to 'intermediate'
  const [userType, setUserType] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('userType') || 'intermediate';
    }
    return 'intermediate';
  });

  // Update localStorage when userType changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('userType', userType);
    }
  }, [userType]);

  const theme = userThemes[userType];

  const value = {
    userType,
    setUserType,
    theme,
    isChildren: userType === 'children',
    isIntermediate: userType === 'intermediate',
    isProfessional: userType === 'professional'
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
