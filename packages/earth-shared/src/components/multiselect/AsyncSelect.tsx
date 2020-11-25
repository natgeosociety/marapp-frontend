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

import React, { useState } from 'react';
import classnames from 'classnames';

import { AsyncPaginate } from 'react-select-async-paginate';

import { CUSTOM_STYLES, SELECT_THEME } from '../../theme';

interface AsyncSelectProps {
  loadFunction: (query: { [key: string]: any }) => Promise<any>;
  type: string;
  selectedGroup: string;
  onChange?: (e: any) => void;
  value?: [] | string;
  className?: string;
}

const AsyncSelect = (props: AsyncSelectProps) => {
  const { loadFunction, type, selectedGroup, onChange, className, ...rest } = props;

  const [cursor, setCursor] = useState(-1);

  const loadOptions = async (search, prevOptions) => {
    const query = {
      search,
      sort: 'name',
      page: { size: 30, cursor },
      group: selectedGroup,
    };
    const response = await loadFunction(query);
    const { data, meta } = response;

    setCursor(meta.pagination.nextCursor);

    let filteredOptions = [];

    if (!search) {
      filteredOptions = [...filteredOptions, ...data];
    } else {
      filteredOptions = data;
    }

    const hasMore = !!meta.pagination.nextCursor;

    return {
      options: filteredOptions,
      hasMore,
    };
  };

  const shouldLoadMore = (scrollHeight, clientHeight, scrollTop) => {
    const bottomBorder = (scrollHeight - clientHeight) / 2;

    return bottomBorder < scrollTop;
  };

  return (
    <AsyncPaginate
      className={classnames('marapp-qa-asyncselect', className)}
      classNamePrefix="marapp-qa-asyncselect"
      placeholder={`Select ${type}`}
      loadOptions={loadOptions}
      shouldLoadMore={shouldLoadMore}
      onChange={(values) => onChange(values)}
      styles={CUSTOM_STYLES}
      theme={(theme) => ({
        ...theme,
        ...SELECT_THEME,
      })}
      {...rest}
    />
  );
};

export default AsyncSelect;
