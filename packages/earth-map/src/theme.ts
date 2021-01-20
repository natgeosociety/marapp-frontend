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

import grayscale from './images/layers/grayscale.png';
import satellite from './images/layers/satellite.png';

export const APP_LOGO = require('./images/unbl_logo.svg');
export const PAGE_SIZE = 30;

export const APP_BASEMAPS = [
  {
    slug: 'grayscale',
    name: 'Grayscale',
    background: grayscale,
    id: 'mapbox://styles/ngsmapbox-gf/ckbwix5xv165q1htdbvkrmxug',
  },
  {
    slug: 'satellite',
    name: 'Satellite',
    background: satellite,
    id: 'mapbox://styles/ngsmapbox-gf/cke00tz1h09as19pr3bjatugw',
  },
];

export const APP_ABOUT = 'https://github.com/natgeosociety/marapp-frontend/blob/master/ABOUT.md';

export const RESOURCE_WATCH_URL = 'http://resourcewatch.org';
