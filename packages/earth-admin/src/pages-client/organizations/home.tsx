import * as React from 'react';

import { AuthzGuards } from 'auth/permissions';
import { useAuth0 } from 'auth/auth0';
import { ContentLayout } from 'layouts';
import { LinkWithOrg, Card } from 'components';

export function OrganizationHome() {
  const { getPermissions } = useAuth0();
  const permissions = getPermissions(AuthzGuards.accessOrganizationsGuard);
  const writePermissions = getPermissions(AuthzGuards.accessOrganizationsGuard);

  return (writePermissions && (
    <ContentLayout className="marapp-qa-organizationhome">
      {writePermissions && (
        <>
          <h1 className="ng-text-display-m ng-margin-medium-bottom">ORGANIZATIONS</h1>
          <div className="ng-grid">
            <div className="ng-width-1-2">
              <Card>
                <p>Start creating a new organization for users to collaborate and share with each other</p>
                <div className="ng-flex ng-flex-center">
                  <LinkWithOrg className="marapp-qa-actioncreate ng-button ng-button-secondary" to="organizations/new">
                    Create new Organization
                  </LinkWithOrg>
                </div>
              </Card>
            </div>
          </div>
        </>
      )}
    </ContentLayout>
  ));
}