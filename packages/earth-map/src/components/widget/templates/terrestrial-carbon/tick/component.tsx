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

import React from 'react';

const Tick = (props) => {
  const { x, y, payload } = props;

  return (
    <g transform={`translate(${x},${y})`}>
      <line
        x1="0"
        y1="-100%"
        x2="0"
        y2="0"
        stroke="#CCC"
        strokeWidth={2}
        strokeDasharray="4 4"
        shapeRendering="crispEdges"
      />

      <text x={0} y={0} dy={16} textAnchor="middle" fontSize="9" fill="#FFF">
        {payload.value}%
      </text>
    </g>
  );
};

export default Tick;
