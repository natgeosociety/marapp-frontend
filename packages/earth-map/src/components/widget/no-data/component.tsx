import * as React from 'react';

import noDataIMG from './no-data.svg';

interface IWidgetNoData {
  children?: any;
}

class WidgetNoDataComponent extends React.PureComponent<IWidgetNoData> {
  render() {
    const { children } = this.props;

    return (
      <div className="widget--no-data">
        <img className="widget--no-data-img" alt="No data" src={noDataIMG} />
        <div className="widget--no-data-text">
          {!!children && children}
          {!children && 'No data available'}
        </div>
      </div>
    );
  }
}

export default WidgetNoDataComponent;
