import * as React from 'react';
import { LinkWithOrg } from '../../link-with-org';

interface UserListProps {
  categoryUrl?: string;
  item?: { id: string; name: string; email: string; groups: { name: string }[] };
}

const UserListItem = (props: UserListProps) => {
  const { categoryUrl, item } = props;

  return (
    <LinkWithOrg
      to={`/${categoryUrl}/${item.id}`}
      className="ng-c-data-link ng-display-block ng-padding-medium-horizontal ng-padding-vertical"
    >
      <span className="ng-text-edit-s ng-margin-remove">{item.name}</span>
      <span className="ng-display-block">{item.email}</span>
      <span className="ng-display-block">{item.groups.map((group) => group.name).join(', ')}</span>
    </LinkWithOrg>
  );
};

export default UserListItem;
