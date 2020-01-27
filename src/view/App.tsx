import React from 'react';
import { Routes, useRoutes } from '../lib/react-redux-history';

import { Home } from './Home';
import { LoginForm } from './LoginForm';
import { Profile } from './Profile';

import './App.css';
import { locationSlicer } from '../store';

const routes: Routes = {
  '/': <Home />,
  '/signin': <LoginForm />,
  '/profile': <Profile />
};

export const App: React.FC = () => {
  const routeResult = useRoutes(routes, locationSlicer);
  return (
    <div className="App">
      <header className="App-header">{routeResult}</header>
    </div>
  );
};
