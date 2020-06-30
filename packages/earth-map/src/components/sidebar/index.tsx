import { connect } from 'react-redux';
import { setSidebarPanel, setSidebarOpen } from 'modules/sidebar/actions';

import SidebarComponent from './component';

export default connect(
  (state: any) => ({
    ...state.sidebar,
    ...state.indexes,
  }),
  { setSidebarPanel, setSidebarOpen }
)(SidebarComponent);
