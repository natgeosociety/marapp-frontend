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

import { connect } from 'react-redux';

// Actions
import { setMapStyle, setMapLabels, setMapRoads, resetMap } from 'modules/map/actions';
import { setSidebarPanel, setSidebarPanelExpanded } from 'modules/sidebar/actions';

// Components
import LayersComponent from './component';

import { getGroupedLayers } from 'modules/layers/selectors';

import { toggleLayer } from 'modules/layers/actions';

export default connect(
  (state: any) => ({
    ...state.sidebar,
    group: state.user.group,
    layers: state.layers,
    search: state.layers.search,

    mapStyle: state.map.mapStyle,
    mapLabels: state.map.mapLabels,
    mapRoads: state.map.mapRoads,
    locationName: state.places.data.name,
    locationOrganization: state.places.data.organization,

    // Layers
    groups: getGroupedLayers(state),
  }),
  {
    toggleLayer,
    setMapStyle,
    setMapLabels,
    setMapRoads,
    resetMap,
    setSidebarPanel,
    setSidebarPanelExpanded,
  }
)(LayersComponent);
