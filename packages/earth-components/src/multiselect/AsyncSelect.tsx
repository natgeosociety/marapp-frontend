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

import { AsyncPaginate } from 'react-select-async-paginate';
import { encodeQueryToURL } from '../utils';

import { SELECT_THEME, CUSTOM_STYLES } from './model';


interface AsyncSelectProps {
  loadFunction: (q: string) => void;
  type: string;
  selectedGroup: string;
  onChange?: (e: any) => void;
  isMulti?: boolean;
  value?: [] | string;
  className?: string;
}

const AsyncSelect = (props: AsyncSelectProps) => {
  const {loadFunction, type, selectedGroup, layers, onChange, isMulti, className, ...rest} = props;

  console.log(props);



  // useEffect(() => {
  //   console.log(value);
  //   !!value && setCoco(formatForSelect(value))
  // }, [value])

  const [cursor, setCursor] = useState(-1);
  const [selectValues, setSelectValues] = useState();

  const formatForSelect = (data) => data.map(d => ({value: d.id, label: d.name}));

  const [coco, setCoco] = useState(formatForSelect(layers));

  const handleSelectValues = (values) => {
    setSelectValues(isMulti ? values.map(val => val.value) : values.value);
  };

  const loadOptions = async (search, prevOptions) => {
    const query = {
        search: search,
        sort: 'name',
        page: {size: 10, cursor: cursor},
        group: selectedGroup,
      },
      encodedQuery = encodeQueryToURL(type, query),
      res: any = await loadFunction(encodedQuery),
      data = formatForSelect(res.data);

    setCursor(res.pagination.nextCursor);

    let filteredOptions = [];

    if (!search) {
      filteredOptions = [...filteredOptions, ...data];
    } else {
      filteredOptions = data;
    }

    const hasMore = !!res.pagination.nextCursor;

    return {
      options: filteredOptions,
      hasMore,
    };
  };

  const shouldLoadMore = (scrollHeight, clientHeight, scrollTop) => {
    const bottomBorder = (scrollHeight - clientHeight) / 2;

    return bottomBorder < scrollTop;
  };

  const handleChange = (values) => {
    !!values ? handleSelectValues(values) : setSelectValues(null);
  };

  useEffect(() => {
    console.log(selectValues, 'selecty');
    !!selectValues && onChange(selectValues);
  }, [selectValues]);


  return (<AsyncPaginate
    className={classnames('marapp-qa-asyncselect', className)}
    value={coco}
    isMulti={isMulti}
    placeholder={`Select ${type}`}
    loadOptions={loadOptions}
    shouldLoadMore={shouldLoadMore}
    onChange={handleChange}
    styles={CUSTOM_STYLES}
    theme={theme => ({
      ...theme,
      ...SELECT_THEME,
    })} {...rest}
  />);
};


export default AsyncSelect;
