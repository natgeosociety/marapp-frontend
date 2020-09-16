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
import React, { useEffect, useState } from 'react';

import { AuthzGuards } from '@marapp/earth-shared';

import { useAuth0 } from '@app/auth/auth0';
import { LinkWithOrg } from '@app/components/link-with-org';
import { WidgetDetails, WidgetEdit, WidgetList } from '@app/components/widgets';
import { ContentLayout, SidebarLayout } from '@app/layouts';
import { getAllWidgets, getWidget } from '@app/services/widgets';
import { encodeQueryToURL, setPage } from '@app/utils';
import { WidgetContext } from '@app/utils/contexts';
import { useRequest } from '@app/utils/hooks';

const EXCLUDED_FIELDS = '-geojson,-bbox2d,-centroid';
const WIDGET_DETAIL_QUERY = {
  include: 'layers',
  select: 'layers.id,layers.name,layers.type',
  sort: 'layers.name',
};
const INIT_CURSOR_LOCATION = '-1';

const PAGE_TYPE = setPage('Widgets');

export default function WidgetsPage(props) {
  return (
    <Router>
      <Page path="/">
        <HomePage path="/" />
        <DetailsPage path="/:page" />
        <EditPage path="/:page/edit" newWidget={false} />
        <EditPage path="/new" newWidget={true} />
      </Page>
    </Router>
  );
}

function Sidebar(props: any) {
  const [widgets, setWidgets] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [pageSize, setPageSize] = useState(20);
  const [pageCursor, setPageCursor] = useState('-1');
  const [nextCursor, setNextCursor] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isNoMore, setIsNoMore] = useState(null);
  const [totalResults, setTotalResults] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  const { selectedGroup, getPermissions } = useAuth0();

  const permissions = getPermissions(AuthzGuards.accessWidgetsGuard);

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
    async function setupWidgets() {
      setIsLoading(true);

      const query = {
        search: searchValue,
        sort: 'name',
        page: { size: pageSize, cursor: pageCursor },
        select: EXCLUDED_FIELDS,
        group: selectedGroup,
      };
      const encodedQuery = encodeQueryToURL('widgets', query);
      const res: any = await getAllWidgets(encodedQuery);

      setTotalResults(res.total);

      setWidgets(!nextCursor ? res.data : [...widgets, ...res.data]);
      setNextCursor(res.pagination.nextCursor ? res.pagination.nextCursor : null);
      setIsNoMore(!res.pagination.nextCursor);
      setIsLoading(false);
    }

    permissions && setupWidgets();
  }, [pageCursor, searchValue]);

  return (
    <WidgetContext.Provider
      value={{
        handleSearchValueChange,
        handleCursorChange,
        isLoading,
        isNoMore,
        widgets,
        nextCursor,
        totalResults,
        pageSize,
        searchValue,
        selectedItem,
      }}
    >
      <SidebarLayout page={PAGE_TYPE}>
        <WidgetList />
      </SidebarLayout>
    </WidgetContext.Provider>
  );
}

function Page(props: any) {
  return (
    <>
      <Sidebar />
      {props.children}
    </>
  );
}

function HomePage(props: any) {
  const { getPermissions } = useAuth0();
  const permissions = getPermissions(AuthzGuards.accessWidgetsGuard);
  const writePermissions = getPermissions(AuthzGuards.writeWidgetsGuard);
  return (
    writePermissions && (
      <ContentLayout>
        <div className="ng-flex ng-align-right">
          <LinkWithOrg className="ng-button ng-button-overlay" to="/widgets/new">
            add new widget
          </LinkWithOrg>
        </div>
      </ContentLayout>
    )
  );
}

function DetailsPage(path: any) {
  const { selectedGroup } = useAuth0();
  const encodedQuery = encodeQueryToURL(`widgets/${path.page}`, {
    ...WIDGET_DETAIL_QUERY,
    ...{ group: selectedGroup },
  });
  const { isLoading, errors, data } = useRequest(() => getWidget(encodedQuery), {
    query: encodedQuery,
  });

  return (
    <ContentLayout errors={errors} backTo="/widgets" isLoading={isLoading}>
      <WidgetDetails data={data} />
    </ContentLayout>
  );
}

function EditPage(path: any) {
  const { selectedGroup } = useAuth0();
  const encodedQuery = encodeQueryToURL(`widgets/${path.page}`, {
    ...WIDGET_DETAIL_QUERY,
    group: selectedGroup,
  });
  const { isLoading, errors, data } = useRequest(() => getWidget(encodedQuery), {
    skip: path.newWidget,
  });

  return (
    <ContentLayout errors={errors} backTo="/widgets" isLoading={isLoading}>
      <WidgetEdit data={data} newWidget={path.newWidget} />
    </ContentLayout>
  );
}
