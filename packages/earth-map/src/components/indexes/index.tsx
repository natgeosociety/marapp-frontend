import { connect } from 'react-redux';

import { setIndexesSelected } from 'modules/indexes/actions';

// Components
import IndexesComponent from './component';

export default connect(
  (state: any) => ({
    ...state.places,
    ...state.indexes,
  }),
  { setIndexesSelected }
)(IndexesComponent);
