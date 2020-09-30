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
import { getAllPlaces } from '@app/services/places';
import { encodeQueryToURL, setPage } from '@app/utils';
import { useInfiniteList } from '@app/utils/hooks';

import { PlaceDetail } from './details';
import { PlacesHome } from './home';
import { NewPlace } from './new';

const EXCLUDED_FIELDS = '-geojson,-bbox2d,-centroid';
const PAGE_TYPE = setPage('Places');
const PAGE_SIZE = 20;

export default function PlacesPage(props) {
  const { selectedGroup } = useAuth0();
  const [searchValue, setSearchValue] = useState('');

  const getQuery = (pageIndex) => {
    const query = {
      search: searchValue,
      sort: 'name',
      page: { size: PAGE_SIZE, number: pageIndex },
      select: EXCLUDED_FIELDS,
      group: selectedGroup,
    };
    return encodeQueryToURL('locations', query);
  };
  const { listProps, mutate } = useInfiniteList(getQuery, getAllPlaces);

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
          {...listProps}
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
