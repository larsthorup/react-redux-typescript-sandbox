import { render, screen, wait } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { createRootElement } from '../root';
import App from './App';

test('auth flow', async () => {
  const getLoggedOutStatus = () => screen.getByText('Please');
  const getLoggedInStatus = () => screen.getByText('Lars');
  const getLogoutButton = () => screen.getByText('Logout');
  const getLoginButton = () => screen.getByText('Login');
  const getSigninButton = () => screen.getByText('Sign in');
  const getProfileButton = () => screen.getByText('Profile');
  const getPeopleButton = () => screen.getByText('People');

  // When: rendered
  render(createRootElement());

  // Then: is logged out
  expect(getLoggedOutStatus()).toBeInTheDocument();

  // When: navigate to sign in
  userEvent.click(getSigninButton());

  // When: login
  const usernameInput = screen.getByPlaceholderText('User name');
  const passwordInput = screen.getByPlaceholderText("Password (use 'p')");
  userEvent.type(usernameInput, 'Lars');
  userEvent.type(passwordInput, 'p');
  userEvent.click(getLoginButton());

  // When: waiting for fetch
  await wait(getProfileButton);

  // Then: is on home page
  expect(getPeopleButton()).toBeInTheDocument();

  // When: navigate to people page
  userEvent.click(getPeopleButton());

  // Then: on people page
  expect(await screen.findByText('Ronja')).toBeInTheDocument();

  // When: invoke "random" button
  userEvent.click(screen.getAllByText('random')[0]);

  // When: navigate back
  userEvent.click(screen.getByText('Back'));

  // Then: is on home page:
  await screen.findByText('Profile');
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
