import React from 'react';
import { render, screen } from '@testing-library/react';

import ListItem from './component';

test('<ListItem />', () => {
  const props = {
    title: 'Some title',
    organization: 'MARAPP',
    labels: ['first', 'second', 'last'],
  };
  const { rerender } = render(<ListItem {...props} />);

  expect(screen.getByText(props.title)).toBeInTheDocument();
  expect(screen.getByText(props.organization)).toBeInTheDocument();

  // labels render correctly
  expect(screen.getByText(`${props.labels[0]},`)).toBeInTheDocument();
  expect(screen.getByText(`${props.labels[1]},`)).toBeInTheDocument();
  // last one doesn't render a comma (,)
  expect(screen.getByText(`${props.labels[2]}`)).toBeInTheDocument();

  rerender(<ListItem {...props} organization={null} />);

  expect(screen.queryByText(props.organization)).toBe(null);
});
