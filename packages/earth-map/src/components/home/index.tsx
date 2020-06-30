// Components
import { connect } from 'react-redux';
import HomeComponent from './component';

import { setRouter } from 'modules/router/actions';

export default connect(
  (state: any) => ({
    placeId: state.places.selectedId,
    featured: state.places.cache.featured,
  }),
  { setRouter }
)(HomeComponent);
