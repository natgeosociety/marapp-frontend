import findLast from 'lodash/findLast';

// Utils
import { replace } from 'components/widget/utils';

const FAKE_DATA = {
  value: 16,
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

    const { sentence } = widgetConfig;

    const value = FAKE_DATA.value;
    const categories = [
      {
        label: 'very low',
        threshold: 0,
        color: '#0b4981',
      },
      {
        label: 'low',
        threshold: 5,
        color: '#2a6986',
      },
      {
        label: 'moderate',
        threshold: 10,
        color: '#398b8a',
      },
      {
        label: 'high',
        threshold: 15,
        color: '#41ae8e',
      },
      {
        label: 'very high',
        threshold: 20,
        color: '#44d290',
      },
    ];

    const category = findLast(categories, c => value >= c.threshold) || categories[0];

    return {
      chart: categories.map(c => ({
        ...c,
        selected: category.threshold === c.threshold,
      })),
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
      config: {},
    };
  },
};

export default CONFIG;
