import * as React from 'react';

import { Select } from '@marapp/earth-components';

const YearPickerLegendComponent = (props: any) => {
  const onChange = value => {
    const { activeLayer, setLayerGroupCurrent } = props;

    const { slug } = activeLayer;

    setLayerGroupCurrent({ slug, current: value });
  };

  const { layers } = props;

  const { references } = layers[0];

  const options =
    !!references &&
    references.map(y => {
      return {
        label: y.name,
        value: y.id,
      };
    });

  return (
    <div className="c-legend-evi">
      <Select onChange={e => onChange(e)} options={options} />
    </div>
  );
};

export default YearPickerLegendComponent;
