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
import PropTypes from 'prop-types';
import classnames from 'classnames';

// Styles
import './styles.scss';

class Select extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    value: PropTypes.string,
    options: PropTypes.arrayOf(PropTypes.shape({})),
    onChange: PropTypes.func,
  };

  state = {
    value: this.props.value || this.props.options[0].value,
  };

  onChange = (e) => {
    const { onChange } = this.props;
    const { value } = e.currentTarget;

    this.setState({ value });
    onChange(value);
  };

  render() {
    const { options, className } = this.props;

    const { value } = this.state;
    const selectedValue = options.find((o) => o.value === value) || {};

    return (
      <div
        className={classnames('marapp-qa-select', 'c-select', {
          [className]: !!className,
        })}
      >
        <span className="select--value">{selectedValue.label || value}</span>
        <select className="select--input" onChange={this.onChange} value={value}>
          {options.map((l) => (
            <option key={l.value} value={l.value}>
              {l.label}
            </option>
          ))}
        </select>
      </div>
    );
  }
}

export default Select;
