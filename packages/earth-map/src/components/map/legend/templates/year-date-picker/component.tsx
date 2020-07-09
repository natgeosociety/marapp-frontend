import * as React from 'react';
import {useEffect, useState} from 'react';
import moment from 'moment';

import {Select, Datepicker} from '@marapp/earth-components';

import {getParams} from 'modules/layers/utils';

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
  decodeConfig?: { values: any }
  source?: any;
}

const YearDatePickerLegendComponent = (props: ILegendYearDatePicker) => {
  const [selectedLayer, setSelectedLayer] = useState<ISelectedLayer>();
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [decodeValues, setDecodeValues] = useState({} as any);

  const {layers, activeLayer} = props;

  const {references} = layers[0];

  const options = references.map(y => {
    return {
      label: y.name,
      value: y.id,
    };
  });

  useEffect(() => {
    setSelectedLayer(references[0]);
  }, [references]);

  useEffect(() => {
    const {decodeParams} = activeLayer;

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
    const {activeLayer, setLayerTimelineCurrent} = props;

    if (!!selectedLayer) {
      const {slug} = activeLayer;

      const {
        paramsConfig,
        decodeConfig
      } = selectedLayer;


      setLayerTimelineCurrent({
        slug,
        current: selectedLayer.id,
        year: parseInt(paramsConfig[0].year),
        settings: selectedLayer
      });

      const decodedValues = getParams(decodeConfig.values, {});

      setDecodeValues(decodedValues);
      setStartDate(decodedValues.startDate);
      setEndDate(decodedValues.endDate);
    }
  }, [selectedLayer]);

  const onChange = value => {
    setSelectedLayer(references.filter(ref => ref.id === value)[0]);
  };

  const onDateChange = (value, who) => {
    const {activeLayer, setLayerTimelineCurrent} = props;

    const {slug, decodeParams} = activeLayer;

    const {
      paramsConfig,
      source
    } = selectedLayer;

    setLayerTimelineCurrent({
      slug,

      current: selectedLayer.id,

      year: parseInt(paramsConfig[0].year),
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
      <div className="c-legend-year-date">
        <Select onChange={e => onChange(e)} options={options}/>
        <br/>

        {!!startDate && (
          <Datepicker
            className="-inline"
            date={moment(startDate)}
            settings={{
              numberOfMonths: 1,
              minDate: startDate < decodeValues.startDate ? startDate : decodeValues.startDate,
              maxDate: decodeValues.endDate,
              isOutsideRange: d => d.isBefore(moment(startDate)),
              hideKeyboardShortcutsPanel: true,
              noBorder: true,
              readOnly: true,
            }}
            onDateChange={date => onDateChange(date, 'startDate')}
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
              isOutsideRange: d => d.isAfter(moment(endDate)) || d.isBefore(moment(startDate)),
              hideKeyboardShortcutsPanel: true,
              noBorder: true,
              readOnly: true,
            }}
            onDateChange={date => onDateChange(date, 'trimEndDate')}
          />
        )}
      </div>
    )
  );
};

export default YearDatePickerLegendComponent;
