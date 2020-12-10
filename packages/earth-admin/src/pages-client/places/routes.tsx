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
import { RequestQuery } from '@app/services';
import PlacesService from '@app/services/places';
import { setPage } from '@app/utils';
import { useInfiniteList } from '@app/utils/hooks';

import { PlaceDetail } from './details';
import { PlacesHome } from './home';
import { LOCATION_TYPE } from './model';
import { NewPlace } from './new';

const PAGE_TYPE = setPage('Places');
const PAGE_SIZE = 20;

interface IDynamicProps {
  type?: any[];
}

/**
 * Currently the Collection resource is a Place with type === 'Collection'
 * A collection should be handled separately from Places from an UI point of view.
 * Exlude collections from Places admin
 */
const excludeCollectionTypeOption = (filters: IDynamicProps): IDynamicProps => {
  if (filters?.type) {
    filters.type = filters.type.filter((type) => type.value !== LOCATION_TYPE.COLLECTION);
  }

  return filters;
};

export default function PlacesPage(props) {
  const { selectedGroup } = useAuth0();
  const [searchValue, setSearchValue] = useState('');

  const getQueryFn = (cursor: string): { query: RequestQuery; resourceType: string } => {
    const query = {
      search: searchValue,
      filter: ['type', '!=', LOCATION_TYPE.COLLECTION].join(''),
      sort: 'name',
      page: { size: PAGE_SIZE, cursor },
      select: 'name,slug',
      group: selectedGroup,
    };
    return { query, resourceType: 'locations' };
  };

  const { listProps, filters, mutate } = useInfiniteList(getQueryFn, PlacesService.getAllPlaces);

  // Matches everything after the resource name in the url.
  // In our case that's /resource-id or /new
  const selectedItem = props['*'];

  const dynamicOptions = excludeCollectionTypeOption(filters);

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
          selectedItem={selectedItem}
          {...listProps}
        />
      </SidebarLayout>
      <Router>
        <PlacesHome path="/" />
        <NewPlace path="/new" onDataChange={mutate} dynamicOptions={dynamicOptions} />
        <PlaceDetail path="/:page" onDataChange={mutate} dynamicOptions={dynamicOptions} />
      </Router>
    </>
  );
}
