import React, { ReactElement } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from './store';
import { User, signout } from './store/auth';
import { signingIn } from './saga/auth';

const LoggedIn: React.FC<{ user: User }> = ({ user }) => {
  const dispatch = useDispatch();
  const onClick: React.MouseEventHandler<HTMLButtonElement> = e => {
    e.preventDefault();
    dispatch(signout());
  };
  return (
    <p>
      {user.name} - <button onClick={onClick}>Logout</button>
    </p>
  );
};

const NotLoggedIn: React.FC = () => {
  const dispatch = useDispatch();
  const onClick: React.MouseEventHandler<HTMLButtonElement> = e => {
    e.preventDefault();
    dispatch(signingIn('Dr. Who'));
  };
  return (
    <p>
      Please <button onClick={onClick}>Login</button>
    </p>
  );
};

export const AuthStatus: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const status: ReactElement = user ? (
    <LoggedIn user={user} />
  ) : (
    <NotLoggedIn />
  );
  return <div className="AuthStatus">{status}</div>;
};
