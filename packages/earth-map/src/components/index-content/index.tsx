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

import React from 'react';
import { connect } from 'react-redux';
import IndexContentComponent from './component';
import { useAuth0 } from '../../auth/auth0';
import { sortBy, orderBy } from 'lodash';
import { IWidget } from '../../modules/widget/model';

import { useLocation, useDashboards, QUERY_LOCATION, QUERY_DASHBOARD } from '../../fetchers';

const parseWidgets = (place, widgets, activeLayers) => {
  if (!widgets) {
    return [];
  }

  const slugs = sortBy(widgets, ['organization', 'name'])
    .filter((w: IWidget) => !!w.slug)
    .map((w: IWidget) => ({
      slug: w.slug,
      collapsed: false,
      box: true,
    }));

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
  const { slug, organization, activeLayers } = props;
  const { selectedGroup, groups } = useAuth0();
  const { data: placeData } = useLocation(slug, QUERY_LOCATION.getOne(organization));
  const { data: dashboardsData } = useDashboards(QUERY_DASHBOARD.getWithWidgets(selectedGroup));

  if (!(placeData && dashboardsData)) {
    return <div>Loading...</div>;
  }

  const widgetsData = dashboardsData?.map((dasboard) => dasboard.widgets).flat();

  const widgets = parseWidgets(placeData, widgetsData, activeLayers);

  // console.log(selectedGroup, groups);

  return (
    <IndexContentComponent
      {...props}
      place={placeData}
      widgets={widgets}
      groups={selectedGroup}
      metrics={placeData.metrics}
    />
  );
}

export default connect((state: any) => ({
  activeLayers: state.layers.active,
}))(WithData);

// export default connect((state: any) => ({
//   ...state.indexes,
//   place: state.places.data,
//   widgets: state.widgets.list,
//   loading: state.places.loading,
//   metricsLoading: state.places.loading,
//   widgetsLoading: state.widgets.loading,
// }))(IndexContentComponent);
