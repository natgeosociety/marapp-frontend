import { setIndexesSelected } from 'modules/indexes/actions';
import { setLayersActive } from 'modules/layers/actions';
import { setUserGroup } from 'modules/user/actions';

export const URL_PROPS = [
  {
    type: 'string',
    value: 'dashboards',
    redux: 'indexes.selected',
    action: setIndexesSelected,
    required: false,
  },
  {
    type: 'array',
    value: 'layers',
    redux: 'layers.active',
    action: setLayersActive,
    required: false,
  },
  {
    type: 'string',
    value: 'org',
    redux: 'user.group',
    action: setUserGroup,
    required: false,
  }
];

export default {
  URL_PROPS,
};
