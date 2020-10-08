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

import React, { Component } from 'react';

import PhotoSphereViewer from 'photo-sphere-viewer';

// Styles
import './styles.scss';

interface PanoramaProps {
  files: any[];
  options?: {};
}

interface PanoramaState {
  index: number;
}

class Panorama extends Component<PanoramaProps, PanoramaState> {
  state = {
    index: 0,
  };
  private viewer: any;
  private container: any;

  componentDidMount() {
    const { files, options } = this.props;
    const { index } = this.state;

    this.viewer = new PhotoSphereViewer({
      container: this.container,
      panorama: files[index].src,
      size: {
        width: '100%',
        height: '100%',
      },
      panel: false,
      navbar: false,
      mousewheel: false,
      loader: false,
      touchmove_two_fingers: false, // TODO: mobile devices
      ...options,
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
      <div className="c-panorama marapp-qa-panorama">
        <div
          ref={(r) => {
            this.container = r;
          }}
          className="panorama--visualization"
        />
      </div>
    );
  }
}

export default Panorama;
