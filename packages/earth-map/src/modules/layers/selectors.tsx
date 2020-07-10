import { createSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';

import compact from 'lodash/compact';
import groupBy from 'lodash/groupBy';
import flatten from 'lodash/flatten';
import uniqBy from 'lodash/uniqBy';

import { replace } from 'layer-manager';

import decodes from './decodes';
import { getParams } from './utils';
import { ILayer } from './model';

const layers = (state) => state.layers.list;
const active = (state) => state.layers.active;
const settings = (state) => state.layers.settings;

const interactions = (state) => state.map.interactions;
const interactionsSelected = (state) => state.map.interactionsSelected;

const place = (state) => state.places.data;

const GROUP_LEGEND = (type) => type === 'group';
const YEAR_PICKER_LEGEND = (type) => type === 'yearpicker';
const YEAR_DATE_PICKER_LEGEND = (type) => type === 'yeardatepicker';

export const getGroupedLayers = createSelector([layers], (_layers: ILayer[]) => {
  if (!_layers || !_layers.length) {
    return {};
  }

  const groups = groupBy(_layers, 'category');

  return groups;
});

export const getLegendLayers = createSelector(
  [layers, settings, active],
  (_layers: ILayer[], _settings, _active) => {

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

      const { name, description, source, legendConfig, paramsConfig,
        sqlConfig, decodeConfig, timelineConfig, type } = layer;

      const settings = _settings[layer.slug] || {};

      let params = !!paramsConfig && getParams(paramsConfig, settings.params);

      const sqlParams = !!sqlConfig && getParams(sqlConfig, settings.sqlParams);
      const decodeParams = !!decodeConfig && getParams(decodeConfig.values, settings.decodeParams);

      let legend: any = legendConfig;
      let decode: any = { decodeParams: decodeParams };
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
              decodeFunction: decodes[decodeConfig.type],
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
);

export const getActiveLayers = createSelector(
  [layers, settings, active],
  (_layers: ILayer[], _settings, _active) => {
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
        const {
          type,
          // layers: layerConfigLayers,
          paramsConfig,
          sqlConfig,
          decodeConfig,
          timelineConfig,
        } = layer;
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
            decodeFunction: decodes[decodeConfig.type],
          }),

          ...(!!timelineConfig && {
            timelineParams: timelineConfig,
          }),
        };
      })
    );
  }
);

export const getActiveBoundsLayer = createSelector([place], (_place) => {
  if (!_place || isEmpty(_place)) {
    return null;
  }

  const { id, geojson } = _place;

  return {
    key: `bounds-${id}`,
    id: `bounds-${id}`,
    slug: `bounds-${id}`,
    name: 'Bounds',
    zIndex: 2000,
    provider: 'geojson',
    layerConfig: {
      data: geojson,
      body: {
        vectorLayers: [
          {
            id: `${id}-fill`,
            type: 'fill',
            source: id,
            paint: {
              'fill-color': 'transparent',
              'fill-opacity': 0.25,
            },
          },
          {
            id: `${id}-line`,
            type: 'line',
            source: id,
            paint: {
              'line-color': '#000000',
              'line-width': 3,
            },
          },
        ],
      },
    },
  };
});

export const getActiveInteractiveLayersIds = createSelector(
  [layers, settings, active],
  (_layers: ILayer[], _settings, _active) => {
    if (!_layers) {
      return [];
    }

    const getIds = (layer: ILayer) => {

      const { id, source, interactionConfig, render } = layer;


      if (isEmpty(render) || isEmpty(interactionConfig)) {

        return null;
      }

      const { layers } =  render;

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


            const  layerConfigLayers  = layer.references;


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
);

export const getActiveInteractiveLayers = createSelector(
  [layers, interactions],
  (_layers: ILayer[], _interactions) => {
    if (!_layers || isEmpty(_interactions)) {
      return {};
    }

    const allLayers = uniqBy(
      flatten(
        _layers.map((l: ILayer) => {
          const {  name } = l;
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
);

export const getActiveInteractiveLayer = createSelector(
  [getActiveInteractiveLayers, interactionsSelected],
  (_layers: ILayer[], _interactionsSelected) => {
    if (!_layers) {
      return {};
    }

    const current = _layers.find((l: ILayer) => l.id === _interactionsSelected) || _layers[0];

    return current;
  }
);
export default {
  getGroupedLayers,

  getLegendLayers,

  getActiveLayers,
  getActiveBoundsLayer,

  getActiveInteractiveLayersIds,
  getActiveInteractiveLayer,
  getActiveInteractiveLayers,
};
