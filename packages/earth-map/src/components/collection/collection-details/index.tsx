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

import React, { useEffect } from 'react';
import { replace } from 'redux-first-router';
import { connect } from 'react-redux';
import { useLocation, QUERY_LOCATION } from '../../../fetchers';
import { EMainType, SubType } from '../../../modules/global/model';
import { persistData, setLastViewedPlace } from '../../../modules/global/actions';
import { setMapBounds } from '../../../modules/map/actions';
import { setSidebarPanelExpanded } from '../../../modules/sidebar/actions';
import CollectionDetails from './CollectionDetails';
import { setPlacesSearch } from '../../../modules/places/actions';

function WithData(props) {
  const {
    slug,
    organization,
    setSidebarPanelExpanded,
    setMapBounds,
    setLastViewedPlace,
    persistData,
  } = props;
  const swrProps = useLocation(slug, QUERY_LOCATION.getCollection(organization));

  useEffect(() => {
    if (!swrProps.data) {
      return;
    }

    const { data } = swrProps;
    console.log(`@@`, data);

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
  }, [swrProps.data]);

  useEffect(() => {
    if (swrProps.error) {
      console.log(swrProps.error);
      if ([403, 404].includes(swrProps.error.status)) {
        replace('/404');
      }
    }
  }, [swrProps.error]);

  return <CollectionDetails swr={swrProps} {...props} />;
}

export default connect(
  (state: any) => ({
    ...state.router.payload,
  }),
  {
    setSidebarPanelExpanded,
    setLastViewedPlace,
    setMapBounds,
    persistData,
  }
)(WithData);
