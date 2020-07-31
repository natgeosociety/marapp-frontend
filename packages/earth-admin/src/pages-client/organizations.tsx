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
import { useEffect, useState} from 'react';
import {Router} from '@reach/router';

import {OrganizationContext} from 'utils/contexts';
import {encodeQueryToURL, setPage} from 'utils';
import {getAllOrganizations, getOrganization} from 'services/organizations';
import {AuthzGuards} from 'auth/permissions';
import {useRequest} from 'utils/hooks';

import {ContentLayout, SidebarLayout} from 'layouts';
import {OrganizationList, OrganizationDetails, OrganizationEdit} from 'components';
import {useAuth0} from 'auth/auth0';

const PAGE_TYPE = setPage('Organizations');

export default function OrganizationsPage(props) {
  return (
    <Router>
      <Page path={'/'}/>
      <DetailsPage path={'/:page'}/>
      <EditPage path={'/:page/edit'} newOrg={false}/>
    </Router>
  );
}

function OrganizationsWrapper(props:any) {
  const {detail} = props;
  const [organizations, setOrganizations] = useState([]);
  const [pageSize, setPageSize] = useState(20);
  const [pageNumber, setPageNumber] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isNoMore, setIsNoMore] = useState(null);
  const [totalResults, setTotalResults] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  const {selectedGroup, getPermissions} = useAuth0();

  const permissions = getPermissions(AuthzGuards.accessUsersGuard);

  const handleCursorChange = () => {
    setPageNumber(pageNumber + 1);
  };

  useEffect(() => {
    async function setupOrganizations() {
      setIsLoading(true);

      const dataReset = !!props.path.location.state && !!props.path.location.state.refresh || detail;

      if (dataReset && pageNumber !== 1) {
        props.path.location.state.refresh = false;
      } else {
        const query = {
          page: {size: pageSize, number: pageNumber},
          group: selectedGroup
        };
        const encodedQuery = encodeQueryToURL('organizations', query);
        const res: any = await getAllOrganizations(encodedQuery);

        if (dataReset) {
          props.path.location.state.refresh = false;
        }

        const validOrganizations = res.data;

        setTotalResults(res.total)
        setSelectedItem(props.path.page);
        setOrganizations(dataReset ? validOrganizations : [...organizations, ...validOrganizations]);
        setIsNoMore(pageNumber === res.pagination.total);
      }

      setIsLoading(false);
    }

    permissions && setupOrganizations();
  }, [props.path.location, pageNumber]);

  return (
    <OrganizationContext.Provider
      value={{
        handleCursorChange,
        isLoading,
        isNoMore,
        organizations,
        totalResults,
        pageSize,
        selectedItem
      }}
    >
      <SidebarLayout page={PAGE_TYPE}>
        <OrganizationList/>
      </SidebarLayout>
      {props.children}
    </OrganizationContext.Provider>
  );
}

function Page(path: any) {
  const {selectedGroup, getPermissions} = useAuth0();

  const permissions = getPermissions(AuthzGuards.accessUsersGuard);
  const writePermissions = getPermissions(AuthzGuards.writeUsersGuard);

  return (
    <OrganizationsWrapper path={path}>
      <ContentLayout permission={permissions}>
        <div>
          {/* {writePermissions && (
          <div className="ng-flex ng-align-right">
            <LinkWithOrg className="ng-button ng-button-overlay" to="/organizations/new">
              add new organization
            </LinkWithOrg>
          </div>
        )} */}
        </div>
      </ContentLayout>
    </OrganizationsWrapper>
  );
}

function DetailsPage(path: any) {
  const {selectedGroup} = useAuth0();
  const encodedQuery = encodeQueryToURL(`organizations/${path.page}`, {
    group: selectedGroup,
  });
  const {isLoading, errors, data} = useRequest(() => getOrganization(encodedQuery), {
    permissions: AuthzGuards.accessUsersGuard,
    query: encodedQuery
  });

  return (
    <OrganizationsWrapper path={path} detail={true}>
      <ContentLayout errors={errors} backTo="/organizations" isLoading={isLoading}>
        <OrganizationDetails data={data}/>
      </ContentLayout>
    </OrganizationsWrapper>
  );
}

function EditPage(path: any) {
  const {selectedGroup} = useAuth0();
  const encodedQuery = encodeQueryToURL(`organizations/${path.page}`, {
    ...{group: selectedGroup},
  });
  const {isLoading, errors, data} = useRequest(() => getOrganization(encodedQuery), {
    permissions: AuthzGuards.writeUsersGuard,
    skip: path.newUser,
  });

  return (
    <OrganizationsWrapper path={path} detail={true}>
      <ContentLayout errors={errors} backTo="/organizations" isLoading={isLoading}>
        <OrganizationEdit data={data} newOrg={path.newUser}/>
      </ContentLayout>
    </OrganizationsWrapper>
  );
}
