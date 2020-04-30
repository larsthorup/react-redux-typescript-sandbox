import React, { useState } from 'react';
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
  const onSubmit: React.FormEventHandler = e => {
    e.preventDefault();
    dispatch(signingIn({ username }));
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
        placeholder="Password"
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
