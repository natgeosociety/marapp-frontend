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
import { useTranslation } from 'react-i18next';

import { AuthzGuards, Card } from '@marapp/earth-shared';

import { useAuth0 } from '@app/auth/auth0';
import { LinkWithOrg } from '@app/components/link-with-org';
import { ContentLayout } from '@app/layouts';

export function PlacesHome(props: any) {
  const { getPermissions } = useAuth0();
  const { t } = useTranslation('admin');
  const permissions = getPermissions(AuthzGuards.accessPlacesGuard);
  const writePermissions = getPermissions(AuthzGuards.writePlacesGuard);

  return (
    writePermissions && (
      <ContentLayout className="marapp-qa-placeshome">
        {writePermissions && (
          <>
            <h1 className="ng-text-display-m ng-margin-medium-bottom">{t('Places')}</h1>
            <div className="ng-grid">
              <div className="ng-width-1-2">
                <Card>
                  <p>
                    {t('Search a place to view and edit details, or start creating a new place')}
                  </p>
                  <div className="ng-flex ng-flex-center">
                    <LinkWithOrg
                      className="marapp-qa-actioncreate ng-button ng-button-secondary"
                      to="places/new"
                    >
                      {t('Create new place')}
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
