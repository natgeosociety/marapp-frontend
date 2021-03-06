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
import classnames from 'classnames';

import isEqual from 'lodash/isEqual';
import isEmpty from 'lodash/isEmpty';

import ReactMapGL, { FlyToInterpolator, TRANSITION_EVENTS } from 'react-map-gl';
import { fitBounds } from 'viewport-mercator-project';

import { easeCubic } from 'd3-ease';

import 'mapbox-gl/dist/mapbox-gl.css';
import './styles.scss';

const DEFAULT_VIEWPORT = {
  zoom: 2,
  lat: 0,
  lng: 0,
};

interface MapProps {
  /** A function that returns the map instance */
  children?: (c: any) => {};

  /** Custom css class for styling */
  customClass?: string;

  /** An object that defines the viewport
   * @see https://uber.github.io/react-map-gl/#/Documentation/api-reference/interactive-map?section=initialization
   */
  viewport?: {};

  /** An object that defines the bounds */
  bounds?: { bbox?: any[]; options?: {} };

  /** A boolean that allows panning */
  dragPan?: boolean;

  /** A boolean that allows rotating */
  dragRotate?: boolean;

  /** A boolean that allows zooming */
  scrollZoom?: boolean;

  /** A boolean that allows zooming */
  touchZoom?: boolean;

  /** A boolean that allows touch rotating */
  touchRotate?: boolean;

  /** A boolean that allows double click zooming */
  doubleClickZoom?: boolean;

  /** A function that exposes when the map is ready. It returns and object with the `this.map` and `this.mapContainer` reference. */
  onReady?: (m: { map?: any; mapContainer?: any }) => {};

  /** A function that exposes when the map is loaded. It returns and object with the `this.map` and `this.mapContainer` reference. */
  onLoad?: (m: { map?: any; mapContainer?: any }) => {};

  /** A function that exposes the viewport */
  onViewportChange?: (v: any) => {};

  /** A function that exposes the viewport */
  getCursor: () => {};
}

class Map extends Component<MapProps> {
  static defaultProps = {
    children: null,
    customClass: null,
    viewport: DEFAULT_VIEWPORT,
    bounds: {},
    dragPan: true,
    dragRotate: true,

    onViewportChange: () => {},
    onLoad: () => {},
    onReady: () => {},
    getCursor: ({ isHovering, isDragging }) => {
      if (isHovering) return 'pointer';
      if (isDragging) return 'grabbing';
      return 'grab';
    },
  };
  events = {};
  state = {
    viewport: {
      ...DEFAULT_VIEWPORT,
      ...this.props.viewport, // eslint-disable-line
    },
    flying: false,
    loaded: false,
  };
  private map: any;
  private mapContainer: any;

  componentDidMount() {
    const { bounds, onReady } = this.props;

    if (!isEmpty(bounds) && !!bounds.bbox && bounds.bbox.every((b) => !!b)) {
      this.fitBounds(0);
    }

    onReady({
      map: this.map,
      mapContainer: this.mapContainer,
    });
  }

  componentDidUpdate(prevProps) {
    const { viewport: prevViewport, bounds: prevBounds } = prevProps;
    const { viewport, bounds } = this.props;
    const { viewport: stateViewport } = this.state;

    if (
      !isEmpty(bounds) &&
      !isEqual(bounds, prevBounds) &&
      !!bounds.bbox &&
      bounds.bbox.every((b) => !!b)
    ) {
      this.fitBounds();
    }

    if (!isEqual(viewport, prevViewport)) {
      this.setState({
        // eslint-disable-line
        viewport: {
          ...stateViewport,
          ...viewport,
        },
      });
    }
  }

  onLoad = () => {
    const { onLoad } = this.props;
    this.setState({ loaded: true });

    onLoad({
      map: this.map,
      mapContainer: this.mapContainer,
    });
  };

  onViewportChange = (v, i) => {
    const { onViewportChange } = this.props;

    this.setState({ viewport: v });
    onViewportChange(v);
  };

  onResize = (v) => {
    const { onViewportChange } = this.props;
    const { viewport } = this.state;
    const newViewport = {
      ...viewport,
      ...v,
    };

    this.setState({ viewport: newViewport });
    onViewportChange(newViewport);
  };

  onMoveEnd = () => {
    const { onViewportChange } = this.props;
    const { viewport } = this.state;

    if (this.map) {
      const bearing = this.map.getBearing();
      const pitch = this.map.getPitch();
      const zoom = this.map.getZoom();
      const { lng, lat } = this.map.getCenter();

      const newViewport = {
        ...viewport,
        bearing,
        pitch,
        zoom,
        latitude: lat,
        longitude: lng,
      };

      // Publish new viewport and save it into the state
      this.setState({ viewport: newViewport });
      onViewportChange(newViewport);
    }
  };

  fitBounds = (transitionDuration = 2500) => {
    const { bounds, onViewportChange } = this.props;
    const { bbox, options } = bounds;

    const { longitude, latitude, zoom } = fitBounds({
      width: this.mapContainer.offsetWidth,
      height: this.mapContainer.offsetHeight,
      bounds: [
        [bbox[0], bbox[1]],
        [bbox[2], bbox[3]],
      ],
      ...options,
    });

    const newViewport = {
      ...this.state.viewport,
      longitude,
      latitude,
      zoom,
      transitionDuration,
      transitionInterruption: TRANSITION_EVENTS.UPDATE,
    };

    this.setState({
      flying: true,
      viewport: newViewport,
    });
    onViewportChange(newViewport);

    setTimeout(() => {
      this.setState({ flying: false });
    }, transitionDuration);
  };

  render() {
    const {
      customClass,
      children,
      getCursor,
      dragPan,
      dragRotate,
      scrollZoom,
      touchZoom,
      touchRotate,
      doubleClickZoom,
      ...mapboxProps
    } = this.props;
    const { viewport, loaded, flying } = this.state;

    return (
      <div
        ref={(r) => {
          this.mapContainer = r;
        }}
        className={classnames('marapp-qa-map', 'c-map', {
          [customClass]: !!customClass,
        })}
      >
        <ReactMapGL
          ref={(map) => {
            this.map = map && map.getMap();
          }}
          // CUSTOM PROPS FROM REACT MAPBOX API
          {...mapboxProps}
          // VIEWPORT
          {...viewport}
          width="100%"
          height="100%"
          // INTERACTIVE
          dragPan={!flying && dragPan}
          dragRotate={!flying && dragRotate}
          scrollZoom={!flying && scrollZoom}
          touchZoom={!flying && touchZoom}
          touchRotate={!flying && touchRotate}
          doubleClickZoom={!flying && doubleClickZoom}
          // DEFAULT FUNC IMPLEMENTATIONS
          onViewportChange={this.onViewportChange}
          onResize={this.onResize}
          onLoad={this.onLoad}
          // getCursor={getCursor}

          transitionInterpolator={new FlyToInterpolator()}
          transitionEasing={easeCubic}
        >
          {loaded && !!this.map && typeof children === 'function' && children(this.map)}
        </ReactMapGL>
      </div>
    );
  }
}

export default Map;
