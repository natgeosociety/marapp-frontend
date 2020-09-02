import * as React from 'react';
import { useState } from 'react';

import { AsyncPaginate } from 'react-select-async-paginate';
import { encodeQueryToURL } from '../utils';

import { SELECT_THEME, CUSTOM_STYLES } from './model';

interface AsyncSelectProps {
  loadFunction: (q: string) => void,
  type: string,
  selectedGroup: string
  onChange: (e: any) => void;
  isMulti: boolean
  value: [] | string
}

const AsyncSelect = (props: AsyncSelectProps) => {
  const {loadFunction, type, selectedGroup, value, ...rest} = props;

  const [cursor, setCursor] = useState(-1);

  const formatForSelect = (data) => data.map(d => ({value: d.id, label: d.name}));

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
    props.onChange &&
    props.isMulti ? props.onChange(values.map(val => val.value)) : props.onChange(values.value);
  };

  return (<AsyncPaginate
    value={value}
    placeholder={`Select ${type}`}
    loadOptions={loadOptions}
    shouldLoadMore={shouldLoadMore}
    onChange={handleChange}
    closeMenuOnSelect={false}
    isMulti
    isSearchable
    styles={CUSTOM_STYLES}
    theme={theme => ({
      ...theme,
      ...SELECT_THEME,
    })}
  />);
};


export default AsyncSelect;
