import React from 'react';
import { useNavigate } from '../lib/react-redux-history';

import { useDispatch, useSelector } from '../store';
import { signingOut } from '../saga/auth';
import { User } from '../store/auth';

const LoggedIn: React.FC<{ user: User }> = ({ user }) => {
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
};

const NotLoggedIn: React.FC = () => {
  return <p>Not logged in</p>;
};

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const user = useSelector(state => state.auth.user);
  const profile = user ? <LoggedIn user={user} /> : <NotLoggedIn />;
  return (
    <div className="Profile">
      {profile}
      <button onClick={navigate('/')}>Home</button>
    </div>
  );
};

export default Profile;
