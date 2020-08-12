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

import { PlaceContext } from 'utils/contexts';
import { encodeQueryToURL, setPage } from 'utils';
import { getAllPlaces, getPlace } from 'services/places';
import { AuthzGuards } from 'auth/permissions';
import { useRequest } from 'utils/hooks';

import { PlaceList, PlaceDetails, PlaceEdit, LinkWithOrg, PlaceHome } from 'components';
import { useAuth0 } from 'auth/auth0';
import { SidebarLayout, ContentLayout } from 'layouts';

const EXCLUDED_FIELDS = '-geojson,-bbox2d,-centroid';
const PLACE_DETAIL_QUERY = {
  include: 'metrics,intersections',
  select: 'intersections.id,intersections.name,intersections.type,-metrics.metric',
  sort: 'intersections.name,metrics.slug,-metrics.version',
};
const INIT_CURSOR_PLACE = '-1';

const PAGE_TYPE = setPage('Places');

export default function PlacesPage( props ) {
  return (
    <Router>
      <Page path="/">
        <HomePage path="/"/>
        <DetailsPage path="/:page"/>
        <EditPage path="/:page/edit" newPlace={false}/>
        <EditPage path="/new" newPlace={true}/>
      </Page>
    </Router>
  );
}

function Sidebar( props: any ) {
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

  const handleSearchValueChange = ( newValue: string ) => {
    setPageCursor(INIT_CURSOR_PLACE);
    setNextCursor(null);
    setSearchValue(newValue);
  };

  const handleCursorChange = () => {
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
        <PlaceList/>
      </SidebarLayout>
    </PlaceContext.Provider>
  );
}

function Page( props: any ) {
  return (
    <>
      <Sidebar/>
      {props.children}
    </>);
}

function HomePage( props: any ) {
  const { getPermissions } = useAuth0();
  const permissions = getPermissions(AuthzGuards.accessPlacesGuard);
  const writePermissions = getPermissions(AuthzGuards.writePlacesGuard);
  return (writePermissions && (
    <ContentLayout>
      <PlaceHome/>
    </ContentLayout>
  ));
}

function DetailsPage( path: any ) {
  const { selectedGroup } = useAuth0();
  const encodedQuery = encodeQueryToURL(`locations/${path.page}`, {
    ...PLACE_DETAIL_QUERY,
    group: selectedGroup,
  });
  const { isLoading, errors, data } = useRequest(() => getPlace(encodedQuery), {
    permissions: AuthzGuards.accessPlacesGuard,
    query: encodedQuery,
  });

  return (
    <ContentLayout errors={errors} backTo="/places" isLoading={isLoading}>
      <PlaceDetails data={data}/>
    </ContentLayout>
  );
}

function EditPage( path: any ) {
  const { selectedGroup } = useAuth0();
  const encodedQuery = encodeQueryToURL(`locations/${path.page}`, {
    ...PLACE_DETAIL_QUERY,
    ...{ group: selectedGroup },
  });
  const { isLoading, errors, data } = useRequest(() => getPlace(encodedQuery), {
    permissions: AuthzGuards.writePlacesGuard,
    skip: path.newPlace,
  });

  return (

    <ContentLayout errors={errors} backTo="/places" isLoading={isLoading}>
      <PlaceEdit data={data} newPlace={path.newPlace}/>
    </ContentLayout>
  );
}
