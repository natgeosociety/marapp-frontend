import * as React from 'react';
import classnames from 'classnames';

import { LinkWithOrg } from 'components/link-with-org';

interface DataListProps {
  categoryUrl?: string;
  item?: { name: string; id: string; slug: string };
  selectedItem: string;
}

const DefaultListItem = (props: DataListProps) => {
  const { categoryUrl, item, selectedItem } = props;


  return (
    <LinkWithOrg
      to={`/${categoryUrl}/${item.id}`}
      className={classnames({
        'ng-data-link ng-display-block ng-padding-medium-horizontal ng-padding-small-vertical': true,
        'ng-data-link-selected': selectedItem === item.id
      })}>
      <p className="ng-margin-remove ng-color-ultraltgray">{item.name}</p>
      <span className="ng-display-block ng-color-mdgray">{item.slug}</span>
    </LinkWithOrg>
  );
};

export default DefaultListItem;
