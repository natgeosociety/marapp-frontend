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
import useSWR from 'swr';

import { Card } from '@marapp/earth-shared';

import { ContentLayout, SidebarLayout } from '@app/layouts';
import { generateCacheKey } from '@app/services';
import OrganizationsService from '@app/services/organizations';
import { setPage } from '@app/utils';

import './styles.scss';

const PAGE_TYPE = setPage('Home');

const Homepage = (props) => {
  const { org } = props;
  const { t } = useTranslation('admin');
  const query = { group: org };
  const cacheKey = generateCacheKey(`organizations/stats`, query);

  const { data: organization, error } = useSWR(cacheKey, () =>
    OrganizationsService.getOrganizationStats(query).then((res: any) => res.data)
  );

  return (
    <>
      <SidebarLayout isLoading={!organization} page={PAGE_TYPE}>
        <Card className="marapp-qa-homepage ng-margin-top" style={{ overflowY: 'scroll' }}>
          {organization && organization.name && (
            <>
              <h2 className="ng-text-display-m ng-margin-bottom-remove">{organization.name}</h2>
              <p className="ng-margin-bottom-large">{organization.description}</p>
              <p className="ng-margin-vertical">
                <strong className="ng-color-mdgray">{t('Slug')}: </strong>
                {organization.slug}
              </p>

              <hr className="ng-hr-small ng-hr" />

              <p className="ng-margin-vertical">
                <strong className="ng-color-mdgray">{t('Organization collections')}: </strong>
                {organization.collections}
              </p>
              <p className="ng-margin-vertical">
                <strong className="ng-color-mdgray">{t('Organization places')}: </strong>
                {organization.locations}
              </p>
              <p className="ng-margin-vertical">
                <strong className="ng-color-mdgray">{t('Organization layers')}: </strong>
                {organization.layers}
              </p>
              <p className="ng-margin-vertical">
                <strong className="ng-color-mdgray">{t('Organization widgets')}: </strong>
                {organization.widgets}
              </p>
              <p className="ng-margin-vertical">
                <strong className="ng-color-mdgray">{t('Organization dashboards')}: </strong>
                {organization.dashboards}
              </p>
            </>
          )}
        </Card>
      </SidebarLayout>

      <ContentLayout permission={true} errors={error}>
        {!!organization && (
          <>
            <h2 className="ng-text-display-m">{t('Home')}</h2>
            <Card className="ng-width-1-2">
              <h4 className="ng-text-display-s ng-margin-bottom">
                {t('Welcome to org admin', { value: organization.name })}
              </h4>
              <p>{t('Search and edit sections related to your organization')}</p>
            </Card>
          </>
        )}
      </ContentLayout>
    </>
  );
};

export default Homepage;
