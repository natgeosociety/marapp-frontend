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

import React, { ReactNode, useEffect, useState } from 'react';
import Creatable from 'react-select/creatable';

import { CUSTOM_STYLES, SELECT_THEME } from '../../theme';

export interface EmailInputProps {
  // creatable?
}

const customStylesOwners = {
  ...CUSTOM_STYLES,
  multiValueLabel: (provided, state) => {
    return {
      ...provided,
      color: state.data.hasError ? 'red' : 'var(--marapp-gray-9)',
      borderRadius: '50px',
      display: 'flex',
    };
  },
  multiValueRemove: (provided, state) => ({
    ...provided,
    color: state.data.hasError ? 'red' : 'var(--marapp-gray-9)',
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
  return (
    <Creatable
      {...props}
      styles={customStylesOwners}
      theme={(theme) => ({
        ...theme,
        ...SELECT_THEME,
      })}
    />
  );
}
