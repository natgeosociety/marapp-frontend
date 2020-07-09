import * as React from 'react';
import { useContext, useEffect, useState } from 'react';
import { Router, Location } from '@reach/router';
import { withPrefix } from 'gatsby';

import { OrganizationContext } from 'utils/contexts';
import { LinkWithOrg } from 'components/LinkWithOrg';
import { encodeQueryToURL } from 'utils';
import { getAllOrganizations, getOrganization } from 'services/organizations';
import { AuthzGuards } from 'auth/permissions';
import { useRequest } from 'utils/hooks';

import Layout from 'layouts';
import { OrganizationList, OrganizationDetails } from 'components';
import { useAuth0 } from '../auth/auth0';

export default function OrganizationsPage(props) {
  return (
    <Router>
      <Page path={'/'} />
      <DetailsPage path={'/:page'} />
    </Router>
  );
}

function Page(path: any) {
  const [organizations, setOrganizations] = useState([]);
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
    async function setupOrganizations() {
      setIsLoading(true);

      const dataReset = !!path.location.state && !!path.location.state.refresh;

      if (dataReset && pageNumber !== 1) {
        path.location.state.refresh = false;
      } else {
        const query = {
          page: { size: pageSize, number: pageNumber },
          group: selectedGroup
        };
        const encodedQuery = encodeQueryToURL('organizations', query);
        const res: any = await getAllOrganizations(encodedQuery);

        if (dataReset) {
          path.location.state.refresh = false;
        }

        const validOrganizations = res.data;

        setOrganizations(dataReset ? validOrganizations : [...organizations, ...validOrganizations]);
        setIsNoMore(pageNumber === res.pagination.total);
      }

      setIsLoading(false);
    }

    permissions && setupOrganizations();
  }, [path.location, pageNumber]);

  return (
    <OrganizationContext.Provider
      value={{
        organizations,
        handleCursorChange,
        pagination: { pageNumber },
        isLoading,
        isNoMore,
      }}
    >
      <Layout permission={permissions}>
        {writePermissions && (
          <div className="ng-flex ng-align-right">
            <LinkWithOrg className="ng-button ng-button-overlay" to="/organizations/new">
              add new organization
            </LinkWithOrg>
          </div>
        )}
        <OrganizationList />
      </Layout>
    </OrganizationContext.Provider>
  );
}

function DetailsPage(path: any) {
  const { selectedGroup } = useAuth0();
  const encodedQuery = encodeQueryToURL(`organizations/${path.page}`, {
    group: selectedGroup,
  });
  const { isLoading, errors, data } = useRequest(() => getOrganization(encodedQuery), {
    permissions: AuthzGuards.accessUsersGuard,
  });

  return (
    <Layout errors={errors} backTo="/organizations" isLoading={isLoading}>
      <OrganizationDetails data={data} />
    </Layout>
  );
}