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

import classnames from 'classnames';
import { noop } from 'lodash';
import React from 'react';

import './styles.scss';

interface ISearchbox {
  value: string;
  placeholder: string;
  onChange: (e: any) => void;
  onReset: () => void;
  onFocus?: () => void;

  setIndexesSelected?: (value: any) => {};
  setPlace?: (value: any) => {};
  setMapBounds?: (value: any) => {};
  resetMap?: () => {};
  resetLayers?: () => {};
  resetPlace?: () => {};
  search?: any;
  open?: boolean;
  showClose?: any;
}

const SearchBox = (props: ISearchbox) => {
  const { value, placeholder, onChange = noop, onReset = noop, onFocus = noop, showClose } = props;

  const searchBoxClasses = classnames(
    'ng-c-input-container',
    'ng-background-ultradkgray',
    'ng-background-ultradkgray',
    'ng-padding-vertical',
    'ng-c-flex-grow-1',
    'ng-flex',
    'ng-flex-middle',
    {
      'is-focused': true, // make this conditional
    }
  );

  return (
    <div className="marapp-qa-searchbox ng-padding-medium ng-ep-background-dark ng-padding-top-remove">
      <div className={searchBoxClasses}>
        <i className="ng-icon ng-icon-small ng-icon-search ng-color-mdgray ng-margin-small-horizontal" />
        <input
          type="text"
          placeholder={placeholder}
          className="marapp-qa-searchboxinput ng-width-1-1 ng-search-box"
          value={value}
          onChange={onChange}
          onFocus={onFocus}
        />
        {showClose && (
          <div className="marapp-qa-searchboxclear ng-c-cursor-pointer" onClick={onReset}>
            <i className="ng-color-mdgray ng-margin-small-right ng-icon-small ng-icon-close ng-display-block" />
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBox;
