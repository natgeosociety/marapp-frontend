import * as React from 'react';
import { Transition, animated } from 'react-spring';
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
