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
import classnames from 'classnames';

// styles
import './styles.scss';

class LayerComponent extends PureComponent {
  static propTypes = {
    slug: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    background: PropTypes.string,
    dark: PropTypes.bool,
    active: PropTypes.bool,
    onClick: PropTypes.func.isRequired,
    onClickInfo: PropTypes.func,
  };

  static defaultProps = {
    background: '',
    active: false,
    onClickInfo: null,
  };

  render() {
    const { slug, name, category, background, dark, active, onClick, onClickInfo } = this.props;

    return (
      <div
        key={slug}
        className={classnames('marapp-qa-layer', 'c-layer', {
          '-dark': dark,
          '-horizontal': !background,
          '-active': active,
        })}
        role="button"
        tabIndex="-1"
        onClick={onClick}
      >
        {!background && (
          <div className="layers--item-switch">
            <span />
          </div>
        )}
        {background && (
          <div className="layers--item-bg" style={{ backgroundImage: `url(${background})` }} />
        )}
        <div className="layers--item-title">
          <span className="ng-margin-right">{name}</span>
          <span className="layers--item-category">{category}</span>
        </div>

        {!!onClickInfo && (
          <button type="button" className="layers--item-info" onClickInfo={onClickInfo}>
            <i className="ng-icon-info-circle" />
          </button>
        )}
      </div>
    );
  }
}

export default LayerComponent;
