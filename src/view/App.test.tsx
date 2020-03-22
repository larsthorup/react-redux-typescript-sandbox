import React from 'react';
import { render, wait } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { createRootElement } from '../root';
import App from './App';

test('auth flow', async () => {
  const getLoggedOutStatus = () => getByText('Please');
  const getLoggedInStatus = () => getByText('Lars');
  const getLogoutButton = () => getByText('Logout');
  const getLoginButton = () => getByText('Login');
  const getSigninButton = () => getByText('Sign in');
  const getProfileButton = () => getByText('Profile');

  // When: rendered
  const { getByPlaceholderText, getByText } = render(createRootElement());

  // Then: is logged out
  expect(getLoggedOutStatus()).toBeInTheDocument();

  // When: navigate to sign in
  userEvent.click(getSigninButton());

  // When: login
  const usernameInput = getByPlaceholderText('User name');
  const passwordInput = getByPlaceholderText('Password');
  userEvent.type(usernameInput, 'Lars');
  userEvent.type(passwordInput, 'whatever');
  userEvent.click(getLoginButton());

  // When: waiting for fetch
  await wait(getProfileButton);

  // Then: is logged in
  expect(getProfileButton()).toBeInTheDocument();

  // When: navigate to profile
  userEvent.click(getProfileButton());

  // When: waiting for lazy load
  await wait(getLoggedInStatus);

  // Then: is on profile page
  expect(getLoggedInStatus()).toBeInTheDocument();
  expect(getLogoutButton()).toBeInTheDocument();

  // When: logout
  userEvent.click(getLogoutButton());

  // Then: logged out
  expect(getLoggedOutStatus()).toBeInTheDocument();
});
