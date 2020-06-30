import { connect } from 'react-redux';
import MainComponent from './component';

export default connect((state: any) => ({
  router: state.router,
}))(MainComponent);
