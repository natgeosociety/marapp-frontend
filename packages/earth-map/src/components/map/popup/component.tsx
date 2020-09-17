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

import isEmpty from 'lodash/isEmpty';
import React from 'react';
import isEqual from 'react-fast-compare';
import { Popup } from 'react-map-gl';

import './styles.scss';
import LayerTemplate from './templates/layer';
interface PopupComponentProps {
  popup: {};
  setMapInteractions: (p: any) => void;
}

class PopupComponent extends React.PureComponent<PopupComponentProps> {
  private popup: any;

  public componentDidUpdate(prevProps) {
    const { popup } = this.props;
    const { popup: prevPopup } = prevProps;

    if (!isEmpty(popup) && !isEqual(popup, prevPopup)) {
      window.removeEventListener('click', this.onClickOutside);
      window.addEventListener('click', this.onClickOutside);
    } else {
      window.removeEventListener('click', this.onClickOutside);
    }
  }

  public onClose = (e) => {
    e && e.stopPropagation();
    const { setMapInteractions } = this.props;
    setMapInteractions({});
  };

  public onClickOutside = (e) => {
    if (!this.popup) {
      return null;
    }

    const { _containerRef } = this.popup;
    const { current } = _containerRef;

    if (!current.contains(e.target)) {
      this.onClose(e);
    }
  };

  public render() {
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
