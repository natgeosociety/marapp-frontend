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
import { replace } from 'redux-first-router';
import { connect } from 'react-redux';
import { useAuth0 } from '../../../auth/auth0';
import { useLocation, QUERY_LOCATION } from '../../../fetchers';
import Places from '../../../components/places';
import { EMainType, SubType } from '../../../modules/global/model';
import { persistData, setLastViewedPlace } from '../../../modules/global/actions';
import { setMapBounds } from '../../../modules/map/actions';
import { setSidebarPanelExpanded } from '../../../modules/sidebar/actions';
import CollectionDetails from './CollectionDetails';
import { setPlacesSearch } from '../../../modules/places/actions';
import { Spinner } from '@marapp/earth-shared';

interface IProps {
  selected: boolean;
  slug?: string;
  organization?: string;
  setSidebarPanelExpanded?: (payload?: any) => void;
  setPlacesSearch?: (payload?: any) => void;
  setMapBounds?: (payload?: any) => void;
  setLastViewedPlace?: (payload?: any) => void;
  persistData?: (payload?: any) => void;
}

function WithData(props: IProps) {
  const {
    slug,
    organization,
    setPlacesSearch,
    setSidebarPanelExpanded,
    setMapBounds,
    setLastViewedPlace,
    persistData,
  } = props;
  const [resourceId, setResourceId] = useState();
  const swrProps = useLocation(resourceId || slug, QUERY_LOCATION.getCollection(organization));
  const { privateGroups } = useAuth0();
  const { data, error } = swrProps;

  useEffect(() => {
    if (!data) {
      return;
    }

    setSidebarPanelExpanded(false);
    setPlacesSearch({ search: data.name });

    // someone changed the slug, redirect to the new collection
    if (slug !== data.slug) {
      replace(`/collection/${organization}/${data.slug}`);
    }

    if (data.bbox2d.length) {
      setMapBounds({ bbox: data.bbox2d });
    }

    setLastViewedPlace({
      id: data.id,
      name: data.name,
      slug: data.slug,
      organization: data.organization,
      mainType: EMainType.COLLECTION,
      subType: SubType.COLLECTION,
    });

    persistData();
  }, [data]);

  useEffect(() => {
    if (error) {
      console.log(error);
      if ([403, 404].includes(error.status)) {
        replace('/404');
      }
    }
  }, [error]);

  return (
    <Places
      selected={props.selected}
      locationName={data?.name}
      locationOrganization={data?.organization}
    >
      {data ? (
        <CollectionDetails
          swr={swrProps}
          privateGroups={privateGroups}
          setMapBounds={setMapBounds}
          onSlugChange={setResourceId}
        />
      ) : (
        <Spinner />
      )}
    </Places>
  );
}

export default connect(
  (state: any) => ({
    ...state.router.payload,
  }),
  {
    setPlacesSearch,
    setSidebarPanelExpanded,
    setLastViewedPlace,
    setMapBounds,
    persistData,
  }
)(WithData);
