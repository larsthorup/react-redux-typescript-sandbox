import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { createRootElement } from '../root';
import { getRowRenderCount, resetRowRenderCount } from '../lib/react-table';

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

  // When: login with wrong password
  const usernameInput = screen.getByPlaceholderText('User name');
  const passwordInput = screen.getByPlaceholderText("Password (use 'p')");
  userEvent.type(usernameInput, 'Lars');
  userEvent.type(passwordInput, 'w');
  userEvent.click(getLoginButton());

  // Then: eventually see error message
  await screen.findByText('Error: Authorization failed');

  // When: login with correct password
  userEvent.type(passwordInput, '{backspace}p');
  userEvent.click(getLoginButton());

  // When: waiting for fetch
  await waitFor(getProfileButton);

  // Then: is on home page
  expect(getPeopleButton()).toBeInTheDocument();

  // When: navigate to people page
  userEvent.click(getPeopleButton());

  // Then: eventually on people page
  expect(await screen.findByText('Ronja')).toBeInTheDocument();

  // Then: each row rendered only once
  expect(getRowRenderCount()).toEqual(4);
  resetRowRenderCount();

  // When: click first edit button
  userEvent.click(screen.getByRole('button', { name: 'Edit Adam' }));

  // Then: see edit form
  await screen.findAllByRole('button', { name: 'Save name' });

  // When: change name and click save
  userEvent.type(screen.getByPlaceholderText('name'), 'X');
  userEvent.click(screen.getByRole('button', { name: 'Save name' }));

  // When: click close
  userEvent.click(screen.getByRole('button', { name: 'Close AdamX' }));

  // Then: see updated name
  expect(await screen.findByText('AdamX')).toBeInTheDocument();

  // Then: only that row was re-rendered
  expect(getRowRenderCount()).toEqual(1);

  // When: navigate back
  userEvent.click(screen.getByText('Back'));

  // Then: is on home page:
  await screen.findByText('Profile');
  expect(getProfileButton()).toBeInTheDocument();

  // When: navigate to profile
  userEvent.click(getProfileButton());

  // When: waiting for lazy load
  await waitFor(getLoggedInStatus);

  // Then: is on profile page
  expect(getLoggedInStatus()).toBeInTheDocument();
  expect(getLogoutButton()).toBeInTheDocument();

  // When: logout
  userEvent.click(getLogoutButton());

  // Then: logged out
  expect(getLoggedOutStatus()).toBeInTheDocument();
});
