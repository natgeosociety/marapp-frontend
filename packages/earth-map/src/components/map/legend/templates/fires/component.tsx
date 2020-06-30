import * as React from 'react';
import moment from 'moment';

import { Select, Datepicker } from '@marapp/earth-components';

import './styles.scss';

interface ILegendFires {
  activeLayer: {
    slug: any;
    params: any;
    decodeParams: any;
    timelineParams: any;
  };
  setLayerSettings: (values: any) => void;
}

class LegendFiresComponent extends React.PureComponent<ILegendFires> {
  static propTypes = {};

  generateYearValues = (start: number, end: number) => {
    let years = [];
    for (start; start <= end; start++) {
      years = [...years, ...[{ label: `${start}`, value: start }]];
    }

    return years.reverse();
  };

  onChange = value => {
    const { activeLayer, setLayerSettings } = this.props;

    const { slug, params, decodeParams } = activeLayer;
    const { startDate, endDate, trimEndDate } = decodeParams;

    setLayerSettings({
      slug,
      settings: {
        params: {
          ...params,
          year: value,
        },
        decodeParams: {
          ...decodeParams,
          startDate: moment
            .utc(startDate)
            .year(value)
            .format('YYYY-MM-DD'),
          endDate: moment
            .utc(trimEndDate || endDate)
            .year(value)
            .format('YYYY-MM-DD'),
          trimEndDate: moment
            .utc(trimEndDate || endDate)
            .year(value)
            .format('YYYY-MM-DD'),
        },
      },
    });
  };

  onDateChange = (value, who) => {
    const { activeLayer, setLayerSettings } = this.props;

    const { slug, decodeParams } = activeLayer;

    setLayerSettings({
      slug,
      settings: {
        decodeParams: {
          ...decodeParams,
          [who]: moment(value).format('YYYY-MM-DD'),
          ...(who === 'trimEndDate' && {
            endDate: moment(value).format('YYYY-MM-DD'),
          }),
        },
      },
    });
  };

  getYearFromString = (value: string) => {
    return moment(value, 'YYYY-MM-DD').year();
  };

  render() {
    const { activeLayer } = this.props;

    const { params, decodeParams, timelineParams } = activeLayer;
    const { year } = params;

    const { startDate, trimEndDate } = decodeParams;
    const { minDate, maxDate, maxAbsoluteDate, minAbsoluteDate } = timelineParams;

    const min = minDate < minAbsoluteDate ? minAbsoluteDate : minDate;
    const max = maxDate > maxAbsoluteDate ? maxAbsoluteDate : maxDate;
    const trim = trimEndDate > maxAbsoluteDate ? maxAbsoluteDate : trimEndDate;

    const startYear = this.getYearFromString(minAbsoluteDate);
    const endYear = this.getYearFromString(maxAbsoluteDate);

    const years = this.generateYearValues(startYear, endYear);

    return (
      <div className="c-legend-fires">
        <Select value={year} onChange={this.onChange} options={years} />
        <span>burned areas</span>
        <br />
        <span>from</span>
        <Datepicker
          className="-inline"
          date={moment(startDate < min ? min : startDate)}
          settings={{
            numberOfMonths: 1,
            minDate: min,
            maxDate: trim,
            isOutsideRange: d => d.isAfter(moment(trim)) || d.isBefore(moment(min)),
            hideKeyboardShortcutsPanel: true,
            noBorder: true,
            readOnly: true,
          }}
          onDateChange={date => this.onDateChange(date, 'startDate')}
        />
        <span>to</span>
        <Datepicker
          className="-inline"
          date={moment(trim || max)}
          settings={{
            numberOfMonths: 1,
            minDate: startDate,
            maxDate: max,
            isOutsideRange: d => d.isAfter(moment(max)) || d.isBefore(moment(startDate)),
            hideKeyboardShortcutsPanel: true,
            noBorder: true,
            readOnly: true,
          }}
          onDateChange={date => this.onDateChange(date, 'trimEndDate')}
        />
      </div>
    );
  }
}

export default LegendFiresComponent;
