import * as React from 'react';
import { useContext } from 'react';

import { LayerManager, Layer } from 'layer-manager/dist/components';

import { MapComponentContext } from 'utils/contexts';
import { PluginMapboxGl } from 'layer-manager';

interface ManagerProps {
  map?: any;
  layer: any;
}

export default function LayerManagerComponent(props: ManagerProps) {
  const { map, layer } = props;
  const { geojson } = useContext(MapComponentContext);

  return (
    !!geojson && (
      <LayerManager map={map} plugin={PluginMapboxGl}>
        {!!layer && <Layer key={layer.id} {...layer} />}
      </LayerManager>
    )
  );
}
