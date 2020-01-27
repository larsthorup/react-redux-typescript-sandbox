import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import { signingIn } from '../saga/auth';

export function LoginForm() {
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const onPasswordChange: React.ChangeEventHandler<HTMLInputElement> = e =>
    setPassword(e.target.value);
  const onUsernameChange: React.ChangeEventHandler<HTMLInputElement> = e =>
    setUsername(e.target.value);
  const dispatch = useDispatch();
  const onSubmit: React.FormEventHandler = e => {
    e.preventDefault();
    dispatch(signingIn(username, password));
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
}
