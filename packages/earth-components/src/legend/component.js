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

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import debounce from 'lodash/debounce';

import {
  Legend,
  LegendListItem,
  LegendItemTypes,
  // LegendItemToolbar,
  // LegendItemButtonOpacity,
  // LegendItemButtonVisibility,
  // LegendItemButtonLayers
} from 'vizzuality-components';

import LegendGroup from './legend-group';

// styles
import './styles.scss';

class LegendComponent extends PureComponent {
  static propTypes = {
    list: PropTypes.arrayOf(PropTypes.object).isRequired,
    active: PropTypes.arrayOf(PropTypes.object).isRequired,
    setLayerVisibility: PropTypes.func.isRequired,
    setLayerOrder: PropTypes.func.isRequired,
    setLayerOpacity: PropTypes.func.isRequired,
    setLayerGroupActive: PropTypes.func
  }

  onChangeVisibility = (l, visibility, slug) => {
    const { setLayerVisibility } = this.props;
    setLayerVisibility({ slug, dataset: { id: l.dataset }, visibility });
  }

  onChangeOpacity = debounce((l, opacity, slug) => {
    const { setLayerOpacity } = this.props;
    setLayerOpacity({ slug, dataset: { id: l.dataset }, opacity });
  }, 250)

  onChangeOrder = (datasetIds) => {
    const { setLayerOrder } = this.props;
    setLayerOrder({ datasetIds });
  }

  onChangeLayer = (active) => {
    const { setLayerGroupActive } = this.props;
    setLayerGroupActive(active);
  }

  render() {
    const { layerGroups } = this.props;

    return (
      <div className="c-legend-globe marapp-qa-legend">
        <Legend
          onChangeOrder={this.onChangeOrder}
          sortable={false}
          >
          {layerGroups.map((layerGroup, i) => {
            const { layers } = layerGroup;
            const current = layers[0]; // The current is not always the 0, but in our case it will be

            return (
              <LegendListItem
                index={i}
                key={layerGroup.slug}
                layerGroup={layerGroup}
                // toolbar={
                //   <LegendItemToolbar>
                //     <LegendItemButtonLayers />
                //     <LegendItemButtonOpacity
                //       trackStyle={{
                //         background: '#FFCC00'
                //       }}
                //       handleStyle={{
                //         background: '#FFCC00'
                //       }}
                //     />
                //     <LegendItemButtonVisibility />
                //   </LegendItemToolbar>
                // }
                onChangeVisibility={((l, visibility) => this.onChangeVisibility(l, visibility, layerGroup.slug))}
                onChangeLayer={l => this.onChangeLayer(l)}
                onChangeOpacity={(l, opacity) => this.onChangeOpacity(l, opacity, layerGroup.slug)}
              >
                {/*
                  This is temporal and will only works for these 2 layers:
                  - snow-cover-area
                  - precipitation
                */}
                {current.layerConfig.type === 'group' &&
                  <LegendGroup
                    {...current}
                    onChangeLayer={this.onChangeLayer}
                  />
                }
                <LegendItemTypes />
              </LegendListItem>
            )
          })}
        </Legend>
      </div>
    )

  }
}

export default LegendComponent;
