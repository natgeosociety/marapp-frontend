import { connect } from 'react-redux';

// Components
import FullscreenComponent from './component';

export default connect((state: any) => ({
  ...state.fullscreen,
}))(FullscreenComponent);
