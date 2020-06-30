import * as React from 'react';
import { useEffect, useState } from 'react';
import { Router } from '@reach/router';

import { LayerContext } from 'utils/contexts';
import { encodeQueryToURL } from 'utils';
import { getAllLayers, getLayer } from 'services/layers';
import { useRequest } from 'utils/hooks';

import Layout from 'layouts';
import { LinkWithOrg } from 'components/LinkWithOrg';
import { LayerList, LayerDetails, LayerEdit } from 'components';
import { useAuth0 } from 'auth/auth0';
import { AuthzGuards } from 'auth/permissions';

const LAYER_DETAIL_QUERY = { include: 'references', select: 'references.name,references.id' };
const INIT_CURSOR_LOCATION = '-1';

export default function LocationsPage(props) {
  return (
    <Router>
      <Page path="/" />
      <DetailsPage path="/:page" />
      <EditPage path="/:page/edit" newLayer={false} />
      <EditPage path="/new" newLayer={true} />
    </Router>
  );
}

function Page(path: any) {
  const [layers, setLayer] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [pageSize, setPageSize] = useState(20);
  const [pageCursor, setPageCursor] = useState(INIT_CURSOR_LOCATION);
  const [nextCursor, setNextCursor] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isNoMore, setIsNoMore] = useState(false);

  const { selectedGroup, getPermissions } = useAuth0();

  const permissions = getPermissions(AuthzGuards.accessLayersGuard);
  const writePermissions = getPermissions(AuthzGuards.writeLayersGuard);

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

      const dataReset = !!path.location.state && !!path.location.state.refresh;
      const query = {
        search: searchValue,
        sort: 'name',
        page: { size: pageSize, cursor: dataReset ? INIT_CURSOR_LOCATION : pageCursor },
        group: selectedGroup,
      };
      const encodedQuery = encodeQueryToURL('layers', query);
      const res: any = await getAllLayers(encodedQuery);

      if (dataReset) {
        path.location.state.refresh = false;
      }

      setLayer(!nextCursor || dataReset ? res.data : [...layers, ...res.data]);
      setNextCursor(res.pagination.nextCursor ? res.pagination.nextCursor : null);
      setIsNoMore(!res.pagination.nextCursor);

      setIsLoading(false);
    }

    permissions && setupLayers();
  }, [path.location, pageCursor, searchValue]);

  return (
    <LayerContext.Provider
      value={{
        layers,
        handleSearchValueChange,
        handleCursorChange,
        pagination: { pageCursor },
        isLoading,
        isNoMore,
        searchValue,
      }}
    >
      <Layout permission={permissions}>
        {writePermissions && (
          <div className="ng-flex ng-align-right">
            <LinkWithOrg className="ng-button ng-button-overlay" to="/layers/new">
              add new layer
            </LinkWithOrg>
          </div>
        )}
        <LayerList />
      </Layout>
    </LayerContext.Provider>
  );
}

function DetailsPage(path: any) {
  const { selectedGroup } = useAuth0();
  const encodedQuery = encodeQueryToURL(`layers/${path.page}`, {
    ...LAYER_DETAIL_QUERY,
    ...{ group: selectedGroup },
  });

  const { isLoading, errors, data } = useRequest(() => getLayer(encodedQuery), {
    permissions: AuthzGuards.accessLayersGuard,
    query: encodedQuery,
  });

  return (
    <Layout errors={errors} backTo="/layers" isLoading={isLoading}>
      <LayerDetails data={data} newLayer={false} />
    </Layout>
  );
}

function EditPage(path: any) {
  const { selectedGroup } = useAuth0();
  const encodedQuery = encodeQueryToURL(`layers/${path.page}`, {
    ...LAYER_DETAIL_QUERY,
    ...{ group: selectedGroup },
  });
  const { isLoading, errors, data } = useRequest(() => getLayer(encodedQuery), {
    permissions: AuthzGuards.writeLayersGuard,
    skip: path.newLayer,
  });

  return (
    <Layout errors={errors} backTo="/layers" isLoading={isLoading}>
      <LayerEdit data={data} newLayer={path.newLayer} />
    </Layout>
  );
}
