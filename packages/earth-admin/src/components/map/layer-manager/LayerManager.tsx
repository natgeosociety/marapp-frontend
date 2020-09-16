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

import { PluginMapboxGl } from 'layer-manager';
import { Layer, LayerManager } from 'layer-manager/dist/components';
import React, { useContext } from 'react';
import { MapComponentContext } from 'utils/contexts';

interface ManagerProps {
  layer: any;
  map?: any;
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
