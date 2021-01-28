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

import { groupBy, orderBy, sortBy } from 'lodash';
import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import { Spinner } from '@marapp/earth-shared';

import { useAuth0 } from '../../auth/auth0';
import { QUERY_DASHBOARD, QUERY_LOCATION, useDashboards, useLocation } from '../../fetchers';
import { persistData, setLastViewedPlace } from '../../modules/global/actions';
import { EMainType } from '../../modules/global/model';
import { toggleLayer } from '../../modules/layers/actions';
import { setMapBounds, setLocationHighlight, resetMap } from '../../modules/map/actions';
import { setPlacesSearch } from '../../modules/places/actions';
import { setSidebarInfo } from '../../modules/sidebar/actions';
import { IWidget } from '../../modules/widget/model';
import { flattenLayerConfig } from '../../sagas/saga-utils';
import WidgetsComponent from '../widgets/component';

const parseWidgets = (place, widgets, activeLayers, slugs) => {
  if (!widgets) {
    return [];
  }

  const filteredWidgets: IWidget[] = widgets
    .filter((widget) => {
      const { location_types } = widget.config.widgetConfig;

      const thereIsSlug = !!slugs.find((s) => s.slug === widget.slug);
      const thereIsLocationType = Array.isArray(location_types)
        ? location_types.includes(place.locationType.toLowerCase())
        : true;

      return thereIsSlug && thereIsLocationType;
    })
    .map((widget) => ({
      ...widget,
      ...widget.config,
      ...{ layers: widget.layers.map(flattenLayerConfig) },
      slug: widget.slug,
      description: widget.description,
      active: !!activeLayers.find((slug) => widget.layers[0] && slug === widget.layers[0].slug),
      params: {
        id: place.id,
      },
    }));

  return orderBy([...filteredWidgets], ['organization', 'name']);
};

function WithData(props) {
  const {
    slug,
    organization,
    activeLayers,
    setPlacesSearch,
    setLocationHighlight,
    setMapBounds,
    resetMap,
    setLastViewedPlace,
    persistData,
  } = props;
  const { selectedGroup, groups } = useAuth0();
  const { data: placeData } = useLocation(slug, QUERY_LOCATION.getOne(organization));
  const { data: dashboardsData } = useDashboards(QUERY_DASHBOARD.getWithWidgets(selectedGroup));
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

    // const mappedIntersections = groupBy(placeData.intersections, 'type');

    // const formattedData = {
    //   ...placeData,
    //   ...{
    //     jurisdictions: mappedIntersections.Jurisdiction,
    //     biomes: mappedIntersections.Biome,
    //     countries: mappedIntersections.Country,
    //     continents: mappedIntersections.Continent,
    //   },
    // };
    // setPlaceData(formattedData);

    setLastViewedPlace({
      id: placeData.id,
      name: placeData.name,
      slug: placeData.slug,
      organization: placeData.organization,
      mainType: EMainType.LOCATION,
      subType: placeData.type,
    });
    persistData();

    return function cleanup() {
      setPlacesSearch({ search: '' });
      resetMap();
    };
  }, [hasData]);

  if (!hasData) {
    return <Spinner />;
  }

  const widgetsData = dashboardsData?.map((dasboard) => dasboard.widgets).flat();
  const slugs = sortBy(widgetsData, ['organization', 'name'])
    .filter((w: IWidget) => !!w.slug)
    .map((w: IWidget) => ({
      slug: w.slug,
      collapsed: false,
      box: true,
    }));
  const widgets = parseWidgets(placeData, widgetsData, activeLayers, slugs);

  return (
    <div className="index-content--section marapp-qa-indexcontent">
      <WidgetsComponent
        {...props}
        widgets={widgets}
        place={placeData}
        groups={groups}
        metrics={placeData.metrics}
        slugs={slugs}
      />
    </div>
  );
}

export default connect(
  (state: any) => ({
    activeLayers: state.layers.active,
  }),
  {
    setSidebarInfo,
    toggleLayer,
    setMapBounds,
    resetMap,
    setPlacesSearch,
    setLastViewedPlace,
    persistData,
    setLocationHighlight,
  }
)(WithData);
