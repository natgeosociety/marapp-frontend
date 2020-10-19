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

import { resetLayers } from 'modules/layers/actions';
import { resetMap } from 'modules/map/actions';
import { resetPlace, setPlacesSearch } from 'modules/places/actions';
import { setSidebarOpen } from 'modules/sidebar/actions';
import { connect } from 'react-redux';

import SidebarComponent from './component';

export default connect(
  (state: any) => ({
    ...state.sidebar,
    ...state.places,
  }),
  {
    setSidebarOpen,
    setPlacesSearch,
    resetMap,
    resetPlace,
    resetLayers,
  }
)(SidebarComponent);
