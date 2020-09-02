import * as React from 'react';
import { useEffect, useState } from 'react';

import Select from 'react-select';
import { CUSTOM_STYLES, SELECT_THEME } from './model';

export const MultiSelect = React.forwardRef((props: any, ref: any) => {
  const [value, setValue] = useState();
  const [selectValues, setSelectValues] = useState();

  const handleChange = (values) => {
    !!values ?
      (props.isMulti ? setSelectValues(values.map(val => val.value)) : setSelectValues(values.value)) : setSelectValues(null);
    setValue(values);
  };

  useEffect(() => {
    props.onChange(selectValues);
  }, [selectValues]);

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
