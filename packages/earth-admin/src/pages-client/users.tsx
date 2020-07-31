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
import { useEffect, useState } from 'react';
import { Router } from '@reach/router';

import { UserContext } from 'utils/contexts';
import { LinkWithOrg } from 'components';
import { encodeQueryToURL, setPage } from 'utils';
import { getAllUsers, getUser } from 'services/users';
import { AuthzGuards } from 'auth/permissions';
import { useRequest } from 'utils/hooks';

import { UserList, UserEdit, UserDetails } from 'components';
import { useAuth0 } from 'auth/auth0';
import { SidebarLayout } from 'layouts';
import ContentLayout from 'layouts/Content';

const USER_DETAIL_QUERY = {
  include: 'groups',
};

const PAGE_TYPE = setPage('Users');

export default function UsersPage( props ) {
  return (
    <Router>
      <Page path={'/'}/>
      <DetailsPage path={'/:page'}/>
      <EditPage path={'/:page/edit'} newUser={false}/>
      <EditPage path={'/new'} newUser={true}/>
    </Router>
  );
}

function UsersWrapper( props: any ) {
  const {detail} = props;
  const [users, setUsers] = useState([]);
  const [pageSize, setPageSize] = useState(20);
  const [pageNumber, setPageNumber] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isNoMore, setIsNoMore] = useState(null);
  const [totalResults, setTotalResults] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  const { selectedGroup, getPermissions } = useAuth0();

  const permissions = getPermissions(AuthzGuards.accessUsersGuard);

  const handleCursorChange = () => {
    setPageNumber(pageNumber + 1);
  };

  useEffect(() => {
    async function setupUsers() {
      setIsLoading(true);

      const dataReset = !!props.path.location.state && !!props.path.location.state.refresh || detail;

      if (dataReset && pageNumber !== 1) {
        props.path.location.state.refresh = false;
      } else {
        const query = {
          page: { size: pageSize, number: pageNumber },
          group: selectedGroup,
          include: 'groups',
        };
        const encodedQuery = encodeQueryToURL('users', query);
        const res: any = await getAllUsers(encodedQuery);

        if (dataReset) {
          props.path.location.state.refresh = false;
        }

        const validUsers = res.data.filter(( item ) => item.id !== '|' && item.groups.length > 0);
        setSelectedItem(props.path.page);
        setTotalResults(res.total);
        setUsers(dataReset ? validUsers : [...users, ...validUsers]);
        setIsNoMore(pageNumber === res.pagination.total);
      }

      setIsLoading(false);
    }

    permissions && setupUsers();
  }, [props.path.location, pageNumber]);

  return (
    <UserContext.Provider
      value={{
        handleCursorChange,
        isLoading,
        isNoMore,
        users,
        totalResults,
        pageSize,
        selectedItem,
      }}
    >
      <SidebarLayout page={PAGE_TYPE}>
        <UserList/>
      </SidebarLayout>
      {props.children}
    </UserContext.Provider>
  );
}

function Page( path: any ) {
  const { getPermissions } = useAuth0();

  const permissions = getPermissions(AuthzGuards.accessUsersGuard);
  const writePermissions = getPermissions(AuthzGuards.writeUsersGuard);

  return (
    <UsersWrapper path={path}>
      <ContentLayout permission={permissions}>
        {writePermissions && (
          <div className="ng-flex ng-align-right">
            <LinkWithOrg className="ng-button ng-button-overlay" to="/users/new">
              add new user
            </LinkWithOrg>
          </div>
        )}
      </ContentLayout>
    </UsersWrapper>
  );
}

function DetailsPage( path: any ) {
  const { selectedGroup } = useAuth0();
  const encodedQuery = encodeQueryToURL(`users/${path.page}`, {
    ...USER_DETAIL_QUERY,
    group: selectedGroup,
  });
  const { isLoading, errors, data } = useRequest(() => getUser(encodedQuery), {
    permissions: AuthzGuards.accessUsersGuard,
    query: encodedQuery
  });

  return (
    <UsersWrapper path={path} detail={true}>
      <ContentLayout errors={errors} backTo="/users" isLoading={isLoading}>
        <UserDetails data={data}/>
      </ContentLayout>
    </UsersWrapper>
  );
}

function EditPage( path: any ) {
  const { selectedGroup } = useAuth0();
  const encodedQuery = encodeQueryToURL(`users/${path.page}`, {
    ...USER_DETAIL_QUERY,
    ...{ group: selectedGroup },
  });
  const { isLoading, errors, data } = useRequest(() => getUser(encodedQuery), {
    permissions: AuthzGuards.writeUsersGuard,
    skip: path.newUser,
  });

  return (
    <UsersWrapper path={path} detail={true}>
      <ContentLayout errors={errors} backTo="/users" isLoading={isLoading}>
        <UserEdit data={data} newUser={path.newUser}/>
      </ContentLayout>
    </UsersWrapper>
  );
}
