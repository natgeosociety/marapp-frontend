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

import moment from 'moment';
import React from 'react';

import { Datepicker, Select } from '@marapp/earth-shared';

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
  public static propTypes = {};

  public generateYearValues = (start: number, end: number) => {
    let years = [];
    for (start; start <= end; start++) {
      years = [...years, ...[{ label: `${start}`, value: start }]];
    }

    return years.reverse();
  };

  public onChange = (value) => {
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
          startDate: moment.utc(startDate).year(value).format('YYYY-MM-DD'),
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

  public onDateChange = (value, who) => {
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

  public getYearFromString = (value: string) => {
    return moment(value, 'YYYY-MM-DD').year();
  };

  public render() {
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
      <div className="marapp-qa-legendfires c-legend-fires">
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
            isOutsideRange: (d) => d.isAfter(moment(trim)) || d.isBefore(moment(min)),
            hideKeyboardShortcutsPanel: true,
            noBorder: true,
            readOnly: true,
          }}
          onDateChange={(date) => this.onDateChange(date, 'startDate')}
        />
        <span>to</span>
        <Datepicker
          className="-inline"
          date={moment(trim || max)}
          settings={{
            numberOfMonths: 1,
            minDate: startDate,
            maxDate: max,
            isOutsideRange: (d) => d.isAfter(moment(max)) || d.isBefore(moment(startDate)),
            hideKeyboardShortcutsPanel: true,
            noBorder: true,
            readOnly: true,
          }}
          onDateChange={(date) => this.onDateChange(date, 'trimEndDate')}
        />
      </div>
    );
  }
}

export default LegendFiresComponent;
