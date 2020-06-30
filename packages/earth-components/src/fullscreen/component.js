import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

// Animations
import { Transition } from 'react-spring'

import Templates from './templates';

// Styles
import './styles.scss';

class Fullscreen extends PureComponent {
  static propTypes = {
    open: PropTypes.bool.isRequired,
    data: PropTypes.shape({
      type: PropTypes.string,
      properties: PropTypes.object
    }).isRequired
  };

  render() {
    const {
      open,
      data
    } = this.props;

    const { type } = data;

    return (
      <Transition
        items={open}
        from={{ opacity: 1, y: -50, height: 0 }}
        enter={{ opacity: 1, height: 100, y: -50, pointerEvents: 'auto' }}
        leave={{ opacity: 0, height: 100, y: 50, pointerEvents: 'none' }}
      >
        {open => open && (({ height, y, ...props}) =>
          <div
            className="c-fullscreen"
            style={{
              height: `${height}%`,
              transform: `translate(0, ${y}%)`,
              ...props
            }}
          >
            {!!Templates[type] &&
              React.createElement(Templates[type], {
                ...this.props
              })
            }
          </div>
        )}
      </Transition>
    );
  }
}

export default Fullscreen;
