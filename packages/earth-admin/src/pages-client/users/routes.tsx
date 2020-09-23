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
import useSWR from 'swr';

import { Router } from '@reach/router';

import { SidebarLayout } from '@app/layouts';
import { getOrganizationStats } from '@app/services/organizations';
import { encodeQueryToURL, setPage } from '@app/utils';

import { Card } from '@app/components/card';
import { UsersHome } from './home';

import { useAuth0 } from '@app/auth/auth0';
import { Auth0ListItem, DataListing } from '@app/components/data-listing';
import { LinkWithOrg } from '@app/components/link-with-org';
import { UserDetails, UserEdit } from '@app/components/users';
import ContentLayout from '@app/layouts/Content';
import { getAllUsers, getUser } from '@app/services/users';
import { useInfiniteList } from '@app/utils/hooks';

const PAGE_TYPE = setPage('Users');
const USER_DETAIL_QUERY = {
  include: 'groups',
};

export default function UsersPage(props) {
  const { org } = props;
  const encodedQuery = encodeQueryToURL(`/organizations/stats`, {
    group: org,
  });
  const { data: organization, error } = useSWR(encodedQuery, (url) =>
    getOrganizationStats(url).then((res: any) => res.data)
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
                <strong className="ng-color-mdgray">Slug: </strong>
                {organization.slug}
              </p>

              <hr className="ng-hr-small ng-hr" />

              <p className="ng-margin-vertical">
                <strong className="ng-color-mdgray">Organization collections: </strong>
                {organization.collections}
              </p>
              <p className="ng-margin-vertical">
                <strong className="ng-color-mdgray">Organization places: </strong>
                {organization.locations}
              </p>
              <p className="ng-margin-vertical">
                <strong className="ng-color-mdgray">Organization layers: </strong>
                {organization.layers}
              </p>
              <p className="ng-margin-vertical">
                <strong className="ng-color-mdgray">Organization widgets: </strong>
                {organization.widgets}
              </p>
              <p className="ng-margin-vertical">
                <strong className="ng-color-mdgray">Organization dashboards: </strong>
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
  const { selectedGroup } = useAuth0();
  const encodedQuery = encodeQueryToURL(`users/${props.page}`, {
    ...USER_DETAIL_QUERY,
    group: selectedGroup,
  });

  const { data, error, mutate } = useSWR(encodedQuery, (url) =>
    getUser(url).then((response: any) => response.data)
  );

  return (
    <ContentLayout backTo="/users" isLoading={!data}>
      <UserDetails data={data} onDataChange={props.onDataChange} />
    </ContentLayout>
  );
}

function EditPage(props: any) {
  const { selectedGroup } = useAuth0();
  const encodedQuery = encodeQueryToURL(`users/${props.page}`, {
    ...USER_DETAIL_QUERY,
    ...{ group: selectedGroup },
  });
  const { data, error, mutate } = useSWR(!props.newUser && encodedQuery, (url) =>
    getUser(url).then((response: any) => response.data)
  );

  return (
    <ContentLayout backTo="/users" isLoading={props.newUser ? false : !data}>
      <UserEdit data={data} newUser={props.newUser} onDataChange={props.onDataChange} />
    </ContentLayout>
  );
}
