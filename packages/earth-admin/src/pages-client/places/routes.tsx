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
import { useState } from 'react';
import { Router, } from '@reach/router';
import { useSWRInfinite } from 'swr';

import { encodeQueryToURL, setPage } from 'utils';
import { useAuth0 } from 'auth/auth0';
import { getAllPlaces } from 'services/places';
import { useInfiniteList } from 'utils/hooks';

import { SidebarLayout } from 'layouts';
import { DataListing, DefaultListItem } from 'components/data-listing';
import { PlacesHome } from './home';
import { PlaceDetail } from './details';
import { NewPlace } from './new';

const EXCLUDED_FIELDS = '-geojson,-bbox2d,-centroid';
const PAGE_TYPE = setPage('Places');
const PAGE_SIZE = 20;

export default function PlacesPage() {
  const { selectedGroup } = useAuth0();
  const [searchValue, setSearchValue] = useState('');

  const getQuery = (pageIndex) => {
    // Our api starts with page 1 instead of 0
    const offsetPageIndex = pageIndex + 1;
    const query = {
      search: searchValue,
      sort: 'name',
      page: { size: PAGE_SIZE, number: offsetPageIndex },
      select: EXCLUDED_FIELDS,
      group: selectedGroup,
    };
    return encodeQueryToURL('locations', query);
  }
  const {listData, mutate} = useInfiniteList(getQuery, getAllPlaces);

  return (
    <>
      <SidebarLayout page={PAGE_TYPE}>
        <DataListing
          childComponent={DefaultListItem}
          categoryUrl="places"
          pageTitle="places"
          searchValueAction={setSearchValue}
          pageSize={PAGE_SIZE}
          searchValue={searchValue}
          {...listData}
          // selectedItem={selectedItem}
        />
      </SidebarLayout>
      <Router>
        <PlacesHome path="/" />
        <NewPlace path="/new" onDataChange={mutate} />
        <PlaceDetail path="/:page" onDataChange={mutate} />
      </Router>
    </>
  );
}
