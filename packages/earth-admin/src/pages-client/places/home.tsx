import { AuthzGuards } from '@marapp/earth-shared';
import { useAuth0 } from 'auth/auth0';
import { Card } from 'components/card';
import { LinkWithOrg } from 'components/link-with-org';
import { ContentLayout } from 'layouts';
import React from 'react';

export function PlacesHome(props: any) {
  const { getPermissions } = useAuth0();
  const permissions = getPermissions(AuthzGuards.accessPlacesGuard);
  const writePermissions = getPermissions(AuthzGuards.writePlacesGuard);

  return (
    writePermissions && (
      <ContentLayout className="marapp-qa-placeshome">
        {writePermissions && (
          <>
            <h1 className="ng-text-display-m ng-margin-medium-bottom">PLACES</h1>
            <div className="ng-grid">
              <div className="ng-width-1-2">
                <Card>
                  <p>Search a place to view and edit details, or start creating a new place.</p>
                  <div className="ng-flex ng-flex-center">
                    <LinkWithOrg
                      className="marapp-qa-actioncreate ng-button ng-button-secondary"
                      to="places/new"
                    >
                      Create new place
                    </LinkWithOrg>
                  </div>
                </Card>
              </div>
            </div>
          </>
        )}
      </ContentLayout>
    )
  );
}
