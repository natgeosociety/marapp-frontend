import * as React from 'react';

import { useAuth0 } from 'auth/auth0';
import { AuthzGuards } from 'auth/permissions';

import { ContentLayout } from 'layouts';
import { InlineEditCard, LinkWithOrg } from 'components';

export default function HomePage(props: any) {
  const { getPermissions } = useAuth0();
  const permissions = getPermissions(AuthzGuards.accessPlacesGuard);
  const writePermissions = getPermissions(AuthzGuards.writePlacesGuard);

  return (writePermissions && (
    <ContentLayout>
      {writePermissions && (
        <>
          <h1 className="ng-text-display-m ng-margin-medium-bottom">PLACES</h1>
          <div className="ng-grid">
            <div className="ng-width-1-2">
              <InlineEditCard>
                <p>Search a place to view and edit details, or start creating a new place.</p>
                <div className="ng-flex ng-flex-center">
                  <LinkWithOrg className="ng-button ng-button-secondary" to="/places/new">
                    Create new place
              </LinkWithOrg>
                </div>
              </InlineEditCard>
            </div>
          </div>
        </>
      )}
    </ContentLayout>
  ));
}