import { redirect } from 'redux-first-router';
import { connect } from 'react-redux';

import AuthorizedPage from './component';

export default connect(null, { redirect })(AuthorizedPage);
