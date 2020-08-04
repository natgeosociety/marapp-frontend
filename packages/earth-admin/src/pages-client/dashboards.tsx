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
import { DashboardList, DashboardDetails, DashboardEdit, LinkWithOrg } from 'components';
import { AuthzGuards } from 'auth/permissions';
import { useAuth0 } from 'auth/auth0';

const EXCLUDED_FIELDS = '-geojson,-bbox2d,-centroid';

const DASHBOARD_DETAIL_QUERY = {
  include: 'layers,widgets',
  select: 'layers.id,layers.name,layers.type,widgets.id,widgets.name,widgets.type',
  sort: 'layers.name,widgets.name',
};
const INIT_CURSOR_LOCATION = '-1';

const PAGE_TYPE = setPage('Data Indexes');

export default function DashboardsPage( props ) {
  return (
    <Router>
      <Page path="/">
        <HomePage path="/"/>
        <DetailsPage path="/:page"/>
        <EditPage path="/:page/edit" newDashboard={false}/>
        <EditPage path="/new" newLocation={true}/>
      </Page>
    </Router>
  );
}

function Sidebar( props: any ) {
  const [dashboards, setDashboards] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [pageSize, setPageSize] = useState(20);
  const [pageCursor, setPageCursor] = useState('-1');
  const [nextCursor, setNextCursor] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isNoMore, setIsNoMore] = useState(null);
  const [totalResults, setTotalResults] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  const { selectedGroup, getPermissions } = useAuth0();

  const permissions = getPermissions(AuthzGuards.accessDashboardsGuard);

  const handleSearchValueChange = ( newValue: string ) => {
    setPageCursor('-1');
    setNextCursor(null);
    setSearchValue(newValue);
  };

  const handleCursorChange = () => {
    if (nextCursor) {
      setPageCursor(nextCursor);
    }
  };

  useEffect(() => {
    async function setupDashboards() {
      setIsLoading(true);

      const query = {
        search: searchValue,
        sort: 'name',
        page: { size: pageSize, cursor: pageCursor },
        select: EXCLUDED_FIELDS,
        group: selectedGroup,
      };
      const encodedQuery = encodeQueryToURL('dashboards', query);
      const res: any = await getAllDashboards(encodedQuery);


      setTotalResults(res.total);

      setDashboards(!nextCursor ? res.data : [...dashboards, ...res.data]);
      setNextCursor(res.pagination.nextCursor ? res.pagination.nextCursor : null);
      setIsNoMore(!res.pagination.nextCursor);

      setIsLoading(false);
    }

    permissions && setupDashboards();
  }, [pageCursor, searchValue]);

  return (
    <DashboardContext.Provider
      value={{
        handleSearchValueChange,
        handleCursorChange,
        isLoading,
        isNoMore,
        dashboards,
        nextCursor,
        totalResults,
        pageSize,
        searchValue,
        selectedItem,
      }}
    >
      <SidebarLayout page={PAGE_TYPE}>
        <DashboardList/>
      </SidebarLayout>
    </DashboardContext.Provider>
  );
}

function Page( props: any ) {
  return (
    <>
      <Sidebar/>
      {props.children}
    </>);
}


function HomePage( props: any ) {
  const { getPermissions } = useAuth0();
  const permissions = getPermissions(AuthzGuards.accessDashboardsGuard);
  const writePermissions = getPermissions(AuthzGuards.writeDashboardsGuard);
  return (writePermissions && (
    <ContentLayout>
      <div className="ng-flex ng-align-right">
        <LinkWithOrg className="ng-button ng-button-overlay" to="/dashboards/new">
          add new dashboard
        </LinkWithOrg>
      </div>
    </ContentLayout>
  ));
}

function DetailsPage( path: any ) {
  const { selectedGroup } = useAuth0();
  const encodedQuery = encodeQueryToURL(`dashboards/${path.page}`, {
    ...DASHBOARD_DETAIL_QUERY,
    ...{ group: selectedGroup },
  });
  const { isLoading, errors, data } = useRequest(() => getDashboard(encodedQuery), {
    permissions: AuthzGuards.accessDashboardsGuard,
    query: encodedQuery,
  });

  return (
    <ContentLayout errors={errors} backTo="/dashboards" isLoading={isLoading}>
      <DashboardDetails data={data}/>
    </ContentLayout>
  );
}

function EditPage( path: any ) {
  const { selectedGroup } = useAuth0();
  const encodedQuery = encodeQueryToURL(`dashboards/${path.page}`, {
    ...DASHBOARD_DETAIL_QUERY,
    ...{ group: selectedGroup },
  });
  const { isLoading, errors, data } = useRequest(() => getDashboard(encodedQuery), {
    permissions: AuthzGuards.writeDashboardsGuard,
    skip: path.newDashboard,
  });

  return (
    <ContentLayout errors={errors} backTo="/dashboards" isLoading={isLoading}>
      <DashboardEdit data={data} newDashboard={path.newDashboard}/>
    </ContentLayout>
  );
}
