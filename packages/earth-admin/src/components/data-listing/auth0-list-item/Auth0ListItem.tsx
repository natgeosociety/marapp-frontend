import * as React from 'react';
import { LinkWithOrg } from '../../link-with-org';

interface Auth0ListProps {
  categoryUrl?: string;
  item?: { id: string; name: string; email: string; groups: { name: string }[] };
}

const Auth0ListItem = (props: Auth0ListProps) => {
  const { categoryUrl, item } = props;

  return (
    <LinkWithOrg
      to={`/${categoryUrl}/${item.id}`}
      className="ng-data-link ng-display-block ng-padding-medium-horizontal ng-padding-small-vertical"
    >
      <p className="ng-margin-remove ng-color-ultraltgray">{item.name}</p>
      {!!item.groups && <span className="ng-display-block ng-color-mdgray">{item.groups.map((group) => group.name).join(', ')}</span>}
    </LinkWithOrg>
  );
};

export default Auth0ListItem;
