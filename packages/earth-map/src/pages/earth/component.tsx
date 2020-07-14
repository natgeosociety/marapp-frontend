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
import { Icons as VizzIcons } from 'vizzuality-components';

import Url from 'components/url';
import Map from 'components/map';
import Sidebar from 'components/sidebar';
import Place from 'components/place';
import Fullscreen from 'components/fullscreen';
import { URL_PROPS } from './url';
import SidebarLayoutSearch from 'components/sidebar/sidebar-layout-search';

interface IEarth {
  setFullscreen?: (p: { data: {}; open: boolean }) => void;
  setMapInteractions?: (p: {}) => void;
  layersPanel?: boolean;
  selected?: string;
}

class EarthPage extends React.Component<IEarth> {
  render() {
    const { setFullscreen, setMapInteractions, selected } = this.props;

    return (
      <main className="l-page" role="main">
        <VizzIcons />

        <Url type="EARTH" urlProps={URL_PROPS} />

        <Fullscreen
          onClose={() => {
            setFullscreen({ open: false, data: {} });
            setMapInteractions({});
          }}
        />

        <Sidebar>
          <SidebarLayoutSearch selected={!!selected} />
        </Sidebar>

        <div className="l-content">
          <Map />
          <Place />
        </div>
      </main>
    );
  }
}

export default EarthPage;
