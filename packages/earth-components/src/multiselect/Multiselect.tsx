import * as React from 'react';
import './styles.scss';

import Select from 'react-select';
import { CUSTOM_STYLES, SELECT_THEME } from './model';

// export const MultiSelect = React.forwardRef((props: any, ref: any) => {
const MultiSelect = (props) => {
  console.log(props);

  const handleChange = (values) => {
    props.onChange && props.onChange(values);
  };

  return <Select {...props}
                 //value={props.options.filter(option => option.value === props.value)}
                 styles={CUSTOM_STYLES}
                 onChange={handleChange}
                 theme={theme => ({
                   ...theme,
                   ...SELECT_THEME,
                 })}/>;
};

export default MultiSelect;
