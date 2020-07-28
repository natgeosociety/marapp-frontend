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

import React, {useState} from 'react';


import {OrgSwitcher} from 'components/org-switcher';

import {APP_LOGO, APP_NAME} from '../theme';
import './styles.scss';

interface AdminPage {
  key: string;
  url: string;
  guard?: any;
}

import {AuthzGuards} from 'auth/permissions';
import DropdownComponent from 'components/dropdown';
import {SidebarItem} from 'components/sidebar/sidebar-item';

const ADMIN_PAGES: AdminPage[] = [
  {key: 'Locations', url: '/locations/', guard: AuthzGuards.accessLocationsGuard},
  {key: 'Widgets', url: '/widgets/', guard: AuthzGuards.accessWidgetsGuard},
  {key: 'Layers', url: '/layers/', guard: AuthzGuards.accessLayersGuard},
  {key: 'Dashboards', url: '/dashboards/', guard: AuthzGuards.accessDashboardsGuard},
  {key: 'Users', url: '/users/', guard: AuthzGuards.accessUsersGuard},
  {key: 'Organizations', url: '/organizations/', guard: AuthzGuards.accessOrganizationsGuard},
];

const SidebarLayout = (props: any) => {
  const [dropdownState, setDropdownState] = useState('open');

  const handleDropdownToggle = () => {
    dropdownState === 'close' ? setDropdownState('open') : setDropdownState('close');
  };

  return (
    <div className="ng-sidebar ng-flex ng-flex-column ng-flex-top">
      <nav className="ng-padding-medium-vertical ng-background-dkgray ">
        <div
          className="ng-padding-medium-horizontal ng-ep-background-dark ng-margin-bottom ng-flex ng-flex-middle ng-position-relative">
          <img src={APP_LOGO} alt={APP_NAME} className="ng-margin-remove ng-display-block"/>
          <span className="ng-margin-small-horizontal ng-color-white">|</span>
          <OrgSwitcher/>
        </div>
        <div className="ng-padding-medium ng-form ng-form-dark">
          <div className="ng-position-relative ng-select">
            <div onClick={handleDropdownToggle}
                 className="ng-padding ng-c-cursor-pointer ng-flex ng-select-display-values">
              click here
              <i className="ng-icon-directiondown"/>
            </div>
            <DropdownComponent state={dropdownState} className="ng-select-list">
                {ADMIN_PAGES.map((page, i) => (
                  <SidebarItem item={page} key={i}/>
                ))}
            </DropdownComponent>
          </div>
        </div>
      </nav>
      {props.children}
    </div>
  );
};

export default SidebarLayout;
