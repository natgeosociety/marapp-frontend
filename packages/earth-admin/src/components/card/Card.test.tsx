import React from 'react';
import { render, screen } from '@testing-library/react';

import { Card } from './Card';

test('<Card/>', () => {
  render(<Card>hello man</Card>);

  const component = screen.getByText('hello man');

  expect(component).toBeInTheDocument();
});
