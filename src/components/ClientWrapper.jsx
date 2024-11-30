import React from 'react';
import { UserProvider } from '../contexts/UserContext';
import UserTypeSelector from './UserTypeSelector';

export default function ClientWrapper({ children }) {
  return (
    <UserProvider>
      <UserTypeSelector />
      {children}
    </UserProvider>
  );
}
