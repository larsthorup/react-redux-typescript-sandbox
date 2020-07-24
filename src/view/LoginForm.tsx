import React, { useState } from 'react';
import { historyReplace } from '../lib/redux-history';
import { useDispatch } from '../store';

import { signingIn } from '../saga/auth';

const LoginForm: React.FC = () => {
  const dispatch = useDispatch();
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const onPasswordChange: React.ChangeEventHandler<HTMLInputElement> = e =>
    setPassword(e.target.value);
  const onUsernameChange: React.ChangeEventHandler<HTMLInputElement> = e =>
    setUsername(e.target.value);
  const onSubmit: React.FormEventHandler = async e => {
    e.preventDefault();
    await dispatch(signingIn({ password, username }));
    dispatch(historyReplace({ pathname: '/' }));
  };
  return (
    <form className="LoginForm" onSubmit={onSubmit}>
      <input
        name="username"
        placeholder="User name"
        value={username}
        onChange={onUsernameChange}
      />
      <br />
      <input
        name="password"
        placeholder="Password (use 'p')"
        value={password}
        onChange={onPasswordChange}
        type="password"
      />
      <br />
      <button type="submit">Login</button>
    </form>
  );
};

export default LoginForm;
