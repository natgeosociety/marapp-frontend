import * as React from 'react';
import { useState } from 'react';

import Select from 'react-select';
import { CUSTOM_STYLES, SELECT_THEME } from './model';

export const MultiSelect = React.forwardRef((props: any, ref: any) => {
  const [value, setValue] = useState();

  const handleChange = (values) => {
    props.onChange &&
    props.isMulti ? props.onChange(values.map(val => val.value)) : props.onChange(values.value);
    setValue(values);
  };

  return <Select {...props}
                 ref={ref}
                 value={value}
                 styles={CUSTOM_STYLES}
                 onChange={handleChange}
                 theme={theme => ({
                   ...theme,
                   ...SELECT_THEME,
                 })}/>;
});

export default MultiSelect;
