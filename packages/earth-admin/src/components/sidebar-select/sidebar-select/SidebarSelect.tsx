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
import { DropdownComponent } from 'components/dropdown';
import { SidebarItem } from 'components/sidebar-select';
import React, { useState } from 'react';
import { useDomWatcher } from 'utils/hooks';

import { ADMIN_PAGES, IAdminPage } from '../model';

import './styles.scss';

interface IProps {
  path?: IAdminPage[];
}

const SidebarSelect = (props: IProps) => {
  const selectRef = React.useRef(null);

  const [dropdownState, setDropdownState] = useState('close');
  const currentPage = !!props.path ? props.path[0].key : 'Choose a page';

  const handleDropdownToggle = () => {
    dropdownState === 'close' ? setDropdownState('open') : setDropdownState('close');
  };

  const handleClickOutside = () => {
    setDropdownState('close');
  };

  useDomWatcher(selectRef, handleClickOutside, dropdownState === 'close');

  return (
    <div className="marapp-qa-sidebarselect ng-padding-medium-horizontal ng-form ng-form-dark">
      <div className="ng-position-relative ng-select" ref={selectRef}>
        <div
          onClick={handleDropdownToggle}
          className="marapp-qa-actiontoggle ng-padding ng-c-cursor-pointer ng-flex ng-select-display-values"
        >
          {currentPage || 'Choose a page'}
          <i
            className={classnames({
              'ng-icon-directiondown': dropdownState === 'close',
              'ng-icon-directionup': dropdownState === 'open',
            })}
          />
        </div>
        <DropdownComponent state={dropdownState} className="ng-select-list">
          {ADMIN_PAGES.map((page, i) => (
            <SidebarItem item={page} key={i} selected={currentPage === page.key} />
          ))}
        </DropdownComponent>
      </div>
    </div>
  );
};

export default SidebarSelect;
