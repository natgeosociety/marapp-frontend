import * as React from 'react';

import { Select } from '@marapp/earth-components';

import './styles.scss';

interface ILegendEVI {
  activeLayer?: { slug: string; params: any; layerConfig: any };
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
    const { params, layerConfig } = activeLayer;
    const { paramsConfig } = layerConfig;
    const years = paramsConfig.find(p => p.key === 'year').items;
    const { year } = params;

    const options = Object.keys(years)
      .reverse()
      .map(y => ({
        label: y,
        value: years[y],
      }));

    return (
      <div className="c-legend-evi">
        <Select value={year} onChange={this.onChange} options={options} />
        <span>modis EVI</span>
      </div>
    );
  }
}

export default LegendEVIComponent;
