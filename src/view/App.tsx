import React, { ReactElement } from 'react';
import { useSelector } from 'react-redux';

import { Home } from './Home';
import { LoginForm } from './LoginForm';
import { Profile } from './Profile';

import './App.css';
import { RootState } from '../store';

const routes: { [key: string]: ReactElement } = {
  '/': <Home />,
  '/signin': <LoginForm />,
  '/profile': <Profile />
};

export const App: React.FC = () => {
  const pathname = useSelector((state: RootState) => state.location.pathname);
  const routeResult = routes[pathname];
  return (
    <div className="App">
      <header className="App-header">{routeResult}</header>
    </div>
  );
};
