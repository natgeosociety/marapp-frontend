/*
  Copyright 2018-2020 National Geographic Society

  Use of this software does not constitute endorsement by National Geographic
  Society (NGS). The NGS name and NGS logo may not be used for any purpose without
  written permission from NGS.

  Licensed under the Apache License, Version 2.0 (the "License"); you may not use
  this file except in compliance with the License. You may obtain a copy of the
  License at

      https://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed
  under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
  CONDITIONS OF ANY KIND, either express or implied. See the License for the
  specific language governing permissions and limitations under the License.
*/

import React from 'react';

import { AuthzGuards } from '@marapp/earth-shared';

import { useAuth0 } from '@app/auth/auth0';
import { Card } from '@app/components/card';
import { LinkWithOrg } from '@app/components/link-with-org';
import { ContentLayout } from '@app/layouts';

export function WidgetsHome(props: any) {
  const { getPermissions } = useAuth0();
  const writePermissions = getPermissions(AuthzGuards.writePlacesGuard);

  return (
    writePermissions && (
      <ContentLayout className="marapp-qa-widgetshome">
        {writePermissions && (
          <>
            <h1 className="ng-text-display-m ng-margin-medium-bottom">WIDGETS</h1>
            <div className="ng-grid">
              <div className="ng-width-1-2">
                <Card>
                  <p>Search a widget to view and edit details, or start creating a new widget.</p>
                  <div className="ng-flex ng-flex-center">
                    <LinkWithOrg
                      className="marapp-qa-actioncreate ng-button ng-button-secondary"
                      to="widgets/new"
                    >
                      Create a new widget
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
