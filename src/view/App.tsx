import React, { Suspense } from 'react';
import { Routes } from '../lib/react-redux-history';

import Home from './Home';
import LoginForm from './LoginForm';
import { useRoutes } from '../store';

import './App.css';

const Profile = React.lazy(() => import('./Profile'));

const routes: Routes = {
  '/': <Home />,
  '/signin': <LoginForm />,
  '/profile': <Profile />
};

const App: React.FC = () => {
  const routeResult = useRoutes(routes);
  const Loading = () => <div>Loading...</div>;
  return (
    <div className="App">
      <header className="App-header">
        <Suspense fallback={<Loading />}>{routeResult}</Suspense>
      </header>
    </div>
  );
};

export default App;
