import * as React from 'react';
import './styles.scss';

import Select from 'react-select';
import { CUSTOM_STYLES, SELECT_THEME } from './model';

const MultiSelect = (props) => {
  return <Select {...props} styles={CUSTOM_STYLES}
                 theme={theme => ({
                   ...theme,
                   ...SELECT_THEME,
                 })}/>;
};

export default MultiSelect;
