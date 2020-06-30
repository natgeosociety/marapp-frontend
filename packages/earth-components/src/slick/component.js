import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import Slider from 'react-slick';

import './styles.scss';

class Slick extends PureComponent {
  static propTypes = {
    settings: PropTypes.shape({}).isRequired,
    onReady: PropTypes.func,
  };

  static defaultProps = { onReady: () => null };

  componentDidMount() {
    const { onReady } = this.props;
    onReady(this.slider);
  }

  render() {
    const { settings, children } = this.props;

    const { dots } = settings;

    return (
      <Slider
        className={classnames({ 'c-slick': true, '--with-dots': dots })}
        {...settings}
        ref={slider => {
          this.slider = slider;
        }}
      >
        {children}
      </Slider>
    );
  }
}

export default Slick;
