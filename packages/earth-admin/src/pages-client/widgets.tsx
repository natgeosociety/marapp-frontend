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

import { WidgetContext } from 'utils/contexts';
import { encodeQueryToURL, setPage } from 'utils';
import { getAllWidgets, getWidget } from 'services/widgets';
import { useRequest } from 'utils/hooks';

import { WidgetList, WidgetDetails, WidgetEdit, LinkWithOrg } from 'components';
import { useAuth0 } from 'auth/auth0';
import { AuthzGuards } from 'auth/permissions';
import { SidebarLayout, ContentLayout } from 'layouts';


const EXCLUDED_FIELDS = '-geojson,-bbox2d,-centroid';
const WIDGET_DETAIL_QUERY = {
  include: 'layers',
  select: 'layers.id,layers.name,layers.type',
  sort: 'layers.name',
};
const INIT_CURSOR_LOCATION = '-1';

const PAGE_TYPE = setPage('Widgets');

export default function WidgetsPage( props ) {
  return (
    <Router>
      <Page path="/"/>
      <DetailsPage path="/:page"/>
      <EditPage path="/:page/edit" newWidget={false}/>
      <EditPage path="/new" newWidget={true}/>
    </Router>
  );
}

function WidgetsWrapper( props: any ) {
  const { path } = props;
  const [widgets, setWidgets] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [pageSize, setPageSize] = useState(20);
  const [pageCursor, setPageCursor] = useState('-1');
  const [nextCursor, setNextCursor] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [totalResults, setTotalResults] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  const { selectedGroup, getPermissions } = useAuth0();

  const permissions = getPermissions(AuthzGuards.accessWidgetsGuard);


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
    async function setupWidgets() {
      setIsLoading(true);

      const dataReset = !!path.location.state && !!path.location.state.refresh;
      const query = {
        search: searchValue,
        sort: 'name',
        page: { size: pageSize, cursor: dataReset ? INIT_CURSOR_LOCATION : pageCursor },
        select: EXCLUDED_FIELDS,
        group: selectedGroup,
      };
      const encodedQuery = encodeQueryToURL('widgets', query);
      const res: any = await getAllWidgets(encodedQuery);

      if (dataReset) {
        path.location.state.refresh = false;
      }

      setTotalResults(res.total);

      setWidgets(!nextCursor || dataReset ? res.data : [...widgets, ...res.data]);
      setNextCursor(res.pagination.nextCursor ? res.pagination.nextCursor : null);
      setSelectedItem(props.path.page);
      setIsLoading(false);
    }

    permissions && setupWidgets();
  }, [props.path.location, pageCursor, searchValue]);

  return (
    <WidgetContext.Provider
      value={{
        handleSearchValueChange,
        handleCursorChange,
        isLoading,
        widgets,
        nextCursor,
        totalResults,
        pageSize,
        searchValue,
        selectedItem,
      }}
    >
      <SidebarLayout page={PAGE_TYPE}>
        <WidgetList/>
      </SidebarLayout>
    </WidgetContext.Provider>
  );
}

function Page( path: any ) {

  const { selectedGroup, getPermissions } = useAuth0();

  const permissions = getPermissions(AuthzGuards.accessWidgetsGuard);
  const writePermissions = getPermissions(AuthzGuards.writeWidgetsGuard);

  return (
    <WidgetsWrapper path={path}>
      <ContentLayout permission={permissions}>
        {writePermissions && (
          <div className="ng-flex ng-align-right">
            <LinkWithOrg className="ng-button ng-button-overlay" to={`/widgets/new`}>
              Add new widget
            </LinkWithOrg>
          </div>
        )}
      </ContentLayout>
    </WidgetsWrapper>
  );
}

function DetailsPage( path: any ) {
  const { selectedGroup } = useAuth0();
  const encodedQuery = encodeQueryToURL(`widgets/${path.page}`, {
    ...WIDGET_DETAIL_QUERY,
    ...{ group: selectedGroup },
  });
  const { isLoading, errors, data } = useRequest(() => getWidget(encodedQuery), {
    permissions: AuthzGuards.accessWidgetsGuard,
    query: encodedQuery,
  });

  return (
    <WidgetsWrapper path={path}>
      <ContentLayout errors={errors} backTo="/widgets" isLoading={isLoading}>
        <WidgetDetails data={data}/>
      </ContentLayout>
    </WidgetsWrapper>
  );
}

function EditPage( path: any ) {
  const { selectedGroup } = useAuth0();
  const encodedQuery = encodeQueryToURL(`widgets/${path.page}`, {
    ...WIDGET_DETAIL_QUERY,
    group: selectedGroup,
  });
  const { isLoading, errors, data } = useRequest(() => getWidget(encodedQuery), {
    permissions: AuthzGuards.writeWidgetsGuard,
    skip: path.newWidget,
  });

  return (
    <WidgetsWrapper path={path}>
      <ContentLayout errors={errors} backTo="/widgets" isLoading={isLoading}>
        <WidgetEdit data={data} newWidget={path.newWidget}/>
      </ContentLayout>
    </WidgetsWrapper>

  );
}
