import * as React from 'react';
import { useState, useEffect } from 'react';

import { useAuth0 } from 'auth/auth0';
import { AuthzGuards } from 'auth/permissions';
import { encodeQueryToURL, setPage } from 'utils';
import { OrganizationContext } from 'utils/contexts';
import { getAllOrganizations } from 'services/organizations';
import { SidebarLayout } from 'layouts';
import { OrganizationList } from '../organization-list';

const PAGE_TYPE = setPage('Organizations');

export function OrganizationsSidebar(props: any) {
  const [organizations, setOrganizations] = useState([]);
  const [pageSize, setPageSize] = useState(20);
  const [pageNumber, setPageNumber] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isNoMore, setIsNoMore] = useState(null);
  const [totalResults, setTotalResults] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  const { selectedGroup, getPermissions } = useAuth0();

  const permissions = getPermissions(AuthzGuards.accessOrganizationsGuard);

  const handleCursorChange = () => {
    setPageNumber(pageNumber + 1);
  };

  useEffect(() => {
    async function setupOrganizations() {
      setIsLoading(true);

      const query = {
        page: { size: pageSize, number: pageNumber },
        group: selectedGroup,
      };

      const encodedQuery = encodeQueryToURL('organizations', query);
      const res: any = await getAllOrganizations(encodedQuery);

      const validOrganizations = res.data;

      setTotalResults(res.total);
      setOrganizations([...organizations, ...validOrganizations]);
      setIsNoMore(pageNumber === res.pagination.total);


      setIsLoading(false);
    }

    permissions && setupOrganizations();
  }, [pageNumber]);

  return (
    <OrganizationContext.Provider
      value={{
        handleCursorChange,
        isLoading,
        isNoMore,
        organizations,
        totalResults,
        pageSize,
        selectedItem,
      }}
    >
      <SidebarLayout page={PAGE_TYPE}>
        <OrganizationList />
      </SidebarLayout>
    </OrganizationContext.Provider>
  );
}