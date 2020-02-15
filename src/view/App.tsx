import React, { Suspense } from 'react';
import { Routes, useRoutes } from '../lib/react-redux-history';

import Home from './Home';
import LoginForm from './LoginForm';
import './App.css';
import { locationSlicer } from '../store';

const Profile = React.lazy(() => import('./Profile'));

const routes: Routes = {
  '/': <Home />,
  '/signin': <LoginForm />,
  '/profile': <Profile />
};

const App: React.FC = () => {
  const routeResult = useRoutes(routes, locationSlicer);
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
