/*
  Copyright 2018-2020 National Geographic Society

  Use of this software does not constitute endorsement by National Geographic
  Society (NGS). The NGS name and NGS logo may not be used for any purpose without
  written permission from NGS.

  Licensed under the Apache License, Version 2.0 (the "License"); you may not use
  this file except in compliance with the License. You may obtain a copy of the
  License at

      https://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed
  under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
  CONDITIONS OF ANY KIND, either express or implied. See the License for the
  specific language governing permissions and limitations under the License.
*/

import React from 'react';
import classnames from 'classnames';
import { InView } from 'react-intersection-observer'

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

    return (
      <div className="marapp-qa-widgets c-widgets">
        <div className="widgets--content">
          <div className="ng-widget-header ng-padding-medium">
            <h3 className="ng-text-display-s ng-margin-bottom">
              {place.organization} | <span className="ng-text-weight-regular">{place.type}</span>
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
                <InView threshold={0.2} triggerOnce>
                  {({ ref, inView }) => (
                    <div style={{ minHeight: '40vh' }} ref={ref}>
                      {inView && <Widget
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
                            toggleLayer(layers[0]);
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
                      </Widget>}
                    </div>
                  )}
                </InView>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default WidgetsComponent;
