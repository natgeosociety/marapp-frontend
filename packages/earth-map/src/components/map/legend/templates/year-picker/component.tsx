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
