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
import { useEffect, useState } from 'react';
import { Router } from '@reach/router';

import { DashboardContext } from 'utils/contexts';
import { encodeQueryToURL, setPage } from 'utils';
import { useRequest } from 'utils/hooks';

import { getAllDashboards, getDashboard } from 'services/dashboards';
import { ContentLayout, SidebarLayout } from 'layouts';
import { DashboardList, DashboardDetails, DashboardEdit } from 'components/dashboards';
import { LinkWithOrg } from 'components/link-with-org';
import { AuthzGuards } from 'auth/permissions';
import { useAuth0 } from 'auth/auth0';

const EXCLUDED_FIELDS = '-geojson,-bbox2d,-centroid';

const DASHBOARD_DETAIL_QUERY = {
  include: 'layers,widgets',
  select: 'layers.id,layers.name,layers.type,widgets.id,widgets.name,widgets.type',
  sort: 'layers.name,widgets.name',
};

export function DetailsPage(path: any) {
  const {selectedGroup} = useAuth0();
  const encodedQuery = encodeQueryToURL(`dashboards/${path.page}`, {
    ...DASHBOARD_DETAIL_QUERY,
    ...{group: selectedGroup},
  });
  const {isLoading, errors, data} = useRequest(() => getDashboard(encodedQuery), {
    permissions: AuthzGuards.accessDashboardsGuard,
    query: encodedQuery,
  });

  return (
    <ContentLayout errors={errors} backTo="/dashboards" isLoading={isLoading}>
      <DashboardDetails data={data}/>
    </ContentLayout>
  );
}

export function EditPage(path: any) {
  const {selectedGroup} = useAuth0();
  const encodedQuery = encodeQueryToURL(`dashboards/${path.page}`, {
    ...DASHBOARD_DETAIL_QUERY,
    ...{group: selectedGroup},
  });
  const {isLoading, errors, data} = useRequest(() => getDashboard(encodedQuery), {
    permissions: AuthzGuards.writeDashboardsGuard,
    skip: path.newDashboard,
  });

  return (
    <ContentLayout errors={errors} backTo="/dashboards" isLoading={isLoading}>
      <DashboardEdit data={data} newDashboard={path.newDashboard}/>
    </ContentLayout>
  );
}
