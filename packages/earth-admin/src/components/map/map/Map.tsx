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

import React, { useContext, useEffect, useState } from 'react';

import { Map } from '@marapp/earth-shared';

import MapControls from '@app/components/map/controls';
import RecenterControl from '@app/components/map/controls/recenter';
import ZoomControl from '@app/components/map/controls/zoom';
import { ADMIN_MAPBOX_TOKEN } from '@app/config';
import { MapComponentContext } from '@app/utils/contexts';

import { LayerManagerComponent } from '../layer-manager';
import { LAYER_DEFAULT, MAP_DEFAULT } from '../model';
import './styles.scss';

export default function MapComponent(props: { height?: string }) {
  const { height = '500px' } = props;
  const { geojson, bbox } = useContext(MapComponentContext);

  const [viewport, setViewport] = useState(MAP_DEFAULT.viewport);
  const [mapZoom, setMapZoom] = useState(null);
  const [bounds, setBounds] = useState({ bbox });

  useEffect(() => {
    setBounds({ bbox });
  }, [bbox]);

  const LAYER = {
    ...LAYER_DEFAULT,
    ...{ source: { ...LAYER_DEFAULT.source, ...{ data: geojson } } },
  };

  const onRecenterChange = () => {
    setBounds(null);

    requestAnimationFrame(() => {
      setBounds(bounds);
    });
  };

  const onZoomChange = (zoom) => {
    setViewport({ ...viewport, ...{ zoom, transitionDuration: 500 } });
  };

  const handleMapLoad = (e) => {
    e.map && setMapZoom(e.map.getZoom());
  };

  const handleViewportChange = (e) => {
    setMapZoom(e.zoom);
  };

  return (
    <div className="marapp-qa-mapwrapper c-map-wrapper -open" style={{ height }}>
      <Map
        mapboxApiAccessToken={ADMIN_MAPBOX_TOKEN}
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
              <LayerManagerComponent map={map} layer={LAYER} />
            </>
          );
        }}
      </Map>
      <MapControls>
        <RecenterControl onClick={onRecenterChange} />
        <ZoomControl viewport={viewport} onClick={(e) => onZoomChange(e)} zoom={mapZoom} />
      </MapControls>
    </div>
  );
}
