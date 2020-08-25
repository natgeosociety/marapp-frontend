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
import classnames from 'classnames';

import './styles.scss';

interface IZoomControl {
  viewport: {zoom?: number; maxZoom?: number; minZoom?: number};
  className?: string;
  onClick: (zoom: number) => void;
  zoom?: number;
}

const ZoomControl = (props: IZoomControl) => {
  const {className, viewport, onClick, zoom} = props;
  const {maxZoom, minZoom} = viewport;

  const classNames = classnames({
    'c-zoom-control': true,
    [className]: !!className,
  });

  const zoomInClass = classnames('zoom-control--btn ng-ep-border-bottom', {
    '-disabled': zoom >= maxZoom,
  });
  const zoomOutClass = classnames('zoom-control--btn', {
    '-disabled': zoom <= minZoom,
  });

  const increaseZoom = (e) => {
    e.stopPropagation();

    onClick(zoom === maxZoom ? zoom : zoom + 1);
  };

  const decreaseZoom = (e) => {
    e.stopPropagation();

    onClick(zoom === minZoom ? zoom : zoom - 1);
  };

  return (
    <div className={classNames}>
      <button
        className={zoomInClass}
        type="button"
        disabled={zoom === maxZoom}
        onClick={increaseZoom}
      >
        <i className="ng-body-color ng-icon-add"/>
      </button>
      <button
        className={zoomOutClass}
        type="button"
        disabled={zoom === minZoom}
        onClick={decreaseZoom}
      >
        <i className="ng-body-color ng-icon-remove"/>
      </button>
    </div>
  );

};

export default ZoomControl;
