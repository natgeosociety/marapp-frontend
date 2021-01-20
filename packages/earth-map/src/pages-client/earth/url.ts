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

import { IUrlProp } from '../../components/url/component';
import { setLayersActive } from '../../modules/layers/actions';
import { setMapViewport } from '../../modules/map/actions';
import { INITIAL_VIEW_PORT } from '../../modules/map/initial-state';
import {
  mapReduxStoreViewportToUrlParams,
  mapUrlParamsToReduxStoreViewport,
} from '../../utils/map';

export const URL_PROPS: IUrlProp[] = [
  {
    type: 'array',
    value: 'layers',
    redux: 'layers.active',
    action: setLayersActive,
    required: false,
  },
  {
    type: 'array',
    value: 'coordinates',
    redux: 'map.viewport',
    action: setMapViewport,
    required: false,
    mapValueToUrl: mapReduxStoreViewportToUrlParams,
    mapUrlToValue: mapUrlParamsToReduxStoreViewport(INITIAL_VIEW_PORT),
  },
];

export default {
  URL_PROPS,
};
