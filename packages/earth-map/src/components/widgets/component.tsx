import React from 'react';
import classnames from 'classnames';

// Components
import Widget from 'components/widget';
import TEMPLATES from 'components/widget/templates';
import CONFIGS from 'components/widget/templates/configs';

import { IWidget } from 'modules/widget/model';
import { IPlace } from 'modules/places/model';

import './styles.scss';

interface IWidgets {
  groups?: string[];
  slugs?: Array<{}>;
  list?: IWidget[];
  place?: Partial<IPlace>;
  embed?: boolean;
  toolbar?: boolean;
  setSidebarInfo?: (s: any) => {};
  toggleLayer?: (s: any) => {};
  metrics?: [];
}

interface IWidgetsState {
  collapsedState?: {};
  share?: boolean;
  widgetId?: string;
}

class WidgetsComponent extends React.Component<IWidgets, IWidgetsState> {
  constructor(props) {
    super(props);
    this.state = {
      collapsedState: {},
      share: false,
      widgetId: null,
    };
  }

  render() {
    const { groups, place, list, embed, toolbar, toggleLayer, metrics = [{}] } = this.props;
    const { collapsedState } = this.state;

    const classNames = classnames({
      'c-widgets': true,
    });

    return (
      <div className={classNames}>
        <div className="widgets--content">
          <div className="ng-widget-header ng-padding-medium">
            <h3 className="ng-text-display-s ng-margin-bottom">
              {place.organization} | <span className="ng-c-text-regular">{place.type}</span>
            </h3>
            <h2 className="ng-text-edit-m ng-body-color ng-margin-remove">{place.name}</h2>
          </div>
          {list.map((w: any, i) => {
            const [widgetMetricName] = w.metrics;

            const [filteredMetric] = metrics.filter(
              (metric: any) => metric.slug === widgetMetricName
            );

            return (
              <div key={`${w.slug}-${i}`} className="widgets--list-item ng-position-relative">
                <Widget
                  {...w}
                  {...(typeof collapsedState[widgetMetricName] !== 'undefined' && {
                    collapsed: collapsedState[widgetMetricName],
                  })}
                  {...CONFIGS[widgetMetricName]}
                  id={place.slug}
                  place={place}
                  widgetDescription={w.description}
                  metric={!!filteredMetric ? filteredMetric : {}}
                  showOrgLabel={groups.length > 1}
                  embed={embed}
                  toolbar={toolbar}
                  activeDownload={false} // To be done, only if it's necessary
                  onShare={() => this.setState({ share: true, widgetId: w.id })}
                  onCollapse={(c) => {
                    this.setState({
                      collapsedState: { ...collapsedState, [widgetMetricName]: c },
                    });
                  }}
                  onToggleLayer={(bool) => {
                    const { layers } = w;

                    if (layers[0]) {
                      toggleLayer({
                        slug: layers[0].slug,
                      });
                    }
                  }}
                >
                  {({ slug, data, ...props }) => (
                    <React.Fragment>
                      {/* Template */}
                      {!!TEMPLATES[widgetMetricName] &&
                        React.createElement(TEMPLATES[widgetMetricName], {
                          ...data,
                          ...props,
                        })}
                    </React.Fragment>
                  )}
                </Widget>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default WidgetsComponent;
