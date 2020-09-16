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

import { getParams } from 'modules/layers/utils';
import moment from 'moment';
import React, { useEffect, useState } from 'react';

import { Datepicker, Select } from '@marapp/earth-shared';

import './styles.scss';

interface ILegendYearDatePicker {
  activeLayer: {
    slug: any;
    params: any;
    decodeParams: any;
    timelineParams: any;
    source: any;
  };
  setLayerSettings: (values: any) => void;
  setLayerTimelineCurrent: (values: any) => void;
  layers: any;
  references: any;
}

interface ISelectedLayer {
  id?: string;
  paramsConfig?: { year?: string };
  decodeConfig?: { values: any };
  source?: any;
}

const YearDatePickerLegendComponent = (props: ILegendYearDatePicker) => {
  const [selectedLayer, setSelectedLayer] = useState<ISelectedLayer>();
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [decodeValues, setDecodeValues] = useState({} as any);

  const { layers, activeLayer } = props;

  const { references } = layers[0];

  const options = references.map((y) => {
    return {
      label: y.name,
      value: y.id,
    };
  });

  useEffect(() => {
    setSelectedLayer(references[0]);
  }, [references]);

  useEffect(() => {
    const { decodeParams } = activeLayer;

    decodeParams &&
      decodeParams.startDate &&
      decodeParams.startDate !== startDate &&
      setStartDate(decodeParams.startDate);

    decodeParams &&
      decodeParams.trimEndDate &&
      decodeParams.trimEndDate !== endDate &&
      setEndDate(decodeParams.trimEndDate);
  }, [activeLayer.decodeParams]);

  useEffect(() => {
    const { activeLayer, setLayerTimelineCurrent } = props;

    if (!!selectedLayer) {
      const { slug } = activeLayer;

      const { paramsConfig, decodeConfig } = selectedLayer;

      setLayerTimelineCurrent({
        slug,
        current: selectedLayer.id,
        year: parseInt(paramsConfig[0].year, 10),
        settings: selectedLayer,
      });

      const decodedValues = getParams(decodeConfig.values, {});

      setDecodeValues(decodedValues);
      setStartDate(decodedValues.startDate);
      setEndDate(decodedValues.endDate);
    }
  }, [selectedLayer]);

  const onChange = (value) => {
    setSelectedLayer(references.filter((ref) => ref.id === value)[0]);
  };

  const onDateChange = (value, who) => {
    const { activeLayer, setLayerTimelineCurrent } = props;

    const { slug, decodeParams } = activeLayer;

    const { paramsConfig, source } = selectedLayer;

    setLayerTimelineCurrent({
      slug,

      current: selectedLayer.id,

      year: parseInt(paramsConfig[0].year, 10),
      settings: {
        ...source,
        ...{
          decodeConfig: {
            ...decodeParams,
            [who]: moment(value).format('YYYY-MM-DD'),
            ...(who === 'trimEndDate' && {
              endDate: moment(value).format('YYYY-MM-DD'),
            }),
          },
        },
      },
    });
  };

  return (
    !!startDate && (
      <div className="marapp-qa-legendyeardate c-legend-year-date">
        <Select onChange={(e) => onChange(e)} options={options} />
        <br />

        {!!startDate && (
          <Datepicker
            className="-inline"
            date={moment(startDate)}
            settings={{
              numberOfMonths: 1,
              minDate: startDate < decodeValues.startDate ? startDate : decodeValues.startDate,
              maxDate: decodeValues.endDate,
              isOutsideRange: (d) => d.isBefore(moment(startDate)),
              hideKeyboardShortcutsPanel: true,
              noBorder: true,
              readOnly: true,
            }}
            onDateChange={(date) => onDateChange(date, 'startDate')}
          />
        )}
        <span>to</span>
        {!!endDate && (
          <Datepicker
            className="-inline"
            date={moment(endDate)}
            settings={{
              numberOfMonths: 1,
              minDate: decodeValues.startDate,
              maxDate: endDate > decodeValues.endDate ? endDate : decodeValues.endDate,
              isOutsideRange: (d) => d.isAfter(moment(endDate)) || d.isBefore(moment(startDate)),
              hideKeyboardShortcutsPanel: true,
              noBorder: true,
              readOnly: true,
            }}
            onDateChange={(date) => onDateChange(date, 'trimEndDate')}
          />
        )}
      </div>
    )
  );
};

export default YearDatePickerLegendComponent;
