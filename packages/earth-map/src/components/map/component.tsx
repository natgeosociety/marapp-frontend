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

import React from 'react';
import axios from 'axios';
import classnames from 'classnames';
import debounce from 'lodash/debounce';
import isEqual from 'react-fast-compare';

import { Map } from '@marapp/earth-components';
import { APP_ABOUT } from 'theme';

// Components
import LayerManager from './layer-manager';
import Legend from './legend';
import Popup from './popup';
import MapControls from './controls';
import ZoomControl from './controls/zoom';
import RecenterControl from './controls/recenter';

import experienceIMG from 'images/pins/experience-marker.svg';

// Styles
import './styles.scss';
import BasemapComponent from '../basemap';
import { UserMenuComponent } from 'components/user-menu';

const CUSTOM_IMAGES = [{ id: 'experience-marker', src: experienceIMG }];

interface IMap {
  viewport?: { zoom: any };
  bounds?: {};
  interactions?: {};
  mapStyle?: string;
  mapLabels?: boolean;
  mapRoads?: boolean;
  mapboxConfig?: {};
  setMapViewport?: (data: any) => void;
  setMapInteractions?: (data: any) => void;
  setMapBounds?: (data: any) => void;
  setMapHoverInteractions?: (data: any) => void;
  open?: any;
  activeInteractiveLayersIds?: any;
}

class MapComponent extends React.Component<IMap> {
  static defaultProps = {
    bounds: {},
    mapLabels: true,
    mapRoads: true,
  };
  onViewportChange = debounce((viewport) => {
    const { setMapViewport } = this.props;
    setMapViewport(viewport);
  }, 250);
  private map: any;

  componentDidUpdate(prevProps) {
    const { mapLabels, mapRoads, interactions, viewport, setMapViewport } = this.props;
    const {
      mapLabels: prevMapLabels,
      mapRoads: prevMapRoads,
      interactions: prevInteractions,
    } = prevProps;

    if (mapLabels !== prevMapLabels) {
      this.setLabels();
    }

    if (mapRoads !== prevMapRoads) {
      this.setRoads();
    }

    if (!isEqual(interactions, prevInteractions)) {
      Object.keys(interactions).forEach((k) => {
        const { data, geometry } = interactions[k];

        if (data && data.cluster) {
          const { zoom } = viewport;

          this.map.getSource(k).getClusterExpansionZoom(data.cluster_id, (err, newZoom) => {
            if (err) {
              return;
            }
            const { coordinates } = geometry;
            const difference = Math.abs(zoom - newZoom);

            setMapViewport({
              latitude: coordinates[1],
              longitude: coordinates[0],
              zoom: newZoom,
              transitionDuration: 400 + difference * 100,
            });
          });
        }
      });
    }
  }

  onZoomChange = (zoom) => {
    const { setMapViewport } = this.props;

    setMapViewport({
      zoom,
      transitionDuration: 500,
    });
  };

  onRecenterChange = () => {
    const { bounds, setMapBounds } = this.props;

    setMapBounds(null);

    requestAnimationFrame(() => {
      setMapBounds(bounds);
    });
  };

  onStyleLoad = () => {
    this.setLabels();
    this.setRoads();

    // Add custom images
    this.setCustomImages();
  };

  onReady = ({ map }) => {
    this.map = map;

    // Listeners
    this.map.on('style.load', this.onStyleLoad);
  };

  onClick = (e) => {
    const { setMapInteractions } = this.props;

    if (e.features && e.features.length && !e.target.classList.contains('mapbox-prevent-click')) {
      // No better way to do this
      const { features, lngLat } = e;
      setMapInteractions({ features, lngLat });
    } else {
      setMapInteractions({});
    }
  };

  onHover = (e) => {
    const { setMapHoverInteractions } = this.props;

    if (e.features && e.features.length) {
      const { features, lngLat } = e;
      setMapHoverInteractions({ features, lngLat });
    } else {
      setMapHoverInteractions({});
    }
  };

  onTransformRequest = (url, resourceType) => {
    if (resourceType === 'Source' && url.includes(process.env.REACT_APP_API_URL)) {
      return {
        url,
        headers: { Authorization: axios.defaults.headers.common.Authorization },
      };
    }
  };

  setLabels = () => {
    const LABELS_GROUP = ['labels'];
    const LABELS_IGNORE_GROUP = 'road labels';

    const { mapLabels } = this.props;
    const { layers, metadata } = this.map.getStyle();

    const groups = Object.keys(metadata['mapbox:groups']).filter((k) => {
      const { name } = metadata['mapbox:groups'][k];
      const roadGroups = LABELS_GROUP.map(
        (rgr) =>
          name.toLowerCase().includes(rgr) && !name.toLowerCase().includes(LABELS_IGNORE_GROUP)
      );

      return roadGroups.some((bool) => bool);
    });

    const labelLayers = layers.filter((l) => {
      const { metadata } = l;
      if (!metadata) {
        return false;
      }

      const gr = metadata['mapbox:group'];
      return groups.includes(gr);
    });

    labelLayers.forEach((l) => {
      const visibility = mapLabels ? 'visible' : 'none';
      this.map.setLayoutProperty(l.id, 'visibility', visibility);
    });
  };

  setRoads = () => {
    const ROADS_GROUP = ['roads', 'bridges', 'tunnels', 'road labels'];

    const { mapRoads } = this.props;
    const { layers, metadata } = this.map.getStyle();

    const groups = Object.keys(metadata['mapbox:groups']).filter((k) => {
      const { name } = metadata['mapbox:groups'][k];
      const roadGroups = ROADS_GROUP.map((rgr) => name.toLowerCase().includes(rgr));

      return roadGroups.some((bool) => bool);
    });

    const roadLayers = layers.filter((l) => {
      const { metadata } = l;
      if (!metadata) {
        return false;
      }

      const gr = metadata['mapbox:group'];
      return groups.includes(gr);
    });

    roadLayers.forEach((l) => {
      const visibility = mapRoads ? 'visible' : 'none';
      this.map.setLayoutProperty(l.id, 'visibility', visibility);
    });
  };

  setCustomImages = () => {
    CUSTOM_IMAGES.forEach(({ id, src }) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        this.map.addImage(id, img);
      };
    });
  };

  render() {
    const {
      open,
      mapStyle,
      viewport,
      bounds,
      mapboxConfig,
      activeInteractiveLayersIds,
    } = this.props;

    // @ts-ignore
    return (
      <div
        className={classnames({
          'c-map-wrapper': true,
          '-open': open,
        })}
      >
        <UserMenuComponent />
        <Map
          mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
          // Attributtes
          mapStyle={mapStyle}
          viewport={viewport}
          bounds={bounds}
          {...mapboxConfig}
          interactiveLayerIds={activeInteractiveLayersIds}
          // Functions
          onViewportChange={this.onViewportChange}
          onClick={this.onClick}
          onHover={this.onHover}
          onReady={this.onReady}
          mapOptions={{
            customAttribution: `<a href="${APP_ABOUT}" target="_blank">About</a>`,
          }}
          // onLoad={this.onLoad}
          transformRequest={this.onTransformRequest}
        >
          {(map) => {
            return (
              <>
                {/* POPUP */}
                <Popup />

                {/* LAYER MANAGER */}
                <LayerManager map={map} />
              </>
            );
          }}
        </Map>

        <Legend />

        <MapControls>
          <BasemapComponent />
          <div>
            <RecenterControl onClick={this.onRecenterChange} />
            <ZoomControl viewport={viewport} onClick={this.onZoomChange} />
          </div>
        </MapControls>
      </div>
    );
  }
}

export default MapComponent;
