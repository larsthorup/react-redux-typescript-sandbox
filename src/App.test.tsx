import React from 'react';
import { render } from '@testing-library/react';
import { rootComponent } from './root';

test('renders login page', () => {
  const { getByText } = render(rootComponent);
  const loginElement = getByText(/Login/i);
  expect(loginElement).toBeInTheDocument();
});
