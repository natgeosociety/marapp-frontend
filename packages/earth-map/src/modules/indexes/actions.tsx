import { createAction } from 'vizzuality-redux-tools';

export const setIndexes = createAction('INDEXES/setIndexes');
export const setIndexesList = createAction('INDEXES/setIndexesList');
export const setIndexesSelected = createAction('INDEXES/setIndexesSelected');

export default { setIndexes, setIndexesList, setIndexesSelected };
