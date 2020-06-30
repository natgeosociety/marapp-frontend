import * as React from 'react';

import { Html } from '@marapp/earth-components';

interface ILegendInfo {
  title: string;
  description: string;
}

class LegendInfoComponent extends React.Component<ILegendInfo> {
  render() {
    const { title, description } = this.props;

    return (
      <div className="c-layer-info">
        <h3 className="ng-text-display-m ng-body-color">{title}</h3>
        <Html className="layer-info--html" html={description} />
      </div>
    );
  }
}

export default LegendInfoComponent;
