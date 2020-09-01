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

import * as React from 'react';

import { Select } from '@marapp/earth-components';

import './styles.scss';

interface ILegendEVI {
  activeLayer?: { slug: string; params: any; paramsConfig: any, source: any };
  setLayerSettings?: (data: any) => void;
}

class LegendEVIComponent extends React.PureComponent<ILegendEVI> {
  static propTypes = {};

  onChange = value => {
    const { activeLayer, setLayerSettings } = this.props;

    const { slug, params } = activeLayer;

    setLayerSettings({
      slug,
      settings: {
        params: {
          ...params,
          year: value,
        },
      },
    });
  };

  render() {
    const { activeLayer } = this.props;
    const { params, source, paramsConfig } = activeLayer;
    const years = paramsConfig.find(p => p.key === 'year').items;
    const { year } = params;

    const options = Object.keys(years)
      .reverse()
      .map(y => ({
        label: y,
        value: years[y],
      }));

    return (
      <div className="marapp-qa-legendevi c-legend-evi">
        <Select value={year} onChange={this.onChange} options={options} />
        <span>modis EVI</span>
      </div>
    );
  }
}

export default LegendEVIComponent;
