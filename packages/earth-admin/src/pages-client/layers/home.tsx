import * as React from 'react';

import { useAuth0 } from 'auth/auth0';
import { AuthzGuards } from 'auth/permissions';

import { ContentLayout } from 'layouts';
import { Card, LinkWithOrg } from 'components';

export function LayersHome(props: any) {
  const { getPermissions } = useAuth0();
  const permissions = getPermissions(AuthzGuards.accessLayersGuard);
  const writePermissions = getPermissions(AuthzGuards.writeLayersGuard);

  return (writePermissions && (
    <ContentLayout className="marapp-qa-layershome">
      {writePermissions && (
        <>
          <h1 className="ng-text-display-m ng-margin-medium-bottom">Layers</h1>
          <div className="ng-grid">
            <div className="ng-width-1-2">
              <Card>
                <p>Search a layer to view and edit details, or start creating a new layer.</p>
                <div className="ng-flex ng-flex-center">
                  <LinkWithOrg className="marapp-qa-actioncreate ng-button ng-button-secondary" to="layers/new">
                    Create new layer
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
