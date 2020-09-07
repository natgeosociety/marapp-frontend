import * as React from 'react';

import { AuthzGuards } from 'auth/permissions';
import { useAuth0 } from 'auth/auth0';
import { ContentLayout } from 'layouts';
import { LinkWithOrg } from 'components';

export function OrganizationHome(props: any) {
  const { getPermissions } = useAuth0();
  const permissions = getPermissions(AuthzGuards.accessOrganizationsGuard);
  const writePermissions = getPermissions(AuthzGuards.accessOrganizationsGuard);

  return (writePermissions && (
    <ContentLayout className="marapp-qa-organizationhome">
      <div className="ng-flex ng-align-right">
        <LinkWithOrg className="ng-button ng-button-overlay" to="/organizations/new">
          add new organization
        </LinkWithOrg>
      </div>
    </ContentLayout>
  ));
}