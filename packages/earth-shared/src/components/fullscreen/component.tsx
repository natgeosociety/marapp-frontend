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

// Animations
import { Transition } from 'react-spring/renderprops';

import Templates from './templates';

// Styles
import './styles.scss';

class Fullscreen extends PureComponent {
  static propTypes = {
    open: PropTypes.bool.isRequired,
    data: PropTypes.shape({
      type: PropTypes.string,
      properties: PropTypes.object,
    }).isRequired,
  };

  render() {
    const { open, data } = this.props;

    const { type } = data;

    return (
      <Transition
        items={open}
        from={{ opacity: 1, y: -50, height: 0 }}
        enter={{ opacity: 1, height: 100, y: -50, pointerEvents: 'auto' }}
        leave={{ opacity: 0, height: 100, y: 50, pointerEvents: 'none' }}
      >
        {(open) =>
          open &&
          (({ height, y, ...props }) => (
            <div
              className="c-fullscreen marapp-qa-fullscreen"
              style={{
                height: `${height}%`,
                transform: `translate(0, ${y}%)`,
                ...props,
              }}
            >
              {!!Templates[type] &&
                React.createElement(Templates[type], {
                  ...this.props,
                })}
            </div>
          ))
        }
      </Transition>
    );
  }
}

export default Fullscreen;
