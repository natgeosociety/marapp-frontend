import React from 'react';
import { render, screen } from '@testing-library/react';

import { UserMenu } from './UserMenu';

test('<UserMenu />', () => {
  const props = {
    isAuthenticated: true,
    profileLink: <a href="/profile">Your profile</a>,
  };
  render(<UserMenu {...props} />);

  expect(screen.getByText('Your profile')).toBeInTheDocument();
});
