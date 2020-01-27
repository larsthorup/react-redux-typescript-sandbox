import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from '../store';
import { historyPush } from '../lib/redux-history';

export function Home() {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const navigate = (pathname: string) => (e: React.MouseEvent) => {
    // ToDo: useNavigate
    e.preventDefault();
    dispatch(historyPush({ pathname }));
  };
  const status = (loggedIn => {
    if (loggedIn) {
      return (
        <p>
          <button onClick={navigate('/profile')}>Profile</button>
        </p>
      );
    } else {
      return (
        <p>
          Please<button onClick={navigate('/signin')}>Sign in</button>
        </p>
      );
    }
  })(!!user);
  return <div className="Home">{status}</div>;
}
