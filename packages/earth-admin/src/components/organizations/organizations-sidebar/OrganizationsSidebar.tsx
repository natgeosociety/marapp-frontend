import React, { useEffect, useState } from 'react';

import { AuthzGuards } from '@marapp/earth-shared';

import { useAuth0 } from '@app/auth/auth0';
import { SidebarLayout } from '@app/layouts';
import { getAllOrganizations } from '@app/services/organizations';
import { encodeQueryToURL, setPage } from '@app/utils';
import { OrganizationContext } from '@app/utils/contexts';

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
