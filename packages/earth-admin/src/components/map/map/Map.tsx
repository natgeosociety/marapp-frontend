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
import { useContext, useEffect, useState } from 'react';

import { Map } from '@marapp/earth-components';

import { GATSBY_APP_MAPBOX_TOKEN } from 'config';
import { LAYER_DEFAULT, MAP_DEFAULT } from '../model';
import { MapComponentContext } from 'utils/contexts';
import { LayerManagerComponent } from '../layer-manager';

import './styles.scss';
import MapControls from 'components/map/controls';
import RecenterControl from 'components/map/controls/recenter';
import ZoomControl from 'components/map/controls/zoom';


export default function MapComponent(props: {height?: string}) {
  const {height = '500px'} = props;
  const {geojson, bbox} = useContext(MapComponentContext);

  const [viewport, setViewport] = useState(MAP_DEFAULT.viewport);
  const [mapZoom, setMapZoom] = useState(null);
  const [bounds, setBounds] = useState({bbox: bbox});

  useEffect(() => {
    setBounds({bbox: bbox})
  }, [bbox]);

  const LAYER = {
    ...LAYER_DEFAULT,
    ...{source: {...LAYER_DEFAULT.source, ...{data: geojson}}},
  };

  const onRecenterChange = () => {
    setBounds(null);

    requestAnimationFrame(() => {
      setBounds(bounds);
    });
  };

  const onZoomChange = (zoom) => {
    setViewport({...viewport, ...{zoom: zoom, transitionDuration: 500}});
  };

  const handleMapLoad = (e) => {
    setMapZoom(e.map.getZoom());
  };

  const handleViewportChange = (e) => {
    setMapZoom(e.zoom);
  };

  return (
    <div className="c-map-wrapper -open" style={{height: height}}>
      <Map
        mapboxApiAccessToken={GATSBY_APP_MAPBOX_TOKEN}
        bounds={bounds}
        mapStyle={MAP_DEFAULT.mapStyle}
        viewport={viewport}
        onLoad={(e) => handleMapLoad(e)}
        onViewportChange={(e) => handleViewportChange(e)}
        mapOptions={{
          customAttribution: '',
        }}
      >
        {(map) => {
          return (
            <>
              {/* LAYER MANAGER */}
              <LayerManagerComponent map={map} layer={LAYER}/>
            </>
          );
        }}
      </Map>
      <MapControls>
        <RecenterControl onClick={onRecenterChange}/>
        <ZoomControl viewport={viewport} onClick={(e) => onZoomChange(e)} zoom={mapZoom}/>
      </MapControls>
    </div>
  );
}
