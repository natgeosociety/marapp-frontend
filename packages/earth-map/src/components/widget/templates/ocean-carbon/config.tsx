import { replace } from 'components/widget/utils';

const MAGNITUDE_SYMBOLS = ['t', 'kt', 'Mt', 'Gt', 'Tt'];
const MAGNITUDE_WORDS = ['', 'thousand', 'million', 'billion', 'trillion'];

function formatValue(value, decimals = 2, symbols = MAGNITUDE_SYMBOLS) {
  if (value === 0) {
    return '0';
  }

  const k = 1000;
  const dm = decimals < 0 ? 0 : decimals;

  const i = Math.floor(Math.log(value) / Math.log(k));

  return parseFloat((value / Math.pow(k, i)).toFixed(dm)) + ' ' + symbols[i];
}

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

    const formattedValues = {
      total: formatValue(data.sum),
    };

    return {
      noData: !data.sum,
      chart: [],
      values: formattedValues,
      template: replace(
        sentence.default,
        {
          location: place.title,
          carbon_total_t: formatValue(data.carbon_total_t, 2, MAGNITUDE_WORDS),
        },
        {},
        {
          className: 'ng-text-weight-bold',
        }
      ),
      config: {},
    };
  },
};

export default CONFIG;
