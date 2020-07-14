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

import { setIndexesSelected } from 'modules/indexes/actions';
import { setLayersActive } from 'modules/layers/actions';
import { setUserGroup } from 'modules/user/actions';

export const URL_PROPS = [
  {
    type: 'string',
    value: 'dashboards',
    redux: 'indexes.selected',
    action: setIndexesSelected,
    required: false,
  },
  {
    type: 'array',
    value: 'layers',
    redux: 'layers.active',
    action: setLayersActive,
    required: false,
  },
  {
    type: 'string',
    value: 'org',
    redux: 'user.group',
    action: setUserGroup,
    required: false,
  }
];

export default {
  URL_PROPS,
};
