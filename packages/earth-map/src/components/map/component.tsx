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

import axios from 'axios';
import classnames from 'classnames';
import debounce from 'lodash/debounce';
import React, { useContext } from 'react';
import { renderToString } from 'react-dom/server';
import isEqual from 'react-fast-compare';
import { useTranslation } from 'react-i18next';
import Link from 'redux-first-router-link';

import { Map, Spinner, UserMenu } from '@marapp/earth-shared';

import { MAP_API_URL, MAP_MAPBOX_TOKEN } from '../../config';
import experienceIMG from '../../images/pins/experience-marker.svg';
import { APP_ABOUT, RESOURCE_WATCH_URL } from '../../theme';
import { Auth0Context } from '../../utils/contexts';
import {
  extractCoordinatesFromUrl,
  isValidUrlCoordinateGroup,
  IUrlCoordinates,
} from '../../utils/map';
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
  popup: {};
  layerManagerBounds?: {};
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
  t?: (text: string, opt?: any) => string;
  page?: string;
  activeInteractiveLayersIds?: any;
  activeInteractiveLayers?: any[];
  activeInteractiveLayer?: any;
  layerGroups?: any[];
  layerManagerLayers?: any[];
}

interface IMapState {
  initialUrlCoordinates?: IUrlCoordinates;
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
    const initialUrlCoordinates = extractCoordinatesFromUrl();

    const loadingTilesIntervalRef = setInterval(() => {
      const isLoadingTiles = !this.map?.areTilesLoaded();
      const loadingIndicatorNode = document.querySelector('.map-load-indicator');

      if (isLoadingTiles) {
        loadingIndicatorNode?.classList?.remove('ng-hidden');
      } else {
        loadingIndicatorNode?.classList?.add('ng-hidden');
      }
    }, 100);

    this.setState({
      initialUrlCoordinates,
      loadingTilesIntervalRef,
    });
  }

  public componentWillUnmount() {
    clearInterval(this.state?.loadingTilesIntervalRef);
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
    const { viewport } = this.props;

    this.onViewportChange({
      ...viewport,
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
    if (resourceType === 'Source' && url.includes(MAP_API_URL)) {
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

  /**
   * Once the map is loaded, check if there were any valid coordinates provided in the URL.
   * If so, set the viewport in accordance with those coordinates
   */
  public onLoad = () => {
    const { initialUrlCoordinates } = this.state;

    if (isValidUrlCoordinateGroup(initialUrlCoordinates)) {
      this.onViewportChange({
        ...initialUrlCoordinates,
        transitionDuration: 800,
      });

      this.onViewportChange.flush(); // execute directly the last call
    }
  };

  public render() {
    const {
      selectedOpen,
      mapStyle,
      viewport,
      bounds,
      popup,
      mapboxConfig,
      page,
      activeInteractiveLayersIds,
      activeInteractiveLayers,
      activeInteractiveLayer,
      layerGroups,
      layerManagerLayers,
      layerManagerBounds,
      setMapInteractions,
      t,
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
          mapboxApiAccessToken={MAP_MAPBOX_TOKEN}
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
          onLoad={this.onLoad}
          onReady={this.onReady}
          mapOptions={{
            customAttribution: `
              <a href="${RESOURCE_WATCH_URL}" target="_blank" class="marapp-qa-resource-watch-link">${t(
              'Powered by',
              { value: 'Resource Watch' }
            )}</a> |
              <a href="${APP_ABOUT}" target="_blank">${t('About')}</a>
              ${renderToString(
                <Spinner
                  size="nano"
                  className="ng-position-static ng-display-inline-block ng-padding-remove ng-margin-small-right spinner-border-dark map-load-indicator ng-float-left"
                />
              )}
            `,
          }}
          transformRequest={this.onTransformRequest}
        >
          {(map) => {
            return (
              <>
                <Popup
                  popup={popup}
                  setMapInteractions={setMapInteractions}
                  activeInteractiveLayers={activeInteractiveLayers}
                  activeInteractiveLayer={activeInteractiveLayer}
                />

                <LayerManager map={map} layers={layerManagerLayers} bounds={layerManagerBounds} />
              </>
            );
          }}
        </Map>

        <Legend layerGroups={layerGroups} />

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
