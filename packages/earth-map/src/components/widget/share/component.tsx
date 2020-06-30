import * as React from 'react';

import { Share } from '@marapp/earth-components';

import './styles.scss';

interface IWidgetShare {
  url?: string;
}

class WidgetShareComponent extends React.PureComponent<IWidgetShare> {
  render() {
    const { url } = this.props;

    return (
      <div className="c-widget-share">
        <Share link={url} />
      </div>
    );
  }
}

export default WidgetShareComponent;
