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
