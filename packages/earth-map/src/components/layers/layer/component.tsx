import React from 'react';
import { Layer } from '@marapp/earth-components';
import './styles.scss';

interface LayerProps {
  layer?: any;
  key?: any;
  active?: boolean;
  toggleLayer?: any;
}

export default function LayerComponent(props: LayerProps) {
  const { layer, active, toggleLayer } = props;

  return (
    <Layer
      {...layer}
      key={layer.slug}
      active={active}
      onClick={() => {
        toggleLayer(layer);
      }}
    />
  );
}
