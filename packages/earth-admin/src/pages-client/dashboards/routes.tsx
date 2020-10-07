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
import React, { useState } from 'react';

import { useAuth0 } from '@app/auth/auth0';
import { DataListing, DefaultListItem } from '@app/components/data-listing';
import { SidebarLayout } from '@app/layouts';
import { getAllDashboards } from '@app/services';
import { encodeQueryToURL, setPage } from '@app/utils';
import { useInfiniteList } from '@app/utils/hooks';

import { DashboardDetail } from './details';
import { DashboardsHome } from './home';
import { NewDashboard } from './new';

const PAGE_TYPE = setPage('Dashboards');
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
    return encodeQueryToURL('dashboards', query);
  };
  const { listProps, mutate } = useInfiniteList(getQuery, getAllDashboards);

  return (
    <>
      <SidebarLayout page={PAGE_TYPE}>
        <DataListing
          childComponent={DefaultListItem}
          categoryUrl="dashboards"
          pageTitle="dashboards"
          searchValueAction={setSearchValue}
          pageSize={PAGE_SIZE}
          searchValue={searchValue}
          {...listProps}
        />
      </SidebarLayout>
      <Router>
        <DashboardsHome path="/" />
        <NewDashboard path="/new" onDataChange={mutate} />
        <DashboardDetail path="/:page" onDataChange={mutate} />
      </Router>
    </>
  );
}
