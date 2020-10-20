import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Toggle } from './Toggle';

test('<Toggle />', () => {
  const props = {
    name: 'sampleToggle',
    label: 'My toggle',
    value: true,
    onChange: jest.fn(),
  };
  render(<Toggle {...props} />);

  const component = screen.getByText(props.label);
  userEvent.click(component);
  expect(props.onChange).toHaveBeenCalledTimes(1);

  const input = screen.getByRole('checkbox');
  userEvent.click(input);
  expect(props.onChange).toHaveBeenCalledTimes(2);
});
