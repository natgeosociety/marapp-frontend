import * as React from 'react';

import {LayerManager, Layer} from 'layer-manager/dist/components';
import {PluginMapboxGl} from 'layer-manager';

interface ILayerManager {
  map?: {};
  layers?: [];
  bounds?: {};
}


class LayerManagerComponent extends React.PureComponent<ILayerManager> {
  render() {
    const {map, layers, bounds} = this.props;

    return (
      <LayerManager
        map={map}
        plugin={PluginMapboxGl}
        // onLayerLoading={loading => setMapLoading(loading)}
      >
        {!!layers &&
        layers.map((l: any, i) => {
          return <Layer key={l.id} {...l} />;
        })}

        {bounds && <Layer {...bounds} />}
      </LayerManager>
    );
  }
}

export default LayerManagerComponent;
