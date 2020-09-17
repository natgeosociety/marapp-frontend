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

import classnames from 'classnames';
import React from 'react';

import './styles.scss';

interface IZoomControl {
  viewport: { zoom?: number; maxZoom?: number; minZoom?: number };
  className?: string;
  onClick: (zoom: number) => void;
}

class ZoomControl extends React.PureComponent<IZoomControl, any> {
  public static propTypes = {};

  public static defaultProps = {
    className: null,
  };

  public increaseZoom = (e) => {
    e.stopPropagation();
    const { viewport, onClick } = this.props;
    const { zoom, maxZoom } = viewport;

    onClick(zoom === maxZoom ? zoom : zoom + 1);
  };

  public decreaseZoom = (e) => {
    e.stopPropagation();
    const { viewport, onClick } = this.props;
    const { zoom, minZoom } = viewport;

    onClick(zoom === minZoom ? zoom : zoom - 1);
  };

  public render() {
    const { className, viewport } = this.props;
    const { zoom, maxZoom, minZoom } = viewport;

    const classNames = classnames('marapp-qa-zoomcontrol c-zoom-control', {
      [className]: !!className,
    });

    const zoomInClass = classnames('marapp-qa-zoomin zoom-control--btn ng-ep-border-bottom', {
      '-disabled': zoom >= maxZoom,
    });
    const zoomOutClass = classnames('marapp-qa-zoomout zoom-control--btn', {
      '-disabled': zoom <= minZoom,
    });

    return (
      <div className={classNames}>
        <button
          className={zoomInClass}
          type="button"
          disabled={zoom === maxZoom}
          onClick={this.increaseZoom}
        >
          <i className="ng-body-color ng-icon-add" />
        </button>
        <button
          className={zoomOutClass}
          type="button"
          disabled={zoom === minZoom}
          onClick={this.decreaseZoom}
        >
          <i className="ng-body-color ng-icon-remove" />
        </button>
      </div>
    );
  }
}

export default ZoomControl;
