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

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

// Styles
import './styles.scss';

class Tooltip extends PureComponent {
  static propTypes = {
    payload: PropTypes.arrayOf(PropTypes.shape({})),
    settings: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    hideZeros: PropTypes.bool
  };

  static defaultProps = {
    payload: [],
    hideZeros: false
  }

  getValue = (item, value) => {
    const { format, suffix = '', preffix = '' } = item;
    let val = value;

    if (format && typeof format === 'function') {
      val = format(val)
    }

    return `${preffix}${val}${suffix}`;
  }

  render() {
    const { payload, settings, hideZeros } = this.props;
    const values = payload && payload.length > 0 && payload[0].payload;
    return (
      <div>
        {settings && settings.length && (
          <div className="c-chart-tooltip">
            {settings.map(
              d =>
                (hideZeros && !values[d.key] ? null : (
                  <div
                    key={d.key}
                    className={`data-line ${d.position || ''}`}
                  >
                    {/* LABEL */}
                    {(d.label || d.labelKey) && (
                      <div className="data-label">
                        {d.color && (
                          <div
                            className="data-color"
                            style={{ backgroundColor: d.color }}
                          />
                        )}

                        {d.key === 'break' ? (
                          <span className="break-label">{d.label}</span>
                        ) : (
                          <span>{d.label || values[d.labelKey]}</span>
                        )}
                      </div>
                    )}

                    {/* UNIT */}
                    <div className="data-value">
                      {this.getValue(d, values[d.key])}
                    </div>
                  </div>
                ))
            )}
          </div>
        )}
      </div>
    );
  }
}

export default Tooltip;