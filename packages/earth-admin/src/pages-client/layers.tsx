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

import {LayerContext} from 'utils/contexts';
import {encodeQueryToURL, setPage} from 'utils';
import {getAllLayers, getLayer} from 'services/layers';
import {useRequest} from 'utils/hooks';
import {LayerList, LayerDetails, LayerEdit, LinkWithOrg} from 'components';
import {useAuth0} from 'auth/auth0';
import {AuthzGuards} from 'auth/permissions';
import {ContentLayout, SidebarLayout} from 'layouts';

const LAYER_DETAIL_QUERY = {include: 'references', select: 'references.name,references.id'};
const INIT_CURSOR_LOCATION = '-1';

const PAGE_TYPE = setPage('Layers');

export default function LocationsPage(props) {
  return (
    <Router>
      <Page path="/"/>
      <DetailsPage path="/:page"/>
      <EditPage path="/:page/edit" newLayer={false}/>
      <EditPage path="/new" newLayer={true}/>
    </Router>
  );
}

function LayersWrapper(props: any) {
  const {detail} = props;
  const [layers, setLayer] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [pageSize, setPageSize] = useState(20);
  const [pageCursor, setPageCursor] = useState(INIT_CURSOR_LOCATION);
  const [nextCursor, setNextCursor] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isNoMore, setIsNoMore] = useState(null);
  const [totalResults, setTotalResults] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  const {selectedGroup, getPermissions} = useAuth0();

  const permissions = getPermissions(AuthzGuards.accessLayersGuard);


  const handleSearchValueChange = (newValue: string) => {
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

      const dataReset = !!props.path.location.state && !!props.path.location.state.refresh || detail;

      const query = {
        search: searchValue,
        sort: 'name',
        page: {size: pageSize, cursor: dataReset ? INIT_CURSOR_LOCATION : pageCursor},
        group: selectedGroup,
      };
      const encodedQuery = encodeQueryToURL('layers', query);
      const res: any = await getAllLayers(encodedQuery);

      if (dataReset) {
        props.path.location.state.refresh = false;
      }

      setTotalResults(res.total);

      setLayer(!nextCursor || dataReset ? res.data : [...layers, ...res.data]);
      setNextCursor(res.pagination.nextCursor ? res.pagination.nextCursor : null);
      setSelectedItem(props.path.page);
      setIsNoMore(!res.pagination.nextCursor);

      setIsLoading(false);
    }

    permissions && setupLayers();
  }, [props.path.location, pageCursor, searchValue]);

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
        selectedItem
      }}
    >
      <SidebarLayout page={PAGE_TYPE}>
        <LayerList/>
      </SidebarLayout>
      {props.children}
    </LayerContext.Provider>
  );
}

function Page(path: any) {
  const {getPermissions} = useAuth0();
  const permissions = getPermissions(AuthzGuards.accessLocationsGuard);
  const writePermissions = getPermissions(AuthzGuards.writeLocationsGuard);


  return (
    <LayersWrapper path={path}>
      <ContentLayout permission={permissions}>
        {writePermissions && (
          <div className="ng-flex ng-align-right">
            <LinkWithOrg className="ng-button ng-button-overlay" to="/layers/new">
              add new layer
            </LinkWithOrg>
          </div>
        )}
      </ContentLayout>
    </LayersWrapper>
  );
}

function DetailsPage(path: any) {
  const {selectedGroup} = useAuth0();
  const encodedQuery = encodeQueryToURL(`layers/${path.page}`, {
    ...LAYER_DETAIL_QUERY,
    ...{group: selectedGroup},
  });

  const {isLoading, errors, data} = useRequest(() => getLayer(encodedQuery), {
    permissions: AuthzGuards.accessLayersGuard,
    query: encodedQuery,
  });

  return (
    <LayersWrapper path={path} detail={true}>
      <ContentLayout errors={errors} backTo="/layers" isLoading={isLoading}>
        <LayerDetails data={data} newLayer={false}/>
      </ContentLayout>
    </LayersWrapper>
  );
}

function EditPage(path: any) {
  const {selectedGroup} = useAuth0();
  const encodedQuery = encodeQueryToURL(`layers/${path.page}`, {
    ...LAYER_DETAIL_QUERY,
    ...{group: selectedGroup},
  });
  const {isLoading, errors, data} = useRequest(() => getLayer(encodedQuery), {
    permissions: AuthzGuards.writeLayersGuard,
    skip: path.newLayer,
  });

  return (
    <LayersWrapper path={path} detail={true}>
      <ContentLayout errors={errors} backTo="/layers" isLoading={isLoading}>
        <LayerEdit data={data} newLayer={path.newLayer}/>
      </ContentLayout>
    </LayersWrapper>
  );
}
