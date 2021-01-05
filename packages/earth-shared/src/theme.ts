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

export const SELECT_THEME = {
  borderRadius: 0,
  colors: {
    primary: 'var(--marapp-primary-color)',
    neutral0: 'var(--marapp-gray-8)',
    neutral10: 'var(--marapp-gray-2)',
    neutral20: 'var(--marapp-gray-2)',
    neutral30: 'var(--marapp-gray-2)',
    neutral50: 'var(--marapp-gray-1)',
    neutral60: 'var(--marapp-gray-1)',
    neutral80: 'var(--marapp-gray-8)',
  },
};

export const CUSTOM_STYLES = {
  valueContainer: (provided, state) => ({
    ...provided,
    boxShadow: 'none',
  }),
  placeholder: () => ({
    color: 'var(--marapp-gray-5)',
    position: 'absolute',
  }),
  input: () => ({
    boxShadow: 'none',
  }),
  container: () => ({
    boxShadow: 'none',
    position: 'relative',
  }),
  menu: () => ({
    border: '1px solid var(--marapp-gray-1)',
    boxShadow: 'none',
    position: 'absolute',
    backgroundColor: 'var(--marapp-gray-8)',
    zIndex: 100,
    left: 0,
    right: 0,
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isFocused ? 'var(--marapp-gray-6)' : 'var(--marapp-gray-8)',
    color: 'var(--marapp-gray-2)',
    padding: 10,
    boxShadow: 'none',
  }),
  control: (provided, state) => ({
    ...provided,
    padding: 10,
    boxShadow: 'none',
  }),
  multiValue: (provided, state) => ({
    ...provided,
    borderRadius: '50px',
    display: 'flex',
    '.dropdown-item-subtitle': {
      display: 'none',
    },
  }),
  multiValueRemove: () => ({
    color: 'var(--marapp-gray-9)',
    padding: '0px 10px',
  }),
  singleValue: (provided, state) => ({
    ...provided,
    boxShadow: 'none',
    color: 'var(---marapp-gray-2)',
  }),
  clearIndicator: () => ({
    color: 'var(--marapp-gray-2)',
  }),
  dropdownIndicator: () => ({
    color: 'var(--marapp-gray-2)',
  }),
};
