import { connect } from 'react-redux';

import { setPlacesSearch } from 'modules/places/actions';
import { setIndexesSelected } from 'modules/indexes/actions';

import ListItem from './component';

export default connect((state: any) => ({
  list: state.indexes.list,
  }), {
    setPlacesSearch,
    setIndexesSelected,
  }
)(ListItem);