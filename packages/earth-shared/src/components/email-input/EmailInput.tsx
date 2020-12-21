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

import React, { useState } from 'react';
import Creatable from 'react-select/creatable';

import { validEmail } from '../../index';
import { CUSTOM_STYLES, SELECT_THEME } from '../../theme';

export interface EmailInputProps {
  // creatable?
  isMulti?: Boolean;
  placeholder?: String;
  isDisabled?: Boolean;
  className?: String;
  [key: string]: any;
}

const customStyles = {
  ...CUSTOM_STYLES,
  multiValueLabel: (provided, state) => {
    return {
      ...provided,
      color: state.data.hasError
        ? 'red'
        : state.data.skipped
        ? 'orange'
        : state.data.hasSuccess
        ? 'green'
        : 'var(--marapp-gray-9)',
      borderRadius: '50px',
      display: 'flex',
    };
  },
  multiValueRemove: (provided, state) => ({
    ...provided,
    color: state.data.hasError ? 'red' : state.data.skipped ? 'orange' : 'var(--marapp-gray-9)',
  }),
  control: (provided, state) => {
    return {
      ...provided,
      minHeight: '55px',
    };
  },
  menu: () => ({
    display: 'none',
  }),
  dropdownIndicator: () => ({
    display: 'none',
  }),
  indicatorSeparator: () => ({
    display: 'none',
  }),
};

export function EmailInput(props: EmailInputProps) {
  const [creatableRef, setCreatableRef] = useState({} as any);

  const isEmailInList = (email: string): boolean => {
    return (props.value || []).find((x) => x.value === email);
  };

  const appendEmailToList = (email: string): void => {
    if (isEmailInList(email)) {
      return;
    }

    creatableRef.onChange(
      [
        ...creatableRef.state.value,
        {
          label: email,
          value: email,
        },
      ],
      'set-value'
    );

    creatableRef.onInputChange('', 'set-value');
  };

  return (
    <Creatable
      {...props}
      ref={(ref) => setCreatableRef(ref)}
      formatCreateLabel={(value) => `${value}`}
      isValidNewOption={(value) => validEmail(value) && !isEmailInList(value)}
      styles={customStyles}
      theme={(theme) => ({
        ...theme,
        ...SELECT_THEME,
      })}
      onKeyDown={(e) => {
        const email = e.target.value;

        if (e.key === 'Enter' && email === '') {
          e.preventDefault();
        } else if (e.key === ' ' && validEmail(email)) {
          appendEmailToList(email);
        }
      }}
      onBlur={(e) => {
        const email = e.target.value;

        if (email && validEmail(email)) {
          appendEmailToList(email);
        }
      }}
    />
  );
}
