import YearPickerLegendComponent from './component';
import { connect } from 'react-redux';
import { setLayerGroupCurrent, setLayerSettings } from 'modules/layers/actions';

export default connect(null, {
  setLayerSettings,
  setLayerGroupCurrent,
})(YearPickerLegendComponent);
