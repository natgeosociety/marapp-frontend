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

import * as React from 'react';
import { Router } from '@reach/router';

import { GATSBY_APP_BASE_URL } from 'config';
import { ContentLayout, SidebarLayout } from 'layouts';
import LocationsPage from 'pages-client/locations';
import DashboardsPage from 'pages-client/dashboards';
import LayersPage from 'pages-client/layers';
import WidgetsPage from 'pages-client/widgets';
import UsersPage from 'pages-client/users';
import OrganizationsPage from 'pages-client/organizations';
import Organization from 'pages-client/organization';
import Homepage from 'pages-client/homepage';
import UnauthorizedPage from 'pages-client/unauthorized';
import { ProtectedRoute } from 'components';
import { APP_NAME } from '../theme';

/**
 * All admin pages are client side pages only because the /:org makes them dinamic
 */
export default function IndexPage() {
  return (
    <Router basepath={GATSBY_APP_BASE_URL}>
      <ProtectedRoute path="/" component={Homepage}/>
      <ProtectedRoute path="/:org" component={Organization}>
        <OrgIndex path="/"/>
        <LocationsPage path="/locations/*"/>
        <DashboardsPage path="/dashboards/*"/>
        <LayersPage path="/layers/*"/>
        <WidgetsPage path="/widgets/*"/>
        <UsersPage path="/users/*"/>
        <OrganizationsPage path="/organizations/*"/>
      </ProtectedRoute>
      <UnauthorizedPage path="/unauthorized"/>
    </Router>
  );
}

/**
 * Renders no children
 */
const OrgIndex = ( props ) => (
  <div>
    <SidebarLayout/>
    <ContentLayout permission={true}>
      <div className="ng-background-ultradkgray ng-padding-large">
        <h2 className="ng-text-edit-m">Welcome to the {APP_NAME} Admin!</h2>
        <h6>{props.org}</h6>
      </div>
    </ContentLayout>
  </div>

);
