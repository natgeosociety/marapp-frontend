import { connect } from 'react-redux';
import { setSidebarPanel } from 'modules/sidebar/actions';
import { setIndexesList, setIndexesSelected } from 'modules/indexes/actions';
import { setPlacesSearch } from 'modules/places/actions';

import FeaturedPlacesComponent from './component';

export default connect(
  (state: any) => ({
    list: state.indexes.list,
    featured: state.places.cache.featured,
    group: state.user.group,
  }),
  { setSidebarPanel, setIndexesSelected, setIndexesList, setPlacesSearch }
)(FeaturedPlacesComponent);
