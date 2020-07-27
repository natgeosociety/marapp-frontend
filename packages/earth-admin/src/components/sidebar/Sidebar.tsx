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
import { Auth0Context } from 'utils/contexts';
import './styles.scss';

import { OrgSwitcher } from 'components/org-switcher';
import {Select} from '@marapp/earth-components';

import { APP_LOGO, APP_NAME } from '../../theme';

interface AdminPage {
  value: string;
  url: string;
  guard?: any;
}

import { AuthzGuards } from 'auth/permissions';
import { SidebarItem } from './sidebar-item';
import { LinkWithOrg } from 'components/link-with-org';

const ADMIN_PAGES: AdminPage[] = [
  { value: 'Locations', url: '/locations/', guard: AuthzGuards.accessLocationsGuard },
  { value: 'Widgets', url: '/widgets/', guard: AuthzGuards.accessWidgetsGuard },
  { value: 'Layers', url: '/layers/', guard: AuthzGuards.accessLayersGuard },
  { value: 'Dashboards', url: '/dashboards/', guard: AuthzGuards.accessDashboardsGuard },
  { value: 'Users', url: '/users/', guard: AuthzGuards.accessUsersGuard },
  { value: 'Organizations', url: '/organizations/', guard: AuthzGuards.accessOrganizationsGuard },
];

export default function Sidebar(props:any) {
  const handlePageChange = (e) => {
    console.log('clckci', e);

  }
  return (
    <div className="ng-sidebar ng-flex ng-flex-column ng-flex-space-between">
      <nav className="ng-padding-medium-vertical ng-background-dkgray ">
        <div
          className="ng-padding-medium-horizontal ng-ep-background-dark
        ng-margin-bottom
        ng-flex ng-flex-middle ng-position-relative"
        >
          <img src={APP_LOGO} alt={APP_NAME} className="ng-margin-remove ng-display-block" />
          <span className="ng-margin-small-horizontal ng-color-white">|</span>
          <OrgSwitcher />
        </div>
        <Select options={ADMIN_PAGES} onChange={handlePageChange}/>
      </nav>
      {props.children}
      <Auth0Context.Consumer>
        {({ logout }) => (
          <div className="ng-padding-medium">
            <button className="ng-button ng-button-blank" onClick={() => logout()}>
              <i className="ng-icon-user ng-icon-large ng-color-ltgray ng-display-block"/>
              <span className="ng-color-ltgray ng-display-block">LOG OUT</span>
            </button>
          </div>
        )}
      </Auth0Context.Consumer>
    </div>
  );
}
