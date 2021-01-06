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

import { Router } from '@reach/router';
import { merge } from 'lodash/fp';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import useSWR from 'swr';

import { Card } from '@marapp/earth-shared';

import { useAuth0 } from '@app/auth/auth0';
import { UserDetails, UserEdit } from '@app/components/users';
import { SidebarLayout } from '@app/layouts';
import ContentLayout from '@app/layouts/Content';
import { generateCacheKey } from '@app/services';
import OrganizationsService from '@app/services/organizations';
import UsersService from '@app/services/users';
import { setPage } from '@app/utils';

import { UsersHome } from './home';

const PAGE_TYPE = setPage('Users');
const USER_DETAIL_QUERY = {
  include: 'groups',
};

export default function UsersPage(props) {
  const { org } = props;
  const { t } = useTranslation('admin');
  const query = { group: org };
  const cacheKey = generateCacheKey(`organizations/stats`, query);

  const { data: organization, error } = useSWR(cacheKey, () =>
    OrganizationsService.getOrganizationStats(query).then((res: any) => res.data)
  );

  return (
    <>
      <SidebarLayout page={PAGE_TYPE}>
        <Card className="marapp-qa-homepage ng-margin-top">
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
      <Router>
        <UsersHome path="/" />
        <DetailsPage path="/:page" />
        <EditPage path="/:page/edit" newUser={false} />
      </Router>
    </>
  );
}

function DetailsPage(props: any) {
  const { page } = props;
  const { selectedGroup } = useAuth0();

  const query = merge(USER_DETAIL_QUERY, { group: selectedGroup });
  const cacheKey = generateCacheKey(`users/${page}`, query);

  const { data, error, mutate } = useSWR(cacheKey, () =>
    UsersService.getUser(page, query).then((response: any) => response.data)
  );

  return (
    <ContentLayout
      backTo="/users"
      isLoading={!data && !error}
      errors={error?.data?.errors}
      errorPage="user"
    >
      <UserDetails data={data} onDataChange={props.onDataChange} />
    </ContentLayout>
  );
}

function EditPage(props: any) {
  const { page } = props;
  const { selectedGroup } = useAuth0();

  const query = merge(USER_DETAIL_QUERY, { group: selectedGroup });
  const cacheKey = generateCacheKey(`users/${page}`, query);

  const { data, error, mutate } = useSWR(!props.newUser && cacheKey, () =>
    UsersService.getUser(page, query).then((response: any) => response.data)
  );

  return (
    <ContentLayout backTo="/users" isLoading={props.newUser ? false : !data}>
      <UserEdit data={data} newUser={props.newUser} onDataChange={props.onDataChange} />
    </ContentLayout>
  );
}
