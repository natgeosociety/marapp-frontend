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
import compact from 'lodash/compact';
import flatten from 'lodash/flatten';
import isEmpty from 'lodash/isEmpty';
import { ILayer } from '../../modules/layers/model';
import {
  setMapBounds,
  setMapHoverInteractions,
  setMapInteractions,
  setMapViewport,
} from '../../modules/map/actions';
import { sidebarAwareMapBounds } from '../../modules/map/selectors';
import MapComponent from './component';

const GROUP_LEGEND = (type) => type === 'group';
const YEAR_PICKER_LEGEND = (type) => type === 'yearpicker';
const YEAR_DATE_PICKER_LEGEND = (type) => type === 'yeardatepicker';

function WithData({ activeLayers, active, settings, ...rest }) {
  return (
    <MapComponent
      activeInteractiveLayersIds={getActiveInteractiveLayersIds(activeLayers, settings, active)}
      {...rest}
    />
  );
}

export default connect(
  (state: any) => ({
    ...state.map,
    ...state.layers,
    bounds: sidebarAwareMapBounds(state),
  }),
  {
    setMapViewport,
    setMapBounds,
    setMapInteractions,
    setMapHoverInteractions,
  }
)(WithData);

function getActiveInteractiveLayersIds(_layers: ILayer[], _settings, _active) {
  if (!_layers) {
    return [];
  }

  const getIds = (layer: ILayer) => {
    const { id, source, interactionConfig, render } = layer;

    if (isEmpty(render) || isEmpty(interactionConfig)) {
      return null;
    }

    const { layers } = render;

    if (!layers) {
      return null;
    }

    return layers.map((l, i) => {
      const { id: vectorLayerId, type: vectorLayerType } = l;

      return vectorLayerId || `${id}-${vectorLayerType}-${i}`;
    });
  };

  return flatten(
    compact(
      _active.map((kActive, i) => {
        const layer = _layers.find((l: any) => l.slug === kActive);
        if (!layer) {
          return null;
        }

        const { slug, source, legendConfig, type } = layer;
        const { legendType } = legendConfig as any;

        if (
          GROUP_LEGEND(type) ||
          YEAR_PICKER_LEGEND(legendType) ||
          YEAR_DATE_PICKER_LEGEND(legendType)
        ) {
          const layerConfigLayers = layer.references;

          const current =
            _settings[slug] && _settings[slug].current
              ? _settings[slug].current
              : layerConfigLayers[0].id;

          const layer1 = layerConfigLayers.find((l) => l.id === current);

          return getIds(layer1);
        }

        return getIds(layer);
      })
    )
  );
}
