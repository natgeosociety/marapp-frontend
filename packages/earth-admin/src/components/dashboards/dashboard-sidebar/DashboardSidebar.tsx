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

import React, { useEffect, useState } from 'react';

import { AuthzGuards } from '@marapp/earth-shared';

import { useAuth0 } from '@app/auth/auth0';
import { DataListing, DefaultListItem } from '@app/components/data-listing';
import { SidebarLayout } from '@app/layouts';
import { getAllDashboards } from '@app/services';
import { encodeQueryToURL, setPage } from '@app/utils';
import { DashboardContext } from '@app/utils/contexts';

const PAGE_TYPE = setPage('Dashboards');
const EXCLUDED_FIELDS = '-geojson,-bbox2d,-centroid';

export default function DashboardSidebar(props: any) {
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
        <DataListing
          childComponent={DefaultListItem}
          data={dashboards}
          categoryUrl={'dashboards'}
          pageTitle="dashboards"
          searchValueAction={handleSearchValueChange}
          cursorAction={handleCursorChange}
          isLoading={isLoading}
          isNoMore={isNoMore}
          totalResults={totalResults}
          pageSize={pageSize}
          searchValue={searchValue}
          selectedItem={selectedItem}
        />
      </SidebarLayout>
    </DashboardContext.Provider>
  );
}
