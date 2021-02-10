/*
 * Copyright 2018-2020 National Geographic Society
 *
 * Use of this software does not constitute endorsement by National Geographic
 * Society (NGS). The NGS name and NGS logo may not be used for any purpose without
 * written permission from NGS.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use
 * this file except in compliance with the License. You may obtain a copy of the
 * License at
 *
 *   https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed
 * under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
 * CONDITIONS OF ANY KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
 */

import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import { Spinner } from '@marapp/earth-shared';

import { useAuth0 } from '../../../auth/auth0';
import Layers from '../../../components/layers';
import Places from '../../../components/places';
import WidgetsComponent from '../../../components/widgets/component';
import { QUERY_DASHBOARDS, QUERY_LOCATIONS, useDashboards, useLocation } from '../../../fetchers';
import { setLastViewedPlace } from '../../../modules/global/actions';
import { EMainType } from '../../../modules/global/model';
import { toggleLayer } from '../../../modules/layers/actions';
import { ILayer } from '../../../modules/layers/model';
import { setLocationHighlight, setMapBounds } from '../../../modules/map/actions';
import { setPlacesSearch } from '../../../modules/places/actions';
import { setSidebarInfo } from '../../../modules/sidebar/actions';
import { EPanels } from '../../../modules/sidebar/model';

interface IProps {
  selected: boolean;
  panel: EPanels;
  activeLayers: ILayer[];
  slug?: string;
  organization?: string;
  setSidebarInfo?: (payload: any) => void;
  toggleLayer?: (payload: any) => void;
  setMapBounds?: (payload: any) => void;
  setPlacesSearch?: (payload: any) => void;
  setLastViewedPlace?: (payload: any) => void;
  setLocationHighlight?: (payload: any) => void;
}

function WithData(props: IProps) {
  const {
    slug,
    selected,
    panel,
    organization,
    activeLayers,
    setPlacesSearch,
    setLocationHighlight,
    setMapBounds,
    setLastViewedPlace,
  } = props;
  const { groups } = useAuth0();
  const { data: placeData } = useLocation(slug, QUERY_LOCATIONS.getOne(organization));
  const { data: dashboardsData } = useDashboards(QUERY_DASHBOARDS.getWithWidgets());
  const hasData = !!(placeData && dashboardsData);

  useEffect(() => {
    if (!hasData) {
      return;
    }
    setPlacesSearch({ search: placeData.name });
    setMapBounds({ bbox: placeData.bbox2d });
    setLocationHighlight({
      id: placeData.id,
      geojson: placeData.geojson,
    });

    setLastViewedPlace({
      id: placeData.id,
      name: placeData.name,
      slug: placeData.slug,
      organization: placeData.organization,
      mainType: EMainType.LOCATION,
      subType: placeData.type,
    });
  }, [hasData]);

  if (panel === EPanels.LAYERS) {
    return (
      <Layers
        selected={selected}
        locationName={placeData?.name}
        locationOrganization={placeData?.organization}
      />
    );
  }

  if (panel === EPanels.PLACES) {
    return (
      <Places
        selected={selected}
        locationName={placeData?.name}
        locationOrganization={placeData?.organization}
      >
        {hasData ? (
          <div className="c-index-sidebar marapp-qa-indexsidebar">
            <div className="index-content--section marapp-qa-indexcontent">
              <WidgetsComponent
                {...props}
                activeLayers={activeLayers}
                dashboards={dashboardsData}
                place={placeData}
                groups={groups}
              />
            </div>
          </div>
        ) : (
          <Spinner />
        )}
      </Places>
    );
  }
}

export default connect(
  (state: any) => ({
    activeLayers: state.layers.active,
    slug: state.router.payload.slug,
    organization: state.router.payload.organization,
  }),
  {
    setSidebarInfo,
    toggleLayer,
    setMapBounds,
    setPlacesSearch,
    setLastViewedPlace,
    setLocationHighlight,
  }
)(WithData);
