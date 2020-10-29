/*
  Copyright 2018-2020 National Geographic Society

  Use of this software does not constitute endorsement by National Geographic
  Society (NGS). The NGS name and NGS logo may not be used for any purpose without
  written permission from NGS.

  Licensed under the Apache License, Version 2.0 (the "License"); you may not use
  this file except in compliance with the License. You may obtain a copy of the
  License at

      https://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed
  under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
  CONDITIONS OF ANY KIND, either express or implied. See the License for the
  specific language governing permissions and limitations under the License.
*/

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import { EmailInput } from './EmailInput';

describe('<EmailInput />', () => {
  it('should render correctly a single input with a placeholder', () => {
    const placeholder = 'Test placeholder';

    render(<EmailInput isMulti={false} placeholder={placeholder} />);

    expect(screen.getByText(placeholder)).toBeInTheDocument();
  });

  it('should render correctly a multi input with a placeholder', () => {
    const placeholder = 'Test placeholder';

    render(<EmailInput isMulti={true} placeholder={placeholder} />);

    expect(screen.getByText(placeholder)).toBeInTheDocument();
  });

  it('should render correctly a single input with single default value', () => {
    const defaultValue = {
      label: 'Test1 label',
      value: 'test1',
    };

    render(<EmailInput isMulti={false} defaultValue={defaultValue} />);

    expect(screen.getByText(defaultValue.label)).toBeInTheDocument();
  });

  it('should render correctly a multi input with multiple default value', () => {
    const defaultValue = [
      {
        label: 'Test1 label',
        value: 'test1',
      },
      {
        label: 'Test2 label',
        value: 'test2',
      },
    ];

    render(<EmailInput isMulti={true} defaultValue={defaultValue} />);

    expect(screen.getByText(defaultValue[0].label)).toBeInTheDocument();
    expect(screen.getByText(defaultValue[1].label)).toBeInTheDocument();
  });

  it('should render correctly a multi input when typing 2 valid emails', () => {
    const { container } = render(<EmailInput isMulti={true} />);

    const nativeContainerInput = container.querySelector('input');

    const inputValues = ['zxc@asd.com', 'test@asd.com'];

    fireEvent.input(nativeContainerInput, { target: { value: inputValues[0] } });
    fireEvent.keyDown(nativeContainerInput, { key: 'Enter' });
    fireEvent.input(nativeContainerInput, { target: { value: inputValues[1] } });
    fireEvent.keyDown(nativeContainerInput, { key: 'Enter' });

    expect(screen.getByText(inputValues[0])).toBeInTheDocument();
    expect(screen.getByText(inputValues[1])).toBeInTheDocument();
  });

  it('should render correctly a multi input when typing 1 valid & 1 wrong email', () => {
    const { container } = render(<EmailInput isMulti={true} />);

    const nativeContainerInput = container.querySelector('input');

    const inputValues = ['zbc', 'test@asd.com'];

    fireEvent.input(nativeContainerInput, { target: { value: inputValues[0] } });
    fireEvent.keyDown(nativeContainerInput, { key: 'Enter' });
    fireEvent.input(nativeContainerInput, { target: { value: inputValues[1] } });
    fireEvent.keyDown(nativeContainerInput, { key: 'Enter' });

    expect(screen.queryByText(inputValues[0])).toBeNull();
    expect(screen.getByText(inputValues[1])).toBeInTheDocument();
  });

  it('should render correctly a multi input with default value when typing 1 valid email', () => {
    const defaultValue = [
      {
        label: 'abc@test.com',
        value: 'abc@test.com',
      },
      {
        label: 'xyz@test.com',
        value: 'xyz@test.com',
      },
    ];

    const { container } = render(<EmailInput isMulti={true} defaultValue={defaultValue} />);

    const nativeContainerInput = container.querySelector('input');

    const inputValues = ['test@asd.com'];

    fireEvent.input(nativeContainerInput, { target: { value: inputValues[0] } });
    fireEvent.keyDown(nativeContainerInput, { key: 'Enter' });

    expect(screen.getByText(defaultValue[0].label)).toBeInTheDocument();
    expect(screen.getByText(defaultValue[1].label)).toBeInTheDocument();
    expect(screen.getByText(inputValues[0])).toBeInTheDocument();
  });

  it('should render correctly a multi input with default value when typing 1 invalid email', () => {
    const defaultValue = [
      {
        label: 'abc@test.com',
        value: 'abc@test.com',
      },
      {
        label: 'xyz@test.com',
        value: 'xyz@test.com',
      },
    ];

    const { container } = render(<EmailInput isMulti={true} defaultValue={defaultValue} />);

    const nativeContainerInput = container.querySelector('input');

    const inputValues = ['test'];

    fireEvent.input(nativeContainerInput, { target: { value: inputValues[0] } });
    fireEvent.keyDown(nativeContainerInput, { key: 'Enter' });

    //empty the previous typed value
    fireEvent.input(nativeContainerInput, { target: { value: '' } });
    fireEvent.keyDown(nativeContainerInput, { key: 'Enter' });

    expect(screen.getByText(defaultValue[0].label)).toBeInTheDocument();
    expect(screen.getByText(defaultValue[1].label)).toBeInTheDocument();
    expect(screen.queryByText(inputValues[0])).toBeNull();
  });

  it('should render correctly a multi input when typing 1 valid email and removing it', () => {
    const { container } = render(<EmailInput isMulti={true} />);

    const nativeContainerInput = container.querySelector('input');

    const inputValues = ['test@asd.com'];

    fireEvent.input(nativeContainerInput, { target: { value: inputValues[0] } });
    fireEvent.keyDown(nativeContainerInput, { key: 'Enter' });

    const renderedOption = screen.getByText(inputValues[0]);

    expect(renderedOption).toBeInTheDocument();

    const removeButton = renderedOption.nextSibling; // the 'x' button to remove it

    fireEvent.click(removeButton);

    expect(screen.queryByText(inputValues[0])).toBeNull();
  });

  it('should render correctly a multi input when typing 2 valid email and removing 1', () => {
    const { container } = render(<EmailInput isMulti={true} />);

    const nativeContainerInput = container.querySelector('input');

    const inputValues = ['abc@test.com', 'xyz@test.com'];

    fireEvent.input(nativeContainerInput, { target: { value: inputValues[0] } });
    fireEvent.keyDown(nativeContainerInput, { key: 'Enter' });

    fireEvent.input(nativeContainerInput, { target: { value: inputValues[1] } });
    fireEvent.keyDown(nativeContainerInput, { key: 'Enter' });

    const renderedOption1 = screen.getByText(inputValues[0]);

    expect(renderedOption1).toBeInTheDocument();
    expect(screen.getByText(inputValues[1])).toBeInTheDocument();

    const removeButton = renderedOption1.nextSibling; // the 'x' button to remove it

    fireEvent.click(removeButton);

    expect(screen.queryByText(inputValues[0])).toBeNull();
    expect(screen.getByText(inputValues[1])).toBeInTheDocument();
  });
});
