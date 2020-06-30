import compact from 'lodash/compact';
import { createSelector } from 'reselect';
import { IWidget } from '../widget/model';

const place = (state, props) => props.place;
const slugs = (state, props) => props.slugs;
const widgets = (state) => state.widgets.list;
const activeLayers = (state) => state.layers.active;

export const getWidgets = createSelector(
  [place, slugs, widgets, activeLayers],
  (_place, _slugs, _widgets, _activeLayers) => {
    if (!_widgets) {
      return [];
    }

    const filteredWidgets = compact(
      _widgets.filter((w) => {
        if (typeof _slugs !== 'undefined') {
          const { widgetConfig, slug } = w;
          const { location_types } = widgetConfig;

          const thereIsSlug = !!_slugs.find((s) => s.slug === slug);
          const thereIsLocationType =
            !!location_types && Array.isArray(location_types)
              ? location_types.includes(_place.locationType.toLowerCase())
              : true;
          return thereIsSlug && thereIsLocationType;
        }

        return false;
      })
    );

    return [...filteredWidgets].map((w: IWidget) => {
      const { widgetConfig, description } = w;

      return {
        ...w,
        ...widgetConfig,
        slug: w.slug,
        description,

        active: !!_activeLayers.find((l) => w.layers[0] && l === w.layers[0].slug),
        params: {
          id: _place.id,
        },
      };
    });
  }
);

export default { getWidgets };
