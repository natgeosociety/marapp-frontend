import * as React from 'react';
import classnames from 'classnames';

import './styles.scss';

interface IZoomControl {
  viewport: { zoom?: number; maxZoom?: number; minZoom?: number };
  className?: string;
  onClick: (zoom: number) => void;
}

class ZoomControl extends React.PureComponent<IZoomControl, any> {
  static propTypes = {};

  static defaultProps = {
    className: null,
  };

  increaseZoom = (e) => {
    e.stopPropagation();
    const { viewport, onClick } = this.props;
    const { zoom, maxZoom } = viewport;

    onClick(zoom === maxZoom ? zoom : zoom + 1);
  };

  decreaseZoom = (e) => {
    e.stopPropagation();
    const { viewport, onClick } = this.props;
    const { zoom, minZoom } = viewport;

    onClick(zoom === minZoom ? zoom : zoom - 1);
  };

  render() {
    const { className, viewport } = this.props;
    const { zoom, maxZoom, minZoom } = viewport;

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

    return (
      <div className={classNames}>
        <button
          className={zoomInClass}
          type="button"
          disabled={zoom === maxZoom}
          onClick={this.increaseZoom}
        >
          <i className="ng-body-color ng-icon-add"></i>
        </button>
        <button
          className={zoomOutClass}
          type="button"
          disabled={zoom === minZoom}
          onClick={this.decreaseZoom}
        >
          <i className="ng-body-color ng-icon-remove"></i>
        </button>
      </div>
    );
  }
}

export default ZoomControl;
