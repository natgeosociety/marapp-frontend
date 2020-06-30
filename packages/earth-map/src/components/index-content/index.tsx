import { connect } from 'react-redux';

// Components
import IndexContentComponent from './component';

export default connect((state: any) => ({
  ...state.indexes,
  place: state.places.data,
  widgets: state.widgets.list,
  loading: state.places.loading,
  metricsLoading: state.places.loading,
  widgetsLoading: state.widgets.loading,
}))(IndexContentComponent);
