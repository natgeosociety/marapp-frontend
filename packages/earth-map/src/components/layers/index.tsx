import { connect } from 'react-redux';

// Actions
import { setMapStyle, setMapLabels, setMapRoads } from 'modules/map/actions';

// Components
import LayersComponent from './component';

import { getGroupedLayers } from 'modules/layers/selectors';

import { toggleLayer } from 'modules/layers/actions';
import { setSidebarLayers } from 'modules/sidebar/actions';

export default connect(
  (state: any) => ({
    ...state.sidebar,
    group: state.user.group,
    layers: state.layers,

    mapStyle: state.map.mapStyle,
    mapLabels: state.map.mapLabels,
    mapRoads: state.map.mapRoads,

    // Layers
    groups: getGroupedLayers(state),
  }),
  { toggleLayer, setMapStyle, setMapLabels, setMapRoads, setSidebarLayers }
)(LayersComponent);
