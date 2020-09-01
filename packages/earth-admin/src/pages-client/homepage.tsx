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

import * as React from 'react';

import { setPage } from 'utils';
import { useRequest } from 'utils/hooks';
import { AuthzGuards } from 'auth/permissions';
import { getOrganizationStats } from 'services/organizations';

import { ContentLayout, SidebarLayout } from 'layouts';
import { Card } from 'components';

import './styles.scss';

const PAGE_TYPE = setPage('Home');

const Homepage = (props) => {
  // use org from URL
  // `const { selectedGroup } = useAuth0()` fires multiple times on change
  const { org } = props;
  const { isLoading, data: organization, errors } = useRequest(() => getOrganizationStats(org), {
    permissions: AuthzGuards.accessHomeGuard,
    query: org // when this changes, we refetch
  });

  return (
    <>
      <SidebarLayout isLoading={isLoading} page={PAGE_TYPE}>
        <Card className="marapp-qa-homepage ng-margin-top" style={{ 'overflowY': 'scroll' }}>
          {organization.name && (
            <>
              <h2 className="ng-text-display-m ng-margin-bottom-remove">{organization.name}</h2>
              <p className="ng-margin-bottom-large">{organization.description}</p>
              <p className="ng-margin-vertical"><strong className="ng-color-mdgray">Slug: </strong>{organization.slug}</p>

              <hr className="ng-hr-small ng-hr"/>

              <p className="ng-margin-vertical"><strong className="ng-color-mdgray">Organization collections: </strong>{organization.collections}</p>
              <p className="ng-margin-vertical"><strong className="ng-color-mdgray">Organization places: </strong>{organization.locations}</p>
              <p className="ng-margin-vertical"><strong className="ng-color-mdgray">Organization layers: </strong>{organization.layers}</p>
              <p className="ng-margin-vertical"><strong className="ng-color-mdgray">Organization widgets: </strong>{organization.widgets}</p>
              <p className="ng-margin-vertical"><strong className="ng-color-mdgray">Organization dashboards: </strong>{organization.dashboards}</p>
            </>
          )}
        </Card>
      </SidebarLayout>
      <ContentLayout permission={true} errors={errors}>
        {!isLoading && (
          <>
            <h2 className="ng-text-display-m">Home</h2>
            <Card className="ng-width-1-2">
              <h4 className="ng-text-display-s ng-margin-bottom">Welcome to the {organization.name} Admin!</h4>
              <p>Search and edit sections related to your organization.</p>
            </Card>
          </>
        )}
      </ContentLayout>
    </>
  );
};

export default Homepage;