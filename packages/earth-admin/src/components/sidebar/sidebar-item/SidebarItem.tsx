import React, { useContext, useEffect, useState } from 'react';
import { Auth0Context } from 'utils/contexts';
import { LinkWithOrg } from 'components/LinkWithOrg';

export default function SidebarItem(props) {
  const [itemPermission, setItemPermission] = useState(false);
  const { item } = props;
  const { getPermissions, selectedGroup } = useContext(Auth0Context);

  useEffect(() => {
    setItemPermission(getPermissions(item.guard));
  }, [item, selectedGroup]);

  return (
    itemPermission && (
      <LinkWithOrg
        to={item.url}
        state={{ refresh: true }}
        key={item.key}
        className="ng-side-menu-item ng-text-display-s ng-padding-vertical ng-padding-medium-horizontal"
      >
        {item.key}
      </LinkWithOrg>
    )
  );
}
