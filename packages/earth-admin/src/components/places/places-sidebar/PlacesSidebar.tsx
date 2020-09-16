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
import { getAllPlaces } from '@app/services/places';
import { encodeQueryToURL, setPage } from '@app/utils';
import { PlaceContext } from '@app/utils/contexts';

const EXCLUDED_FIELDS = '-geojson,-bbox2d,-centroid';
const PAGE_TYPE = setPage('Places');
const INIT_CURSOR_PLACE = '-1';

export default function PlacesSidebar(props: any) {
  const [places, setPlaces] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [pageSize, setPageSize] = useState(20);
  const [pageCursor, setPageCursor] = useState(INIT_CURSOR_PLACE);
  const [nextCursor, setNextCursor] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const [isNoMore, setIsNoMore] = useState(null);
  const [totalResults, setTotalResults] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  const { selectedGroup, getPermissions } = useAuth0();

  const permissions = getPermissions(AuthzGuards.accessPlacesGuard);

  const handleSearchValueChange = (newValue: string) => {
    setPageCursor(INIT_CURSOR_PLACE);
    setNextCursor(null);
    setSearchValue(newValue);
  };

  const handleCursorChange = (): void => {
    if (nextCursor) {
      setPageCursor(nextCursor);
    }
  };

  useEffect(() => {
    async function setupPlaces() {
      setIsLoading(true);

      const query = {
        search: searchValue,
        sort: 'name',
        page: { size: pageSize, cursor: pageCursor },
        select: EXCLUDED_FIELDS,
        group: selectedGroup,
      };
      const encodedQuery = encodeQueryToURL('locations', query);
      const res: any = await getAllPlaces(encodedQuery);

      setTotalResults(res.total);
      setPlaces(!nextCursor ? res.data : [...places, ...res.data]);
      setNextCursor(res.pagination.nextCursor ? res.pagination.nextCursor : null);
      setIsNoMore(!res.pagination.nextCursor);

      setIsLoading(false);
    }

    permissions && setupPlaces();
  }, [pageCursor, searchValue]);

  return (
    <PlaceContext.Provider
      value={{
        handleSearchValueChange,
        handleCursorChange,
        isLoading,
        isNoMore,
        places,
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
          data={places}
          categoryUrl={'places'}
          pageTitle="places"
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
    </PlaceContext.Provider>
  );
}
