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
import { groupBy } from 'lodash';
import React, { useState } from 'react';
import useSWR from 'swr';

import { useAuth0 } from '@app/auth/auth0';
import { DataListing, DefaultListItem } from '@app/components/data-listing';
import { SidebarLayout } from '@app/layouts';
import { getAllWidgets } from '@app/services';
import { encodeQueryToURL, setPage } from '@app/utils';
import { useInfiniteList } from '@app/utils/hooks';

import { WidgetsDetail } from './details';
import { WidgetsHome } from './home';
import { NewWidget } from './new';

const PAGE_TYPE = setPage('Widgets');
const PAGE_SIZE = 20;

export default function DashboardsPage(props) {
  const { selectedGroup } = useAuth0();
  const [searchValue, setSearchValue] = useState('');

  const getQuery = (cursor) => {
    const query = {
      search: searchValue,
      sort: 'name',
      page: { size: PAGE_SIZE, cursor },
      select: 'name,slug',
      group: selectedGroup,
    };
    return encodeQueryToURL('widgets', query);
  };
  const { listProps, mutate } = useInfiniteList(getQuery, getAllWidgets);

  // Fetch filters from /management/widgets api.
  // Can't reuse the above request because it's using search param and
  // it might not return filters
  // TODO: create a custom hook for reuse on multiple pages
  const metricsQuery = {
    select: 'name,slug',
    page: { size: 1, number: 1 },
    group: selectedGroup,
  };
  const { data: groupedFilters } = useSWR(
    encodeQueryToURL('widgets', metricsQuery),
    async (url) => {
      const { filters }: any = await getAllWidgets(url);
      return groupBy(filters, 'key');
    }
  );

  // Matches everything after the resource name in the url.
  // In our case that's /resource-id or /new
  const selectedItem = props['*'];

  return (
    <>
      <SidebarLayout page={PAGE_TYPE}>
        <DataListing
          childComponent={DefaultListItem}
          categoryUrl="widgets"
          pageTitle="widgets"
          searchValueAction={setSearchValue}
          pageSize={PAGE_SIZE}
          searchValue={searchValue}
          selectedItem={selectedItem}
          {...listProps}
        />
      </SidebarLayout>
      <Router>
        <WidgetsHome path="/" />
        <NewWidget path="/new" onDataChange={mutate} groupedFilters={groupedFilters} />
        <WidgetsDetail path="/:page" onDataChange={mutate} groupedFilters={groupedFilters} />
      </Router>
    </>
  );
}
