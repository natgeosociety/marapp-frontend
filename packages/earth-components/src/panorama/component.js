import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import isEqual from 'lodash/isEqual';

import PhotoSphereViewer from 'photo-sphere-viewer';

// Styles
import './styles.scss';

class Panorama extends Component {
  static propTypes = {
    files: PropTypes.arrayOf(PropTypes.object).isRequired,
    options: PropTypes.shape({})
  }

  state = {
    index: 0
  }

  componentDidMount() {
    const { files, options } = this.props;
    const { index } = this.state;

    this.viewer = new PhotoSphereViewer({
      container: this.container,
      panorama: files[index].src,
      size: {
        width: '100%',
        height: '100%'
      },
      panel: false,
      navbar: false,
      mousewheel: false,
      loader: false,
      touchmove_two_fingers: false, // TODO: mobile devices
      ...options
    });
  }

  componentDidUpdate(prevProps) {
    // const { options } = this.props;
    // const { options: prevOptions } = prevProps;

    // if (!isEqual(options, prevOptions)) {
    //   Object.keys(options).map(k => {
    //     this.viewer.change(k, options[k]);
    //   });
    // }
  }

  componentWillUnmount() {
    if (this.viewer && this.viewer.renderer) {
      this.viewer.destroy();
    }
  }

  render() {
    return (
      <div className="c-panorama">
        <div ref={(r) => { this.container = r }} className="panorama--visualization" />
      </div>
    );
  }
}

export default Panorama;