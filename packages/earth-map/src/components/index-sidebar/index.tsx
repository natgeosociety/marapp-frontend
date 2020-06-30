import { connect } from 'react-redux';
import { setIndexesSelected } from 'modules/indexes/actions';

import SidebarComponent from './component';
import { setSidebarOpen } from '../../modules/sidebar/actions';

export default connect(
  (state: any) => ({
    ...state.indexes,
    ...state.sidebar,
  }),
  { setIndexesSelected, setSidebarOpen }
)(SidebarComponent);
