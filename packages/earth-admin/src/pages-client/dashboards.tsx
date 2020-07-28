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
import {useEffect, useState} from 'react';
import {Router} from '@reach/router';

import {DashboardContext} from 'utils/contexts';
import {encodeQueryToURL} from 'utils';
import {getAllDashboards, getDashboard} from 'services/dashboards';
import {useRequest} from 'utils/hooks';

import {ContentLayout, SidebarLayout} from 'layouts';
import {DashboardList, DashboardDetails, DashboardEdit, LocationList} from 'components';
import {LinkWithOrg} from 'components/link-with-org';
import {AuthzGuards} from '../auth/permissions';
import {useAuth0} from '../auth/auth0';

const EXCLUDED_FIELDS = '-geojson,-bbox2d,-centroid';

const DASHBOARD_DETAIL_QUERY = {
  include: 'layers,widgets',
  select: 'layers.id,layers.name,layers.type,widgets.id,widgets.name,widgets.type',
  sort: 'layers.name,widgets.name',
};
const INIT_CURSOR_LOCATION = '-1';

export default function DashboardsPage(props) {
  return (
    <Router>
      <Page path="/"/>
      <DetailsPage path="/:page"/>
      <EditPage path="/:page/edit" newDashboard={false}/>
      <EditPage path="/new" newDashboard={true}/>
    </Router>
  );
}

function DashboardsWrapper(props: any) {
  const [dashboards, setDashboards] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [pageSize, setPageSize] = useState(20);
  const [pageCursor, setPageCursor] = useState('-1');
  const [nextCursor, setNextCursor] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [totalResults, setTotalResults] = useState(null);

  const {selectedGroup, getPermissions} = useAuth0();

  const permissions = getPermissions(AuthzGuards.accessDashboardsGuard);

  const handleSearchValueChange = (newValue: string) => {
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

      const dataReset = !!props.path.location.state && !!props.path.location.state.refresh;
      const query = {
        search: searchValue,
        sort: 'name',
        page: {size: pageSize, cursor: dataReset ? INIT_CURSOR_LOCATION : pageCursor},
        select: EXCLUDED_FIELDS,
        group: selectedGroup,
      };
      const encodedQuery = encodeQueryToURL('dashboards', query);
      const res: any = await getAllDashboards(encodedQuery);

      if (dataReset) {
        props.path.location.state.refresh = false;
      }

      setTotalResults(res.total);

      setDashboards(!nextCursor || dataReset ? res.data : [...dashboards, ...res.data]);
      setNextCursor(res.pagination.nextCursor ? res.pagination.nextCursor : null);


      setIsLoading(false);
    }

    permissions && setupDashboards();
  }, [props.path.location, pageCursor, searchValue]);

  return (
    <DashboardContext.Provider
      value={{
        handleSearchValueChange,
        handleCursorChange,
        isLoading,
        dashboards,
        nextCursor,
        totalResults,
        pageSize,
        searchValue,
      }}
    >
      <SidebarLayout>
        <DashboardList/>
      </SidebarLayout>
      {props.children}
    </DashboardContext.Provider>
  );
}

function Page(path: any) {
  const {getPermissions} = useAuth0();
  const permissions = getPermissions(AuthzGuards.accessDashboardsGuard);
  const writePermissions = getPermissions(AuthzGuards.writeDashboardsGuard);

  return (
    <DashboardsWrapper path={path}>
      <ContentLayout permission={permissions}>
        {writePermissions && (
          <div className="ng-flex ng-align-right">
            <LinkWithOrg className="ng-button ng-button-overlay" to={`/dashboards/new`}>
              Add new dashboard
            </LinkWithOrg>
          </div>
        )}
      </ContentLayout>
    </DashboardsWrapper>
  );
}

function DetailsPage(path: any) {
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
    <DashboardsWrapper path={path}>
      <ContentLayout errors={errors} backTo="/dashboards" isLoading={isLoading}>
        <DashboardDetails data={data}/>
      </ContentLayout>
    </DashboardsWrapper>

  );
}

function EditPage(path: any) {
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
    <DashboardsWrapper path={path}>
      <ContentLayout errors={errors} backTo="/dashboards" isLoading={isLoading}>
        <DashboardEdit data={data} newDashboard={path.newDashboard}/>
      </ContentLayout>
    </DashboardsWrapper>

  );
}
