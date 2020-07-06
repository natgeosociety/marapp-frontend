import { connect } from 'react-redux';
import SidebarLayoutSearch from './component';

export default connect(
  (state: any) => ({
    ...state.indexes,
    ...state.sidebar,
  })
)(SidebarLayoutSearch);
