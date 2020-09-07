import * as React from 'react';
import { useEffect, useState } from 'react';
import classnames from 'classnames';

import Select from 'react-select';
import { CUSTOM_STYLES, SELECT_THEME } from './model';


interface MultiselectProps {
  isMulti?: boolean;
  onChange?: (e: any) => void;
  className?: string;
}

const MultiSelect = React.forwardRef((props: MultiselectProps, ref: any) => {

  const {className, isMulti, onChange, ...rest} = props;
  const [value, setValue] = useState();
  const [selectValues, setSelectValues] = useState();

  const handleSelectValues = (values) => {
    setSelectValues(isMulti ? values.map(val => val.value) : values.value);
  };

  const handleChange = (values) => {
    !!values ? handleSelectValues(values) : setSelectValues(null);
    setValue(values);
  };

  useEffect(() => {
    onChange(selectValues);
  }, [selectValues]);

  return <Select
    className={classnames('marapp-qa-multiselect', className)}
    ref={ref}
    value={value}
    styles={CUSTOM_STYLES}
    onChange={handleChange}
    theme={theme => ({
      ...theme,
      ...SELECT_THEME,
    })} {...rest}/>;
});

export default MultiSelect;
