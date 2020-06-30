import React from 'react';

import { Html } from '@marapp/earth-components';
import WidgetNoDataComponent from 'components/widget/no-data';
import { IWidgetTemplate } from '../model';

import './styles.scss';

class OceanCarbon extends React.PureComponent<IWidgetTemplate, any> {
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
    const { template, values } = this.props;

    return (
      <div className="c-ocean-carbon-widget">
        <div className="widget--template">
          <Html html={template} />
        </div>

        {/* Chart */}
        {!!values && !!values.total && (
          <div className="ocw--content">
            <div className="ocw--number -center">
              {values.total}
              <div className="ocw--subtitle">Ocean Carbon</div>
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

export default OceanCarbon;
