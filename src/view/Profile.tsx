import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { signingOut } from '../saga/auth';
import { RootState } from '../store';
import { historyPush } from '../lib/redux-history';
import { User } from '../store/auth';

function LoggedIn({ user }: { user: User }) {
  const dispatch = useDispatch();
  const onClick = (e: React.MouseEvent) => {
    e.preventDefault();
    dispatch(signingOut());
  };
  return (
    <p>
      {user.name}
      <button onClick={onClick}>Logout</button>
    </p>
  );
}

function NotLoggedIn() {
  return <p>Not logged in</p>;
}

export function Profile() {
  const user = useSelector((state: RootState) => state.auth.user);
  const profile = user ? <LoggedIn user={user} /> : <NotLoggedIn />;
  const dispatch = useDispatch();
  const navigate = (pathname: string) => (e: React.MouseEvent) => {
    // ToDo: useNavigate
    e.preventDefault();
    dispatch(historyPush({ pathname }));
  };
  return (
    <div className="Profile">
      {profile}
      <button onClick={navigate('/')}>Home</button>
    </div>
  );
}
