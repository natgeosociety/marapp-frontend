import React from 'react';

import { Chart, Html } from '@marapp/earth-components';
import WidgetNoDataComponent from 'components/widget/no-data';
import { IWidgetTemplate } from '../model';

import './styles.scss';

class TerrestrialCarbon extends React.PureComponent<IWidgetTemplate, any> {
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
    const { chart, template, config, values } = this.props;

    return (
      <div className="c-terrestial-carbon-widget">
        <div className="widget--template ng-margin-large-bottom">
          <Html html={template} />
        </div>

        {/* Chart */}
        {!!chart.length && (
          <div className="tcw--content">
            <div className="tcw--number -center">
              {values.total}
              <div className="tcw--subtitle">Terrestrial Carbon</div>
            </div>

            <Chart data={chart} config={config} />

            <div className="tcw--sum">
              <div className="tcw--number -left">
                {values.biomass}
                <div className="tcw--subtitle">Biomass Carbon</div>
              </div>

              <div className="tcw--number -right">
                {values.soil}
                <div className="tcw--subtitle">Soil Carbon</div>
              </div>
            </div>
          </div>
        )}
      </div>
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

export default TerrestrialCarbon;
