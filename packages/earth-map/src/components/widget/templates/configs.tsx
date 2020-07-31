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

import BiodiversityIntactness from './biodiversity-intactness/config';
import Deforestation from './deforestation/config';
import EVI from './evi/config';
import Fires from './fires/config';
import HumanFootprint from './human-footprint/config';
import HumanImpact from './human-impact/config';
import LandCover from './land-cover/config';
import ProtectedArea from './protected-area/config';
import TerrestrialCarbon from './terrestrial-carbon/config';

export default {
  'biodiversity-intactness': BiodiversityIntactness,
  'tree-loss': Deforestation,
  'modis-evi': EVI,
  'modis-fire': Fires,
  'human-footprint': HumanFootprint,
  'human-impact': HumanImpact,
  'land-use': LandCover,
  'protected-areas': ProtectedArea,
  'terrestrial-carbon': TerrestrialCarbon,
};
