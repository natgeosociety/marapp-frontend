import OrgSwitcher from './component';
import { connect } from 'react-redux';
import { setUserGroup } from 'modules/user/actions';
import { resetPlacesFeatured, setPlacesSearch, resetPlace} from 'modules/places/actions';
import { resetLayerCache } from 'modules/layers/actions';
import { resetMap } from 'modules/map/actions';
import { setIndexesSelected } from 'modules/indexes/actions';

export default connect(
  (state: any) => ({
    ...state.user,
    ...state.sidebar,
  }),
  {
    setUserGroup,
    setPlacesSearch,
    resetPlace,
    resetPlacesFeatured,
    resetLayerCache,
    resetMap,
    setIndexesSelected,
  }
)(OrgSwitcher);
