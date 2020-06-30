import { connect } from 'react-redux';

import ErrorPageComponent from './component';

export default connect(
  null,
  (dispatch) => ({
    resetStore: () => dispatch({ type: 'GLOBAL/resetStore' })
  }))(ErrorPageComponent);
