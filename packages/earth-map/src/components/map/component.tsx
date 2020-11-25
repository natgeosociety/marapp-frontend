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

import { Auth0Context } from 'auth/auth0';
import axios from 'axios';
import classnames from 'classnames';
import { API_URL, MAPBOX_TOKEN } from 'config';
import experienceIMG from 'images/pins/experience-marker.svg';
import debounce from 'lodash/debounce';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { renderToString } from 'react-dom/server';
import isEqual from 'react-fast-compare';
import Link from 'redux-first-router-link';
import { APP_ABOUT } from 'theme';

import { Map, Spinner, UserMenu } from '@marapp/earth-shared';

import BasemapComponent from '../basemap';
import MapControls from './controls';
import RecenterControl from './controls/recenter';
import ZoomControl from './controls/zoom';
import LayerManager from './layer-manager';
import Legend from './legend';
import Popup from './popup';
import './styles.scss';

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
  selectedOpen?: boolean;
  page?: string;
  activeInteractiveLayersIds?: any;
}

interface IMapState {
  loadingTilesIntervalRef?: NodeJS.Timeout;
}

class MapComponent extends React.Component<IMap, IMapState> {
  public static defaultProps = {
    bounds: {},
    mapLabels: true,
    mapRoads: true,
  };
  public onViewportChange = debounce((viewport) => {
    const { setMapViewport } = this.props;
    setMapViewport(viewport);
  }, 250);
  private map: any;

  constructor(props) {
    super(props);
  }

  public componentDidMount() {
    const loadingTilesIntervalRef = setInterval(() => {
      const isLoadingTiles = !this.map.areTilesLoaded();
      const loadingIndicatorNode = document.querySelector('.map-load-indicator');

      if (isLoadingTiles) {
        loadingIndicatorNode.classList.remove('ng-hidden');
      } else {
        loadingIndicatorNode.classList.add('ng-hidden');
      }
    }, 100);

    this.setState({
      loadingTilesIntervalRef,
    });
  }

  public componentWillUnmount() {
    clearInterval(this.state.loadingTilesIntervalRef);
  }

  public componentDidUpdate(prevProps) {
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

  public onZoomChange = (zoom) => {
    const { setMapViewport } = this.props;

    setMapViewport({
      zoom,
      transitionDuration: 500,
    });
  };

  public onRecenterChange = () => {
    const { bounds, setMapBounds } = this.props;

    setMapBounds({});

    requestAnimationFrame(() => {
      setMapBounds(bounds);
    });
  };

  public onStyleLoad = () => {
    this.setLabels();
    this.setRoads();

    // Add custom images
    this.setCustomImages();
  };

  public onReady = ({ map }) => {
    this.map = map;

    // Listeners
    this.map.on('style.load', this.onStyleLoad);
  };

  public onClick = (e) => {
    const { setMapInteractions } = this.props;

    if (e.features && e.features.length && !e.target.classList.contains('mapbox-prevent-click')) {
      // No better way to do this
      const { features, lngLat } = e;
      setMapInteractions({ features, lngLat });
    } else {
      setMapInteractions({});
    }
  };

  public onHover = (e) => {
    const { setMapHoverInteractions } = this.props;

    if (e.features && e.features.length) {
      const { features, lngLat } = e;
      setMapHoverInteractions({ features, lngLat });
    } else {
      setMapHoverInteractions({});
    }
  };

  public onTransformRequest = (url, resourceType) => {
    if (resourceType === 'Source' && url.includes(API_URL)) {
      return {
        url,
        headers: { Authorization: axios.defaults.headers.common.Authorization },
      };
    }
  };

  public setLabels = () => {
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

  public setRoads = () => {
    const ROADS_GROUP = ['roads', 'bridges', 'tunnels', 'road-labels', 'surface', 'surface-icons'];

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

  public setCustomImages = () => {
    CUSTOM_IMAGES.forEach(({ id, src }) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        this.map.addImage(id, img);
      };
    });
  };

  public render() {
    const {
      selectedOpen,
      mapStyle,
      viewport,
      bounds,
      mapboxConfig,
      page,
      activeInteractiveLayersIds,
    } = this.props;

    // @ts-ignore
    return (
      <div
        className={classnames('c-map-wrapper', {
          '-open': selectedOpen,
        })}
      >
        <UserMenuWrapper selected={page} />

        <Map
          mapboxApiAccessToken={MAPBOX_TOKEN}
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
            customAttribution: `
              <a href="${APP_ABOUT}" target="_blank">About</a>
              ${renderToString(
                <Spinner
                  size="nano"
                  className="ng-position-static ng-display-inline-block ng-padding-remove ng-margin-small-right spinner-border-dark map-load-indicator ng-float-left"
                />
              )}
            `,
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

// TODO Remove UserMenuWrapper after refactoring MapComponent to be a functional component
// This only exists to make use of 'useContext()' inside of it
function UserMenuWrapper(props) {
  const { selected } = props;
  const { t } = useTranslation();
  const { logout, login, isAuthenticated, userData } = useContext(Auth0Context);

  return (
    <UserMenu
      selected={selected}
      isAuthenticated={isAuthenticated}
      userName={userData.name}
      profileLink={<Link to={{ type: 'PROFILE' }}>{t('Profile')}</Link>}
      onLogin={login}
      onLogout={logout}
      onSignUp={() => login({ initialScreen: 'signUp' })}
    />
  );
}

export default MapComponent;
