import * as React from 'react';

import isEmpty from 'lodash/isEmpty';

// Components
import { Spinner } from '@marapp/earth-components';
import Widgets from 'components/widgets';

// styles
import './styles.scss';

interface ILIst {
  slug: string;
}

interface IIndexContent {
  place?: {};
  selected?: string;
  state?: string;
  widgets?: [];
  loading?: boolean;
  list?: ILIst[];
  metricsLoading?: boolean;
  widgetsLoading?: boolean;
}

class IndexContentComponent extends React.PureComponent<IIndexContent> {
  render() {
    const { place, selected, widgets, list, metricsLoading, widgetsLoading } = this.props;

    if (isEmpty(place)) {
      return null;
    }

    return (
      <div>
        {widgetsLoading && metricsLoading && (
          <Spinner />
        )}

        {!widgetsLoading && !metricsLoading && (
          <React.Fragment>
            <div className="index-content--section">
              <Widgets
                place={place}
                slugs={widgets.map((w) => {
                  const { slug } = w;

                  if (slug) {
                    return {
                      slug,
                      collapsed: false,
                      box: true,
                    };
                  }
                  return null;
                })}
              />
            </div>
          </React.Fragment>
        )}
      </div>
    );
  }
}

export default IndexContentComponent;
