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

import { Router } from '@reach/router';
import { navigate } from 'gatsby';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { useAuth0 } from '@app/auth/auth0';
import { ProtectedRoute } from '@app/components/protected-route';
import { GATSBY_APP_BASE_URL } from '@app/config';
import NotFound from '@app/pages-client/404';
import DashboardsPage from '@app/pages-client/dashboards/routes';
import Homepage from '@app/pages-client/homepage';
import LayersPage from '@app/pages-client/layers/routes';
import Organization from '@app/pages-client/organization';
import OrganizationsPage from '@app/pages-client/organizations/routes';
import PlacesPage from '@app/pages-client/places/routes';
import UnauthorizedPage from '@app/pages-client/unauthorized';
import UsersPage from '@app/pages-client/users/routes';
import WidgetsPage from '@app/pages-client/widgets/routes';

/**
 * All admin pages are client side pages only because the /:org makes them dinamic
 */
export default function IndexPage() {
  return (
    <Router basepath={GATSBY_APP_BASE_URL}>
      <ProtectedRoute exact={true} path="/" component={RedirectToOrgHomepage} />
      <ProtectedRoute exact={true} path="/:org" component={Organization}>
        <Homepage exact={true} path="/" />
        <PlacesPage exact={true} path="/places/*" />
        <DashboardsPage exact={true} path="/dashboards/*" />
        <LayersPage exact={true} path="/layers/*" />
        <WidgetsPage exact={true} path="/widgets/*" />
        <UsersPage exact={true} path="/users/*" />
        <OrganizationsPage exact={true} path="/organizations/*" />
        <NotFound default={true} />
      </ProtectedRoute>
      <UnauthorizedPage exact={true} path="/unauthorized" />
    </Router>
  );
}

/**
 * Just redirect to the default selectedGroup. (set in auth0.tsx)
 */
const RedirectToOrgHomepage = () => {
  const { selectedGroup } = useAuth0();
  const { t } = useTranslation('admin');

  useEffect(() => {
    selectedGroup && navigate(`/${selectedGroup}`, { replace: true });
  }, [selectedGroup]);
  return <div>{t('This is homepage - should be redirected to /:org')}</div>;
};
