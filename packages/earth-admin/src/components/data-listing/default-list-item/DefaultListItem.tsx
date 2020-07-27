import * as React from 'react';
import { LinkWithOrg } from 'components/link-with-org';

interface DataListProps {
  categoryUrl?: string;
  item?: { name: string; id: string; slug: string };
}

const DefaultListItem = (props: DataListProps) => {
  const { categoryUrl, item } = props;

  return (
    <LinkWithOrg
      to={`/${categoryUrl}/${item.id}`}
      //todo add ng-data-link-selected
      className="ng-data-link ng-display-block ng-padding-medium-horizontal ng-padding-small-vertical"
    >
      <p className="ng-margin-remove ng-color-ultraltgray">{item.name}</p>
      <span className="ng-display-block ng-color-mdgray">{item.slug}</span>
    </LinkWithOrg>
  );
};

export default DefaultListItem;
