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
import Header from 'components/header';
import Layers from 'components/layers';
import Map from 'components/map';
import Places from 'components/places';
import Sidebar from 'components/sidebar';
import { Tab, Tabs } from 'components/tabs';
import Url from 'components/url';
import { EPanels } from 'modules/sidebar/model';
import React from 'react';
import { Icons as VizzIcons } from 'vizzuality-components';

import { URL_PROPS } from './url';

interface IEarth {
  setSidebarPanel?: () => void;
  panel?: EPanels;
  page?: string;
  layersPanel?: boolean;
  selected?: string;
  selectedOpen?: boolean;
  router?: {
    type: string;
    payload: any;
  };
}

class EarthPage extends React.Component<IEarth> {
  public render() {
    const { setSidebarPanel, panel, selectedOpen, router } = this.props;
    const { type } = router;

    return (
      <main className="marapp-qa-earth l-page marapp-qa-pageearth" role="main">
        <Sidebar>
          {['EARTH', 'LOCATION'].includes(type) && (
            <>
              <VizzIcons />
              <Url type="EARTH" urlProps={URL_PROPS} />

              <Header />
              <Tabs
                value={panel}
                onChange={setSidebarPanel}
                className="ng-padding-medium-horizontal ng-padding-bottom ng-ep-background-dark"
              >
                <Tab label="Places" value="places" />
                <Tab label="Layers" value="layers" />
              </Tabs>
              {panel === EPanels.PLACES && <Places selected={selectedOpen} />}
              {panel === EPanels.LAYERS && <Layers selected={selectedOpen} />}
            </>
          )}

          {['NEW_COLLECTION'].includes(type) && <h1>New collection here</h1>}
        </Sidebar>

        <div className="l-content">
          <Map page={this.props.page} />
        </div>
      </main>
    );
  }
}

export default EarthPage;
