import { connect } from 'react-redux';
import { toggleLayer } from 'modules/layers/actions';
import { setSidebarInfo } from 'modules/sidebar/actions';
import { getWidgets } from 'modules/widgets/selectors';

import WidgetsComponent from './component';

export default connect(
  (state: any, props) => {
    return {
      ...state.router,
      ...state.sidebar,
      ...state.layers,

      metrics: state.metrics.metrics, // todo
      place: state.places.data,
      list: getWidgets(state, props),
      groups: state.user.group,
    };
  },
  { setSidebarInfo, toggleLayer }
)(WidgetsComponent);
