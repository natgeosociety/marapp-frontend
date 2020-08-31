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

import Link from 'redux-first-router-link';

// styles
import './styles.scss';

class Button extends PureComponent {
  static propTypes = {
    link: PropTypes.shape({}),
    style: PropTypes.shape({}),
    className: PropTypes.string,
    onMouseDown: PropTypes.func,
    onMouseUp: PropTypes.func,
    onMouseLeave: PropTypes.func,
    onTouchStart: PropTypes.func,
    onTouchEnd: PropTypes.func
  };

  static defaultProps = {
    link: null,
    style: {},
    className: '',
    onMouseDown: null,
    onMouseUp: null,
    onMouseLeave: null,
    onTouchStart: null,
    onTouchEnd: null
  };

  state = {
    rippleStyle: {},
    rippleIsVisible: false
  };

  constructor(props) {
    super(props);

    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
    this.onTouchStart = this.onTouchStart.bind(this);
    this.onTouchEnd = this.onTouchEnd.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    const { rippleIsVisible: prevRippleIsVisible } = prevState;
    const { rippleIsVisible: nextRippleIsVisible } = this.state;

    // show ripple
    if (this.ripple && nextRippleIsVisible && !prevRippleIsVisible) {
      this.ripple.classList.remove('-is-animating');
      this.ripple.classList.add('-is-visible');

      requestAnimationFrame(() => {
        if (this.ripple) this.ripple.classList.add('-is-animating');
      });
    }

    // hide ripple
    if (this.ripple && !nextRippleIsVisible && prevRippleIsVisible) {
      // allow a repaint to occur before removing class so animation shows for
      // tap events
      requestAnimationFrame(() => {
        if (this.ripple) this.ripple.classList.remove('-is-visible');
      });
    }
  }

  onMouseDown(ev) {
    this.showRipple(ev);

    const { onMouseDown } = this.props;
    if (onMouseDown) onMouseDown(ev);
  }

  onMouseUp(ev) {
    this.hideRipple(ev);

    const { onMouseUp } = this.props;
    if (onMouseUp) onMouseUp(ev);
  }

  onMouseLeave(ev) {
    this.hideRipple(ev);

    // execute callback
    const { onMouseLeave } = this.props;
    if (onMouseLeave) onMouseLeave(ev);
  }

  onTouchStart(ev) {
    this.showRipple(ev);

    // execute callback
    const { onTouchStart } = this.props;
    if (onTouchStart) onTouchStart(ev);
  }

  onTouchEnd(ev) {
    this.hideRipple(ev);

    // execute callback
    const { onTouchEnd } = this.props;
    if (onTouchEnd) onTouchEnd(ev);
  }

  showRipple(ev) {
    // de-dupe touch events
    if ('ontouchstart' in this.button && ev.type === 'mousedown') return;

    // get (x, y) position of click
    const offset = this.button.getBoundingClientRect();
    let clickEv;

    if (ev.type === 'touchstart' && ev.touches) clickEv = ev.touches[0];
    else clickEv = ev;

    // calculate radius
    const radius = Math.sqrt(offset.width * offset.width +
      offset.height * offset.height
    );

    const diameterPx = `${radius * 2}px`;

    // add ripple to state
    this.setState({
      rippleStyle: {
        top: `${Math.round(clickEv.pageY - offset.top - radius)}px`,
        left: `${Math.round(clickEv.pageX - offset.left - radius)}px`,
        width: diameterPx,
        height: diameterPx
      },
      rippleIsVisible: true
    });
  }

  hideRipple() {
    this.setState({
      rippleIsVisible: false
    });
  }

  renderComponent() {
    const { className, children, ...props } = this.props;
    const { rippleStyle } = this.state;

    const classNames = classnames('marapp-qa-button', 'c-button', {
      [className]: !!className
    });

    return (
      <button
        type="button"
        {...props}
        ref={el => { this.button = el }}
        className={classNames}
        onMouseUp={this.onMouseUp}
        onMouseDown={this.onMouseDown}
        onMouseLeave={this.onMouseLeave}
        onTouchStart={this.onTouchStart}
        onTouchEnd={this.onTouchEnd}
      >
        <span className="button--ripple-container">
          <span
            ref={el => { this.ripple = el }}
            className="button--ripple"
            style={rippleStyle}
          />
        </span>
        <div className="button--children-container">
          {children}
        </div>
      </button>
    );
  }

  render() {
    const { link } = this.props;

    if (link) {
      return (
        <Link {...link}>
          {this.renderComponent()}
        </Link>
      );
    }

    return this.renderComponent();
  }
}

export default Button;
