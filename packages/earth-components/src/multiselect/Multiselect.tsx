/*
  Copyright 2018-2020 National Geographic Society

  Use of this software does not constitute endorsement by National Geographic
  Society (NGS). The NGS name and NGS logo may not be used for any purpose without
  written permission from NGS.

  Licensed under the Apache License, Version 2.0 (the "License"); you may not use
  this file except in compliance with the License. You may obtain a copy of the
  License at

      https://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed
  under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
  CONDITIONS OF ANY KIND, either express or implied. See the License for the
  specific language governing permissions and limitations under the License.
*/


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
