import React from 'react';

import { AuthStatus } from './AuthStatus';
import { LoginForm } from './LoginForm';

import './App.css';

export const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <AuthStatus />
        <LoginForm />
      </header>
    </div>
  );
};
