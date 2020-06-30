import YearDatePickerLegendComponent from './component';
import { connect } from 'react-redux';
import { setLayerSettings, setLayerTimelineCurrent } from 'modules/layers/actions';

export default connect(null, {
  setLayerSettings,
  setLayerTimelineCurrent,
})(YearDatePickerLegendComponent);
