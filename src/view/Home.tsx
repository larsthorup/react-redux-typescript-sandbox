import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from '../lib/react-redux-history';

import { RootState } from '../store';

const Home: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();
  const loggedIn = !!user;
  const status = loggedIn ? (
    <p>
      <button onClick={navigate('/profile')}>Profile</button>
    </p>
  ) : (
    <p>
      Please
      <button onClick={navigate('/signin', {}, { replace: true })}>Sign in</button>
    </p>
  );
  return <div className="Home">{status}</div>;
};

export default Home;