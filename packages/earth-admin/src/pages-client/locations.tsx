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
import {useEffect, useState} from 'react';
import {Router} from '@reach/router';

import {LocationContext} from 'utils/contexts';
import {LinkWithOrg} from 'components/LinkWithOrg';
import {encodeQueryToURL} from 'utils';
import {getAllLocations, getLocation} from 'services/locations';
import {AuthzGuards} from 'auth/permissions';
import {useRequest} from 'utils/hooks';

import Layout from 'layouts';
import {LocationList, LocationDetails, LocationEdit} from 'components';
import {useAuth0} from '../auth/auth0';
import {setup} from 'axios-cache-adapter';

const EXCLUDED_FIELDS = '-geojson,-bbox2d,-centroid';
const LOCATION_DETAIL_QUERY = {
  include: 'metrics,intersections',
  select: 'intersections.id,intersections.name,intersections.type,-metrics.metric',
  sort: 'intersections.name,metrics.slug,-metrics.version',
};
const INIT_CURSOR_LOCATION = '-1';

export default function LocationsPage(props) {
  return (
    <Router>
      <Page path="/"/>
      <DetailsPage path="/:page"/>
      <EditPage path="/:page/edit" newLocation={false}/>
      <EditPage path="/new" newLocation={true}/>
    </Router>
  );
}

function Page(path: any) {
  const [locations, setLocations] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [pageSize, setPageSize] = useState(20);
  const [pageCursor, setPageCursor] = useState(INIT_CURSOR_LOCATION);
  const [nextCursor, setNextCursor] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const [isNoMore, setIsNoMore] = useState(false);

  const {selectedGroup, getPermissions} = useAuth0();

  const permissions = getPermissions(AuthzGuards.accessLocationsGuard);
  const writePermissions = getPermissions(AuthzGuards.writeLocationsGuard);

  const handleSearchValueChange = (newValue: string) => {
    setPageCursor(INIT_CURSOR_LOCATION);
    setNextCursor(null);
    setSearchValue(newValue);
  };

  const handleCursorChange = async () => {
    console.log('cursor change');
    const query = {
      search: searchValue,
      sort: 'name',
      page: {size: 20, cursor: pageCursor},
      select: EXCLUDED_FIELDS,
      group: selectedGroup,
    };
    const encodedQuery = encodeQueryToURL('locations', query);
    setIsLoading(true);
    const res = await getAllLocations(encodedQuery);
    setLocations(res.data);
    // setTimeout(() => {
    //   console.log('timeout');
    //
    // }, 1000)
    setIsLoading(false);
    setNextCursor(res.pagination.nextCursor ? res.pagination.nextCursor : null);
     setPageCursor(nextCursor);
  };


  useEffect(() => {
    async function setupLocations() {
      //setIsLoading(true);

      // const dataReset = !!path.location.state && !!path.location.state.refresh;
      // const query = {
      //   search: searchValue,
      //   sort: 'name',
      //   page: {size: 20, cursor: pageCursor},
      //   select: EXCLUDED_FIELDS,
      //   group: selectedGroup,
      // };
      // const encodedQuery = encodeQueryToURL('locations', query);
      // const res: any = await getAllLocations(encodedQuery);
      //
      //
      // if (dataReset) {
      //   path.location.state.refresh = false;
      // }
      //
      // setLocations(!nextCursor || dataReset ? res.data : [...locations, ...res.data]);
      // setNextCursor(res.pagination.nextCursor ? res.pagination.nextCursor : null);
      // setIsNoMore(!res.pagination.nextCursor);

      // setIsLoading(false);
    }

    permissions && setupLocations();
  }, [path.location, searchValue]);

  return (
    <LocationContext.Provider
      value={{
        // handleSearchValueChange,
        handleCursorChange,
        isLoading,
        locations,
        // pagination: {pageCursor},
        // searchValue,
      }}
    >
      {/*<Layout permission={permissions}>*/}
      {/*{writePermissions && (*/}
      {/*  <div className="ng-flex ng-align-right">*/}
      {/*    <LinkWithOrg className="ng-button ng-button-overlay" to="/locations/new">*/}
      {/*      add new location*/}
      {/*    </LinkWithOrg>*/}
      {/*  </div>*/}
      {/*)}*/}
      <LocationList/>
      {/*</Layout>*/}
    </LocationContext.Provider>
  );
};

function DetailsPage(path: any) {
  const {selectedGroup} = useAuth0();
  const encodedQuery = encodeQueryToURL(`locations/${path.page}`, {
    ...LOCATION_DETAIL_QUERY,
    group: selectedGroup,
  });
  const {isLoading, errors, data} = useRequest(() => getLocation(encodedQuery), {
    permissions: AuthzGuards.accessLocationsGuard,
    query: encodedQuery,
  });

  return (
    <Layout errors={errors} backTo="/locations" isLoading={isLoading}>
      <LocationDetails data={data}/>
    </Layout>
  );
}

function EditPage(path: any) {
  const {selectedGroup} = useAuth0();
  const encodedQuery = encodeQueryToURL(`locations/${path.page}`, {
    ...LOCATION_DETAIL_QUERY,
    ...{group: selectedGroup},
  });
  const {isLoading, errors, data} = useRequest(() => getLocation(encodedQuery), {
    permissions: AuthzGuards.writeLocationsGuard,
    skip: path.newLocation,
  });

  return (
    <Layout errors={errors} backTo="/locations" isLoading={isLoading}>
      <LocationEdit data={data} newLocation={path.newLocation}/>
    </Layout>
  );
}
