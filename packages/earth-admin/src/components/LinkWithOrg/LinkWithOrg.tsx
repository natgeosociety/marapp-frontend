import * as React from 'react';
import { Link } from 'gatsby';

import { Auth0Context } from 'utils/contexts';

interface IProps {
  to: string;
  switchOrgTo?: string;
  [propName: string]: any;
}

export const LinkWithOrg = ({ to, switchOrgTo, ...rest }: IProps) => {
  const { selectedGroup } = React.useContext(Auth0Context);
  const finalLink = switchOrgTo
    ? `/${switchOrgTo}/${to}`
    : `/${selectedGroup}/${to}`

  return <Link {...rest} to={finalLink} />
}