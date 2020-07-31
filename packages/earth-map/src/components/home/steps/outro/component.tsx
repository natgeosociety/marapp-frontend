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

import * as React from 'react';
import {Transition, animated} from 'react-spring/renderprops'
import { Button } from '@marapp/earth-components';

import './styles.scss';
import { APP_NAME } from 'theme';

export interface IOutro {
  active?: boolean;
  fullpageApi?: boolean;
}

class OutroComponent extends React.PureComponent<IOutro> {
  render() {
    const { active } = this.props;
    return (
      <Transition
        native
        items={active}
        from={{ opacity: 0 }}
        enter={{ opacity: 1, delay: 900 }}
        leave={{ opacity: 0 }}
      >
        {(active) =>
          active &&
          ((props) => (
            <animated.div style={props} className="landing-outro--container">
              <div className="outro">
                <p className="landing-outro--text">Start Exploring</p>
                <h3 className="landing-outro--title">{APP_NAME}</h3>
                <Button className="ng-button ng-button-primary" link={{ to: '/earth' }}>
                  Launch {APP_NAME}
                </Button>
              </div>
            </animated.div>
          ))
        }
      </Transition>
    );
  }
}

export default OutroComponent;
