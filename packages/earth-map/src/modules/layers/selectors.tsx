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

import compact from 'lodash/compact';
import flatten from 'lodash/flatten';
import isEmpty from 'lodash/isEmpty';
import uniqBy from 'lodash/uniqBy';
import { createSelector } from 'reselect';

import decodes from './decodes';
import { ILayer } from './model';
import { getParams } from './utils';

const routeType = (state) => state.router.type;
const layers = (state) => state.layers.listActive;
const active = (state) => state.layers.active;
const settings = (state) => state.layers.settings;

const interactions = (state) => state.map.interactions;
const interactionsSelected = (state) => state.map.interactionsSelected;

const place = (state) => state.places.data;
const collection = (state) => state.collections.data;

const GROUP_LEGEND = (type) => type === 'group';
const YEAR_PICKER_LEGEND = (type) => type === 'yearpicker';
const YEAR_DATE_PICKER_LEGEND = (type) => type === 'yeardatepicker';

export const getActiveInteractiveLayers = createSelector(
  [layers, interactions],
  (_layers: ILayer[], _interactions) => {
    if (!_layers || isEmpty(_interactions)) {
      return {};
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
  getActiveInteractiveLayer,
  getActiveInteractiveLayers,
};
