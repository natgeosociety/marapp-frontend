import React from 'react';

// Utils
import { format } from 'd3-format';
import { replace, formatKM2, formatPercentage } from 'components/widget/utils';

// Components
import WidgetTooltip from 'components/widget/tooltip';

const COLORS = {
  10: '#030676',
  20: '#012684',
  30: '#0A5692',
  40: '#207389',
  50: '#338B89',
  60: '#41A084',
  70: '#55B87A',
  80: '#77CA66',
  90: '#B8DB5F',
  100: '#FCE726',
};

export const CONFIG = {
  parse: ({ rows }, params, widgetConfig, place) => {
    if (!rows || !rows.length) {
      return {
        noData: true,
        chart: [],
        template: '',
      };
    }

    const data = rows[0];
    const { sentence } = widgetConfig;

    const chart = Object.keys(data)
      .filter(k => k.includes('_percentile'))
      .map(k => {
        const percentile = k.split('_')[1];
        return {
          percentile: parseInt(percentile),
          km2: parseInt(data[k]),
          color: COLORS[percentile],
        };
      })
      .sort((a, b) => a.percentile - b.percentile);

    return {
      chart,
      template: replace(
        sentence.default,
        {
          location: place.title,
        },
        {},
        {
          className: 'ng-text-weight-bold',
        }
      ),
      config: {
        xKey: 'percentile',
        margin: { top: 20, right: 0, left: 60, bottom: 0 },
        yKeys: {
          bars: {
            km2: {
              itemColor: true,
              maxBarSize: 20,
            },
          },
        },
        xAxis: {
          axisLine: {
            stroke: '#CCC',
            strokeWidth: 1,
          },
          tick: { fontSize: 11, fill: '#FFF', fontWeight: 500 },
          tickFormatter: value => `${format(formatPercentage(value / 100))(value / 100)}`,
          interval: 0,
        },
        yTitle: 'km²',
        yAxis: {},
        unitFormat: v => {
          return `${format(formatKM2(v))(v)}`;
        },
        cartesianGrid: {
          vertical: false,
          strokeDasharray: '6 6',
        },
        tooltip: {
          cursor: false,
          content: (
            <WidgetTooltip
              style={{
                color: '#FFFFFF',
                backgroundColor: '#383838',
              }}
              settings={[
                {
                  label: 'Percentile:',
                  key: 'percentile',
                  format: value => `${format(formatPercentage(value / 100))(value / 100)}`,
                },
                {
                  label: 'Value:',
                  key: 'km2',
                  format: value => `${format(formatKM2(value))(value)} km²`,
                },
              ]}
            />
          ),
        },
      },
    };
  },
};

export default CONFIG;
