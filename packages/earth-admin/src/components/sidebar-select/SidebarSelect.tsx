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

import React, { useState} from 'react';

import DropdownComponent from 'components/dropdown/Dropdown';
import {SidebarItem} from 'components/sidebar-select/sidebar-item';
import {ADMIN_PAGES} from 'components/sidebar-select/model';

export default function SidebarSelect(props) {
  const [dropdownState, setDropdownState] = useState('close');
  const [currentPage] = props.path;

  const handleDropdownToggle = () => {
    dropdownState === 'close' ? setDropdownState('open') : setDropdownState('close');
  };

  return (
    <div className="ng-padding-medium-horizontal ng-form ng-form-dark">
      <div className="ng-position-relative ng-select">
        <div onClick={handleDropdownToggle}
             className="ng-padding ng-c-cursor-pointer ng-flex ng-select-display-values">
          {currentPage.key}
          <i className="ng-icon-directiondown"/>
        </div>
        <DropdownComponent state={dropdownState} className="ng-select-list">
          {ADMIN_PAGES.map((page, i) => (
            <SidebarItem item={page} key={i} selected={currentPage.key === page.key}/>
          ))}
        </DropdownComponent>
      </div>
    </div>
  );

}
