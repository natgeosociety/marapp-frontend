import React from 'react';
import classnames from 'classnames';

import { Html } from '@marapp/earth-components';
import WidgetNoDataComponent from 'components/widget/no-data';
import { IWidgetTemplate } from '../model';

import './styles.scss';

class OceanCarbonPriorities extends React.PureComponent<IWidgetTemplate, any> {
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
    const { chart, template } = this.props;

    return (
      <div className="c-chart-ocean-carbon-priorities">
        <div className="widget--template">
          <Html html={template} />
        </div>

        {/* Chart */}
        {!!chart.length && (
          <div className="ocp--chart">
            <ul className="ocp--chart-list">
              {chart.map((c: any) => (
                <li
                  className={classnames({
                    'ocp--chart-list-item': true,
                    '-selected': c.selected,
                  })}
                  key={c.label}
                  style={{
                    width: `calc(${100 / chart.length}% - 4px)`,
                    backgroundColor: c.color,
                  }}
                >
                  <div className="ocp--chart-list-item-label">{c.label}</div>
                </li>
              ))}
            </ul>
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

export default OceanCarbonPriorities;
