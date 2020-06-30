import { connect } from 'react-redux';

import NotFoundComponent from './component';

export default connect(
  null,
  (dispatch) => ({
    resetStore: () => dispatch({ type: 'GLOBAL/resetStore' })
  }))(NotFoundComponent);
