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
      <div className="c-legend-globe">
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
