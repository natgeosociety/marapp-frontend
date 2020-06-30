import React from 'react';

import { Chart, Html } from '@marapp/earth-components';
import WidgetNoDataComponent from 'components/widget/no-data';
import { IWidgetTemplate } from '../model';

class EVI extends React.PureComponent<IWidgetTemplate> {
  static defaultProps = {
    collapsed: false,
  };

  collapsed() {
    const { template } = this.props;

    return (
      <div className="widget--template">
        <Html html={template} />
      </div>
    );
  }

  expanded() {
    const { chart, template, config } = this.props;

    return (
      <React.Fragment>
        <div className="widget--template ng-margin-large-bottom">
          <Html html={template} />
        </div>

        {/* Chart */}
        {!!chart.length && <Chart data={chart} config={config} />}
      </React.Fragment>
    );
  }

  render() {
    const { collapsed, noData } = this.props;

    if (noData) {
      return <WidgetNoDataComponent />;
    }

    const content = collapsed ? this.collapsed() : this.expanded();

    return content;
  }
}

export default EVI;
