import * as React from 'react';
import { useEffect, useState } from 'react';

import Select from 'react-select';
import { CUSTOM_STYLES, SELECT_THEME } from './model';

interface MultiselectProps {
  isMulti?: boolean;
  onChange?: (e: any) => void;
}

const MultiSelect = React.forwardRef((props: MultiselectProps, ref: any) => {
  const [value, setValue] = useState();
  const [selectValues, setSelectValues] = useState();

  const handleSelectValues = (values) => {
    setSelectValues(props.isMulti ?  values.map(val => val.value) : values.value);
  };

  const handleChange = (values) => {
    !!values ? handleSelectValues(values) : setSelectValues(null);
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
