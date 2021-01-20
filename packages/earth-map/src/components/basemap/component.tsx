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

import { Layer } from '@marapp/earth-shared';

import { APP_BASEMAPS } from '../../theme';
import './styles.scss';

interface IBasemap {
  mapStyle: any;
  setMapStyle: any;
  persistData: any;
  basemap?: string;
  basemaps?: Array<{
    slug: string;
    name: string;
    background: string;
    id: string;
  }>;
}

class BasemapComponent extends React.PureComponent<IBasemap> {
  public onBasemap = ({ id }) => {
    const { mapStyle, setMapStyle, persistData } = this.props;
    if (mapStyle !== id) {
      setMapStyle(id);
      persistData();
    }
  };

  public render() {
    const { mapStyle } = this.props;

    return (
      <div className="layers--list marapp-qa-basemap">
        {APP_BASEMAPS.filter((l) => l.id !== mapStyle).map((basemap) => (
          <div key={basemap.id}>
            <Layer
              {...basemap}
              key={basemap.slug}
              onClick={() => {
                this.onBasemap(basemap);
              }}
            />
          </div>
        ))}
      </div>
    );
  }
}

export default BasemapComponent;
