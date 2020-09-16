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
import { encodeQueryToURL } from '../../utils';

interface AsyncSelectProps {
  loadFunction: (q: string) => void;
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
      search: search,
      sort: 'name',
      page: { size: 10, cursor: cursor },
      group: selectedGroup,
    };
    const encodedQuery = encodeQueryToURL(type, query);
    const res: any = await loadFunction(encodedQuery);
    const data = res.data;

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

  return (
    <AsyncPaginate
      className={classnames('marapp-qa-asyncselect', className)}
      placeholder={`Select ${type}`}
      loadOptions={loadOptions}
      shouldLoadMore={shouldLoadMore}
      onChange={(values) => onChange(values)}
      {...rest}
    />
  );
};

export default AsyncSelect;
