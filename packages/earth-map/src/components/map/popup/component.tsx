import React from 'react';

import isEmpty from 'lodash/isEmpty';
import isEqual from 'react-fast-compare';

import { Popup } from 'react-map-gl';

import LayerTemplate from './templates/layer';

import './styles.scss';
interface PopupComponentProps {
  popup: {};
  setMapInteractions: (p: any) => void;
}

class PopupComponent extends React.PureComponent<PopupComponentProps> {
  private popup: any;

  componentDidUpdate(prevProps) {
    const { popup } = this.props;
    const { popup: prevPopup } = prevProps;

    if (!isEmpty(popup) && !isEqual(popup, prevPopup)) {
      window.removeEventListener('click', this.onClickOutside);
      window.addEventListener('click', this.onClickOutside);
    } else {
      window.removeEventListener('click', this.onClickOutside);
    }
  }

  onClose = (e) => {
    e && e.stopPropagation();
    const { setMapInteractions } = this.props;
    setMapInteractions({});
  };

  onClickOutside = (e) => {
    if (!this.popup) {
      return null;
    }

    const { _containerRef } = this.popup;
    const { current } = _containerRef;

    if (!current.contains(e.target)) {
      this.onClose(e);
    }
  };

  render() {
    const { popup } = this.props;

    if (isEmpty(popup)) {
      return null;
    }

    return (
      <Popup
        {...popup}
        ref={(r) => {
          this.popup = r;
        }}
        closeButton={false}
        closeOnClick={false}
      >
        <div className="c-map-popup">
          <button
            key="close-button"
            className="map-popup--close mapbox-prevent-click"
            type="button"
            onClick={this.onClose}
          >
            <i className="ng-icon-close" />
          </button>

          <LayerTemplate />
        </div>
      </Popup>
    );
  }
}

export default PopupComponent;
