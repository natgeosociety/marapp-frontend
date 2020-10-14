import React from 'react';
import { render } from '@testing-library/react';

import { Card } from './Card';

test('<Card/> renders correctly', () => {
  const { getByText } = render(<Card className="something">hello man</Card>);
  const component = getByText('hello man');

  expect(component).toBeInTheDocument();
  expect(component).toHaveClass('something');
});
