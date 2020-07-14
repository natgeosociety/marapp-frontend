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
import Fuse from 'fuse.js';

interface IFilter {
  children?: any;
  filter?: string;
  items?: [];
  keys?: [] | string[];
}

class FilterComponent extends React.Component<IFilter, any> {
  private fuse: any;

  constructor(props) {
    super(props);

    const { items, keys } = props;

    this.fuse = new Fuse(items, {
      shouldSort: true,
      threshold: 0.4,
      location: 0,
      distance: 100,
      maxPatternLength: 32,
      minMatchCharLength: 1,
      keys,
    });
  }

  public static defaultProps = {
    items: [],
    keys: [],
    filter: '',
  };

  render() {
    const { filter, items } = this.props;
    const filteredItems = filter && filter.length > 0 ? this.fuse.search(filter) : items;
    return this.props.children({ items: filteredItems });
  }
}

export default FilterComponent;
