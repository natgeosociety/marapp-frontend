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
import { Router } from '@reach/router';
import useSWR from 'swr';

import { DataListing, Auth0ListItem } from 'components/data-listing';
import { LinkWithOrg } from 'components/link-with-org';
import { UserEdit, UserDetails } from 'components/users';
import { encodeQueryToURL, setPage } from 'utils';
import { getAllUsers, getUser } from 'services/users';
import { AuthzGuards } from 'auth/permissions';
import { useInfiniteList } from 'utils/hooks';


import { useAuth0 } from 'auth/auth0';
import { SidebarLayout } from 'layouts';
import ContentLayout from 'layouts/Content';

const PAGE_SIZE = 20;
const USER_DETAIL_QUERY = {
  include: 'groups',
};

const PAGE_TYPE = setPage('Users');

export default function UsersPage( props ) {
  const { selectedGroup } = useAuth0();

  const getQuery = (pageIndex) => {
    const query = {
      page: { size: PAGE_SIZE, number: pageIndex },
      group: selectedGroup,
      include: 'groups',
    };
    return encodeQueryToURL('users', query);
  }
  const { listProps, mutate } = useInfiniteList(getQuery, getAllUsers);

  return (
    <>
      <SidebarLayout page={PAGE_TYPE}>
        <DataListing
          childComponent={Auth0ListItem}
          categoryUrl="users"
          pageTitle="users"
          pageSize={PAGE_SIZE}
          {...listProps}
        />
      </SidebarLayout>
      <Router>
        <HomePage path="/"/>
        <DetailsPage path="/:page" onDataChange={mutate} />
        <EditPage path="/:page/edit" newUser={false} onDataChange={mutate} />
        <EditPage path="/new" newUser={true} onDataChange={mutate} />
      </Router>
    </>
  );
}

function HomePage( props: any ) {
  const { getPermissions } = useAuth0();
  const permissions = getPermissions(AuthzGuards.accessUsersGuard);
  const writePermissions = getPermissions(AuthzGuards.writeUsersGuard);
  return (writePermissions && (
    <ContentLayout>
      <div className="ng-flex ng-align-right">
        <LinkWithOrg className="ng-button ng-button-overlay" to="/users/new">
          add new user
        </LinkWithOrg>
      </div>
    </ContentLayout>
  ));
}


function DetailsPage( path: any ) {
  const { selectedGroup } = useAuth0();
  const encodedQuery = encodeQueryToURL(`users/${path.page}`, {
    ...USER_DETAIL_QUERY,
    group: selectedGroup,
  });

  const { data, error, mutate } = useSWR(
    encodedQuery,
    (url) => getUser(url).then((response: any) => response.data)
  );

  return (
    <ContentLayout backTo="/users" isLoading={!data}>
      <UserDetails data={data}/>
    </ContentLayout>
  );
}

function EditPage( props: any ) {
  const { selectedGroup } = useAuth0();
  const encodedQuery = encodeQueryToURL(`users/${props.page}`, {
    ...USER_DETAIL_QUERY,
    ...{ group: selectedGroup },
  });
  const { data, error, mutate } = useSWR(
    !props.newUser && encodedQuery,
    (url) => getUser(url).then((response: any) => response.data)
  );

  return (
    <ContentLayout backTo="/users" isLoading={props.newUser ? false : !data}>
      <UserEdit
        data={data}
        newUser={props.newUser}
        onDataChange={props.onDataChange} />
    </ContentLayout>
  );
}
