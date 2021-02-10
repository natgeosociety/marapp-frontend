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
import { connect } from 'react-redux';
import { replace } from 'redux-first-router';

import { Spinner } from '@marapp/earth-shared';

import { useAuth0 } from '../../../auth/auth0';
import Layers from '../../../components/layers';
import Places from '../../../components/places';
import { QUERY_LOCATIONS, useLocation } from '../../../fetchers';
import { setLastViewedPlace } from '../../../modules/global/actions';
import { EMainType, SubType } from '../../../modules/global/model';
import { resetMap, setLocationHighlight, setMapBounds } from '../../../modules/map/actions';
import { setPlacesSearch } from '../../../modules/places/actions';
import { setSidebarPanelExpanded } from '../../../modules/sidebar/actions';
import { EPanels } from '../../../modules/sidebar/model';
import CollectionDetails from './CollectionDetails';

interface IProps {
  selected: boolean;
  panel: EPanels;
  slug?: string;
  organization?: string;
  setSidebarPanelExpanded?: (payload?: any) => void;
  setPlacesSearch?: (payload?: any) => void;
  setMapBounds?: (payload?: any) => void;
  setLastViewedPlace?: (payload?: any) => void;
  resetMap?: (payload?: any) => void;
  setLocationHighlight?: (payload?: any) => void;
}

function WithData(props: IProps) {
  const {
    slug,
    selected,
    organization,
    setPlacesSearch,
    setSidebarPanelExpanded,
    resetMap,
    panel,
    setMapBounds,
    setLocationHighlight,
    setLastViewedPlace,
  } = props;
  const [resourceId, setResourceId] = useState();
  const swrProps = useLocation(resourceId || slug, QUERY_LOCATIONS.getCollection(organization));
  const { privateGroups } = useAuth0();
  const { data, error } = swrProps;

  useEffect(() => {
    if (!data) {
      return;
    }

    setSidebarPanelExpanded(false);
    setPlacesSearch({ search: data.name });

    if (data.geojson) {
      setLocationHighlight({
        id: data.id,
        geojson: data.geojson,
      });
    }

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
  }, [data?.version]);

  useEffect(() => {
    if (error) {
      console.log(error);
      if ([403, 404].includes(error.status)) {
        replace('/404');
      }
    }
  }, [error]);

  if (panel === EPanels.LAYERS) {
    return (
      <Layers
        selected={selected}
        locationName={data.name}
        locationOrganization={data.organization}
      />
    );
  }

  if (panel === EPanels.PLACES) {
    return (
      <Places
        selected={selected}
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
}

export default connect(
  (state: any) => ({
    ...state.router.payload,
  }),
  {
    resetMap,
    setPlacesSearch,
    setSidebarPanelExpanded,
    setLastViewedPlace,
    setLocationHighlight,
    setMapBounds,
  }
)(WithData);
