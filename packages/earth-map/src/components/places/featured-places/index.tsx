import { connect } from 'react-redux';
import { setSidebarPanel } from 'modules/sidebar/actions';
import { setIndexesList, setIndexesSelected } from 'modules/indexes/actions';
import { setPlacesSearch } from 'modules/places/actions';

import FeaturedPlacesComponent from './component';

export default connect(
  (state: any) => ({
    featured: state.places.cache.featured,
    group: state.user.group,
  }),
  { setSidebarPanel, setIndexesList }
)(FeaturedPlacesComponent);
