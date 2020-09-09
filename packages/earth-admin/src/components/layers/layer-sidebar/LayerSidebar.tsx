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
import { useState, useEffect } from 'react';

import { useAuth0 } from 'auth/auth0';
import { AuthzGuards } from 'auth/permissions';
import { LayerContext, PlaceContext } from 'utils/contexts';
import { encodeQueryToURL, setPage } from 'utils';
import { getAllPlaces } from 'services/places';

import { SidebarLayout } from 'layouts';
import { DataListing, DefaultListItem } from 'components/data-listing';
import { getAllLayers } from 'services';


const LAYER_DETAIL_QUERY = { include: 'references', select: 'references.name,references.id' };
const INIT_CURSOR_LOCATION = '-1';

const PAGE_TYPE = setPage('Layers');


export default function LayerSidebar(props: any) {
  const [layers, setLayer] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [pageSize, setPageSize] = useState(20);
  const [pageCursor, setPageCursor] = useState(INIT_CURSOR_LOCATION);
  const [nextCursor, setNextCursor] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isNoMore, setIsNoMore] = useState(null);
  const [totalResults, setTotalResults] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  const { selectedGroup, getPermissions } = useAuth0();

  const permissions = getPermissions(AuthzGuards.accessLayersGuard);

  const handleSearchValueChange = ( newValue: string ) => {
    setPageCursor(INIT_CURSOR_LOCATION);
    setNextCursor(null);
    setSearchValue(newValue);
  };

  const handleCursorChange = () => {
    if (nextCursor) {
      setPageCursor(nextCursor);
    }
  };

  useEffect(() => {
    async function setupLayers() {
      setIsLoading(true);

      const query = {
        search: searchValue,
        sort: 'name',
        page: { size: pageSize, cursor: pageCursor },
        group: selectedGroup,
      };
      const encodedQuery = encodeQueryToURL('layers', query);
      const res: any = await getAllLayers(encodedQuery);


      setTotalResults(res.total);

      setLayer(!nextCursor ? res.data : [...layers, ...res.data]);
      setNextCursor(res.pagination.nextCursor ? res.pagination.nextCursor : null);
      setIsNoMore(!res.pagination.nextCursor);

      setIsLoading(false);
    }

    permissions && setupLayers();
  }, [pageCursor, searchValue]);


  return (
    <LayerContext.Provider
      value={{
        handleSearchValueChange,
        handleCursorChange,
        isLoading,
        isNoMore,
        layers,
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
          data={layers}
          categoryUrl={'layers'}
          pageTitle="layers"
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
    </LayerContext.Provider>
  );
}
