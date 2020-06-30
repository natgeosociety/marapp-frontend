import React from 'react';

const Tick = props => {
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
