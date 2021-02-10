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

import { replace } from 'layer-manager';
import compact from 'lodash/compact';
import flatten from 'lodash/flatten';
import isEmpty from 'lodash/isEmpty';
import uniqBy from 'lodash/uniqBy';
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import decodes from '../../modules/layers/decodes';
import { ILayer } from '../../modules/layers/model';
import { getParams } from '../../modules/layers/utils';
import {
  setMapBounds,
  setMapHoverInteractions,
  setMapInteractions,
  setMapViewport,
} from '../../modules/map/actions';
import { getPopup, sidebarAwareMapBounds } from '../../modules/map/selectors';
import MapComponent from './component';

const GROUP_LEGEND = (type) => type === 'group';
const YEAR_PICKER_LEGEND = (type) => type === 'yearpicker';
const YEAR_DATE_PICKER_LEGEND = (type) => type === 'yeardatepicker';

function WithData({ activeLayers, active, settings, interactions, interactionsSelected, ...rest }) {
  const [stableActiveLayers, setStableActiveLayers] = useState();

  // hack to keep old layers displayed while fetching the new layers
  useEffect(() => {
    if (activeLayers) {
      setStableActiveLayers(activeLayers);
    }
  }, [activeLayers]);

  const activeInteractiveLayers = getActiveInteractiveLayers(stableActiveLayers, interactions);
  const activeInteractiveLayer = getActiveInteractiveLayer(
    activeInteractiveLayers,
    interactionsSelected
  );

  return (
    <MapComponent
      activeInteractiveLayersIds={getActiveInteractiveLayersIds(
        stableActiveLayers,
        settings,
        active
      )}
      activeInteractiveLayers={activeInteractiveLayers}
      activeInteractiveLayer={activeInteractiveLayer}
      layerGroups={getLegendLayers(stableActiveLayers, settings, active)}
      {...rest}
      layerManagerLayers={getActiveLayers(stableActiveLayers, settings, active)}
    />
  );
}

export default connect(
  (state: any) => ({
    ...state.map,
    ...state.layers,
    popup: getPopup(state),
    bounds: sidebarAwareMapBounds(state),
    layerManagerBounds: state.map.locationHighlight,
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

function getLegendLayers(_layers: ILayer[], _settings, _active) {
  if (!_layers) {
    return [];
  }

  const legendLayers = _layers.filter((l: ILayer) => l.legendConfig && !isEmpty(l.legendConfig));
  const layerGroups = [];

  _active.forEach((slug) => {
    const layer = legendLayers.find((r) => r.slug === slug);
    if (!layer) {
      return false;
    }

    const {
      name,
      description,
      source,
      legendConfig,
      paramsConfig,
      sqlConfig,
      decodeConfig,
      timelineConfig,
      decodeFunction,
      type,
    } = layer;

    const settings = _settings[layer.slug] || {};

    let params = !!paramsConfig && getParams(paramsConfig, settings.params);

    const sqlParams = !!sqlConfig && getParams(sqlConfig, settings.sqlParams);
    const decodeParams = !!decodeConfig && getParams(decodeConfig.values, settings.decodeParams);

    let legend: any = legendConfig;
    let decode: any = { decodeParams };
    let settingsConfig = params;
    let configParams = paramsConfig;
    let configDecode = decodeConfig && decodeConfig.values;
    let timeline: any = timelineConfig;
    const { legendType } = legend;

    if (GROUP_LEGEND(type) || YEAR_PICKER_LEGEND(legendType)) {
      const currentActive = settings.current || layer.references[0].id;
      const { legendConfig } = layer.references.find((l) => l.id === currentActive);

      legend = legendConfig;
    }

    if (YEAR_DATE_PICKER_LEGEND(legendType)) {
      const currentActive = settings.current || layer.references[0].id;

      const current = layer.references.find((l) => l.id === currentActive);

      const { decodeConfig, paramsConfig } = current;
      const { legendConfig } = current;

      legend = legendConfig;
      decode = decodeConfig;
      params = paramsConfig;
      timeline = timelineConfig;
      settingsConfig = settings.params;
      configParams = params;
      configDecode = decodeConfig.values;
    }

    layerGroups.push({
      slug,
      dataset: slug,
      name,
      description,
      // @ts-ignore
      legendType: layer.legendConfig.legendType,
      layers: [
        {
          ...layer,
          opacity: 1,
          active: true,
          legendConfig: legend,
          ...settings,
          ...(!!paramsConfig && {
            params,
          }),

          ...(!!sqlConfig && {
            sqlParams,
          }),

          ...(!!decodeConfig && {
            ...decode,
          }),

          ...(!!decodeConfig && {
            decodeFunction: decodeFunction ? decodeFunction : decodes[decodeConfig.type],
          }),

          ...(!!timelineConfig && {
            timelineParams: {
              ...JSON.parse(replace(JSON.stringify(timeline), settingsConfig)),
              ...getParams(configParams, settings.params),
              ...getParams(configDecode, settings.decodeParams),
            },
          }),
        },
      ],
      visibility: true,
      ...settings,
    });
  });

  return layerGroups;
}

function getActiveLayers(_layers: ILayer[], _settings, _active) {
  if (!_layers) {
    return [];
  }

  return compact(
    _active.map((kActive, i) => {
      const layer = _layers.find((l: ILayer) => l.slug === kActive);

      if (!layer) {
        return null;
      }

      const { source } = layer;
      const { legendConfig } = layer;
      const { type, paramsConfig, sqlConfig, decodeConfig, timelineConfig, decodeFunction } = layer;
      const settings = _settings[layer.slug] || {};

      // @ts-ignore
      const { legendType } = legendConfig;
      return {
        // zIndex: 1000 - i,
        ...layer,

        // If it's a group, get the active layer
        ...((GROUP_LEGEND(type) ||
          // @ts-ignore
          YEAR_PICKER_LEGEND(legendType) ||
          // @ts-ignore
          YEAR_DATE_PICKER_LEGEND(legendType)) && {
          ...layer.references.find((l) => {
            const current = settings.current || layer.references[0].id;
            return l.id === current;
          }),
        }),

        ...settings,

        ...(!!paramsConfig && {
          params: getParams(paramsConfig, settings.params),
        }),

        ...(!!sqlConfig && {
          sqlParams: getParams(sqlConfig, settings.sqlParams),
        }),

        ...(!!decodeConfig && {
          decodeParams: getParams(decodeConfig.values, settings.decodeParams),
        }),

        ...(!!decodeConfig && {
          decodeFunction: decodeFunction ? decodeFunction : decodes[decodeConfig.type],
        }),

        ...(!!timelineConfig && {
          timelineParams: timelineConfig,
        }),
      };
    })
  );
}

function getActiveInteractiveLayers(_layers: ILayer[], _interactions) {
  if (!_layers || isEmpty(_interactions)) {
    // should this return an [] ?
    return [];
  }

  const allLayers = uniqBy(
    flatten(
      _layers.map((l: ILayer) => {
        const { name } = l;
        const { type } = l;

        if (GROUP_LEGEND(type)) {
          return l.references.map((lc) => ({
            ...lc,
            name: `${name} - ${lc.name}`,
          }));
        }

        return l;
      })
    ),
    'id'
  );

  const interactiveLayerKeys = Object.keys(_interactions);
  const interactiveLayers = [];

  allLayers.forEach((layer: ILayer) => {
    if (!!layer.references && layer.references.length > 0) {
      layer.references.forEach((layerRef) => {
        if (interactiveLayerKeys.includes(layerRef.id)) {
          interactiveLayers.push(layerRef);
        }
      });
    } else {
      if (interactiveLayerKeys.includes(layer.id)) {
        interactiveLayers.push(layer);
      }
    }
  });

  return interactiveLayers.map((l: any) => ({
    ...l,
    data: _interactions[l.id],
  }));
}

function getActiveInteractiveLayer(_layers: ILayer[], _interactionsSelected) {
  if (!_layers.length) {
    return {};
  }

  const current = _layers.find((l: ILayer) => l.id === _interactionsSelected) || _layers[0];

  return current;
}
