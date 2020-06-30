import moment from 'moment';

export const getParams = (config = [], params = {}) => {
  const defaultParams = config.reduce((acc, v) => {
    let value;

    const key = v.key;
    value = key.includes('REACT_APP') ? process.env[key] : v.default;

    if (v.key_params) {
      value = v.key_params.reduce((acc_2, v_2) => {
        const key2 = v_2.key;
        const value2 = key2.includes('REACT_APP') ? process.env[key] : v_2.default;

        return {
          [key2]: value2,
        };
      }, {});
    }

    return {
      ...acc,
      [key]: value,
    };
  }, {});

  const newParams = {
    ...defaultParams,
    ...params,
  };

  const { startDate: start, endDate, trimEndDate, maxAbsoluteDate } = newParams;

  const end = endDate > maxAbsoluteDate ? maxAbsoluteDate : endDate;
  const trim = trimEndDate > maxAbsoluteDate ? maxAbsoluteDate : trimEndDate;

  return {
    ...newParams,
    ...(!!start && {
      startYear: moment(start).year(),
      startMonth: moment(start).month(),
      startDay: moment(start).dayOfYear(),
    }),
    ...(!!endDate && {
      endYear: moment(end).year(),
      endMonth: moment(end).month(),
      endDay: moment(end).dayOfYear(),
    }),
    ...(!!trimEndDate && {
      trimEndYear: moment(trim).year(),
      trimEndMonth: moment(trim).month(),
      trimEndDay: moment(trim).dayOfYear(),
    }),
  };
};
