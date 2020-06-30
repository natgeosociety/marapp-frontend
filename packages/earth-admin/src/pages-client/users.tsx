import * as React from 'react';
import { useContext, useEffect, useState } from 'react';
import { Router, Location } from '@reach/router';
import { withPrefix } from 'gatsby';

import { UserContext } from 'utils/contexts';
import { LinkWithOrg } from 'components/LinkWithOrg';
import { encodeQueryToURL } from 'utils';
import { getAllUsers, getUser, getAvailableGroups } from 'services/users';
import { AuthzGuards } from 'auth/permissions';
import { useRequest } from 'utils/hooks';

import Layout from 'layouts';
import { UserList, UserEdit, UserDetails } from 'components';
import { useAuth0 } from '../auth/auth0';

const USER_DETAIL_QUERY = {
  include: 'groups',
};

export default function UsersPage(props) {
  return (
    <Router>
      <Page path={'/'} />
      <DetailsPage path={'/:page'} />
      <EditPage path={'/:page/edit'} newUser={false} />
      <EditPage path={'/new'} newUser={true} />
    </Router>
  );
}

function Page(path: any) {
  const [users, setUsers] = useState([]);
  const [pageSize, setPageSize] = useState(20);
  const [pageNumber, setPageNumber] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isNoMore, setIsNoMore] = useState(false);

  const { selectedGroup, getPermissions } = useAuth0();

  const permissions = getPermissions(AuthzGuards.accessUsersGuard);
  const writePermissions = getPermissions(AuthzGuards.writeUsersGuard);

  const handleCursorChange = () => {
    setPageNumber(pageNumber + 1);
  };

  useEffect(() => {
    async function setupUsers() {
      setIsLoading(true);

      const dataReset = !!path.location.state && !!path.location.state.refresh;

      if (dataReset && pageNumber !== 1) {
        path.location.state.refresh = false;
      } else {
        const query = {
          page: { size: pageSize, number: pageNumber },
          group: selectedGroup,
          include: 'groups',
        };
        const encodedQuery = encodeQueryToURL('users', query);
        const res: any = await getAllUsers(encodedQuery);

        if (dataReset) {
          path.location.state.refresh = false;
        }

        const validUsers = res.data.filter((item) => item.id !== '|' && item.groups.length > 0);

        setUsers(dataReset ? validUsers : [...users, ...validUsers]);
        setIsNoMore(pageNumber === res.pagination.total);
      }

      setIsLoading(false);
    }

    permissions && setupUsers();
  }, [path.location, pageNumber]);

  return (
    <UserContext.Provider
      value={{
        users,
        handleCursorChange,
        pagination: { pageNumber },
        isLoading,
        isNoMore,
      }}
    >
      <Layout permission={permissions}>
        {writePermissions && (
          <div className="ng-flex ng-align-right">
            <LinkWithOrg className="ng-button ng-button-overlay" to="/users/new">
              add new user
            </LinkWithOrg>
          </div>
        )}
        <UserList />
      </Layout>
    </UserContext.Provider>
  );
}

function DetailsPage(path: any) {
  const { selectedGroup } = useAuth0();
  const encodedQuery = encodeQueryToURL(`users/${path.page}`, {
    ...USER_DETAIL_QUERY,
    group: selectedGroup,
  });
  const { isLoading, errors, data } = useRequest(() => getUser(encodedQuery), {
    permissions: AuthzGuards.accessUsersGuard,
  });

  return (
    <Layout errors={errors} backTo="/users" isLoading={isLoading}>
      <UserDetails data={data} />
    </Layout>
  );
}

function EditPage(path: any) {
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
    <Layout errors={errors} backTo="/users" isLoading={isLoading}>
      <UserEdit data={data} newUser={path.newUser} />
    </Layout>
  );
}
