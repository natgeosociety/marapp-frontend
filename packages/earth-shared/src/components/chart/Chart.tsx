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

import React, { PureComponent } from 'react';
import classnames from 'classnames';

import maxBy from 'lodash/maxBy';
import max from 'lodash/max';

import {
  Line,
  Bar,
  Cell,
  Area,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  PieChart,
  Label,
} from 'recharts';

import ChartTick from './tick';

import './styles.scss';

interface ChartConfig {
  xTitle: string;
  yTitle: string;
  margin: { top: number; right: number; left: number; bottom: number };
  padding: { top: number; right: number; left: number; bottom: number };
  type: string;
  xKey: string;
  yKeys: any;
  xAxis: string;
  yAxis: string;
  cartesianGrid: string;
  gradients: string;
  height: string;
  patterns: string;
  tooltip: string;
  layout: string;
  legend: string;
  unit: string;
  unitFormat: (v: any) => {};
}

interface ChartProps {
  data: {}[];
  config: ChartConfig;
  className?: string;
  handleMouseMove?: () => {};
  handleMouseLeave?: () => {};
}

class Chart extends PureComponent<ChartProps> {
  static defaultProps = {
    className: '',
    handleMouseMove: null,
    handleMouseLeave: null,
  };

  findMaxValue = (data, config) => {
    const { yKeys } = config;
    const maxValues = [];

    Object.keys(yKeys).forEach((key) => {
      Object.keys(yKeys[key]).forEach((subKey) => {
        if (data.some((d) => d.key)) {
          maxValues.push(maxBy(data, subKey)[subKey]);
        }
      });
    });

    return max(maxValues);
  };

  render() {
    const { className, data, config, handleMouseMove, handleMouseLeave } = this.props;

    const {
      xTitle,
      yTitle,
      margin = { top: 20, right: 0, left: 50, bottom: 0 },
      padding = { top: 0, right: 0, left: 0, bottom: 0 },
      type,
      xKey,
      yKeys,
      xAxis,
      yAxis,
      cartesianGrid,
      gradients,
      height,
      patterns,
      tooltip,
      layout,
      legend,
      unit,
      unitFormat,
    } = config;

    const { lines, bars, areas, pies } = yKeys;
    const maxYValue = this.findMaxValue(data, config);

    let CHART;
    switch (type) {
      case 'pie':
        CHART = PieChart;
        break;
      default: {
        CHART = ComposedChart;
      }
    }

    return (
      <div
        className={classnames('marapp-qa-chart', 'c-chart', {
          [className]: !!className,
        })}
        style={{ height }}
      >
        {yTitle && <div className="chart--ytitle">{yTitle}</div>}
        <div className="chart--container">
          <ResponsiveContainer>
            <CHART
              height={height}
              data={data}
              layout={type === 'pie' ? 'centric' : layout || 'horizontal'}
              margin={margin}
              padding={padding}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <defs>
                {gradients &&
                  Object.keys(gradients).map((key) => (
                    <linearGradient key={`lg_${key}`} {...gradients[key].attributes}>
                      {gradients[key].stops &&
                        Object.keys(gradients[key].stops).map((sKey) => (
                          <stop key={`st_${sKey}`} {...gradients[key].stops[sKey]} />
                        ))}
                    </linearGradient>
                  ))}

                {patterns &&
                  Object.keys(patterns).map((key) => (
                    <pattern key={`pattern_${key}`} {...patterns[key].attributes}>
                      {patterns[key].children &&
                        Object.keys(patterns[key].children).map((iKey) => {
                          const { tag } = patterns[key].children[iKey];

                          return React.createElement(tag, {
                            key: iKey,
                            ...patterns[key].children[iKey],
                          });
                        })}
                    </pattern>
                  ))}
              </defs>

              {xAxis && (
                <XAxis
                  dataKey={xKey || ''}
                  axisLine={false}
                  tickLine={false}
                  tick={{ dy: 8, fontSize: '11px', fontWeight: 500, fill: '#FFF' }}
                  {...xAxis}
                />
              )}

              {yAxis && (
                <YAxis
                  axisLine={false}
                  tickSize={-margin.left}
                  mirror
                  tickMargin={0}
                  tickLine={false}
                  tick={
                    <ChartTick
                      dataMax={maxYValue}
                      unit={unit || ''}
                      unitFormat={unitFormat || ((value) => value)}
                      fill="#FFF"
                      fontWeight={500}
                    />
                  }
                  {...yAxis}
                />
              )}

              {cartesianGrid && (
                <CartesianGrid
                  strokeWidth={0.5}
                  stroke="#999"
                  shapeRendering="crispEdges"
                  {...cartesianGrid}
                />
              )}

              {areas &&
                Object.keys(areas).map((key) => (
                  <Area key={key} dataKey={key} dot={false} {...areas[key]} />
                ))}

              {bars &&
                Object.keys(bars).map((key) => (
                  <Bar key={key} dataKey={key} dot={false} {...bars[key]}>
                    {!!bars[key].label && <Label {...bars[key].label} />}

                    {bars[key].itemColor &&
                      data.map((item: any) => <Cell key={`c_${item.color}`} fill={item.color} />)}
                  </Bar>
                ))}

              {lines &&
                Object.keys(lines).map((key) => (
                  <Line key={key} dataKey={key} dot={false} strokeWidth={2} {...lines[key]} />
                ))}

              {pies &&
                Object.keys(pies).map((key) => (
                  <Pie
                    key={key}
                    data={data}
                    dataKey={key}
                    startAngle={450}
                    endAngle={90}
                    {...pies[key]}
                  >
                    {data.map((item) => (
                      <Cell
                        key={`c_${item[pies[key].colorKey || 'color']}`}
                        fill={item[pies[key].colorKey || 'color']}
                        stroke={item[pies[key].colorKey || 'color']}
                      />
                    ))}
                  </Pie>
                ))}

              {/* we need to draw this after the graph, as some elements in a vertical bar will draw above the graph */}
              {layout === 'vertical' && xAxis && (
                <XAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} {...xAxis} />
              )}

              {tooltip && <Tooltip isAnimationActive={false} {...tooltip} />}

              {legend && <Legend {...legend} data={data} />}
            </CHART>
          </ResponsiveContainer>
        </div>

        {xTitle && <div className="chart--xtitle">{xTitle}</div>}
      </div>
    );
  }
}

export default Chart;
