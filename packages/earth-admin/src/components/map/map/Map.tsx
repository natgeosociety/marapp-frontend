import * as React from 'react';
import { useContext } from 'react';

import { Map } from '@marapp/earth-components';

import { GATSBY_APP_MAPBOX_TOKEN } from 'config';
import { LAYER_DEFAULT, MAP_DEFAULT } from '../model';
import { MapComponentContext } from 'utils/contexts';
import { LayerManagerComponent } from '../layer-manager';

import './styles.scss';

export default function MapComponent() {
  const { geojson, bbox } = useContext(MapComponentContext);
  const bounds = { bbox: bbox };
  const LAYER = {
    ...LAYER_DEFAULT,
    ...{ layerConfig: { ...LAYER_DEFAULT.layerConfig, ...{ data: geojson } } },
  };

  return (
    <div className="c-map-wrapper -open">
      <Map
        mapboxApiAccessToken={GATSBY_APP_MAPBOX_TOKEN}
        bounds={bounds}
        mapStyle={MAP_DEFAULT.mapStyle}
        viewport={MAP_DEFAULT.viewport}
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
    </div>
  );
}
