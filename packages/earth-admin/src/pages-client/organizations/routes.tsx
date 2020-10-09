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
import React from 'react';

import { useAuth0 } from '@app/auth/auth0';
import { DataListing, DefaultListItem } from '@app/components/data-listing';
import { SidebarLayout } from '@app/layouts';
import { getAllOrganizations } from '@app/services/organizations';
import { encodeQueryToURL, setPage } from '@app/utils';
import { useInfiniteListPaged } from '@app/utils/hooks';

import { OrganizationDetails } from './details';
import { OrganizationHome } from './home';
import { NewOrganization } from './new';

const PAGE_SIZE = 20;
const PAGE_TYPE = setPage('Organizations');

export default function PlacesPage(props) {
  const { selectedGroup } = useAuth0();

  const getQuery = (pageIndex) => {
    const query = {
      page: { size: PAGE_SIZE, number: pageIndex },
      select: 'name,slug',
      group: selectedGroup,
    };
    return encodeQueryToURL('organizations', query);
  };
  const { listProps, mutate } = useInfiniteListPaged(getQuery, getAllOrganizations);

  // Matches everything after the resource name in the url.
  // In our case that's /resource-id or /new
  const selectedItem = props['*'];

  return (
    <>
      <SidebarLayout page={PAGE_TYPE}>
        <DataListing
          childComponent={DefaultListItem}
          categoryUrl="organizations"
          pageTitle="ORGANIZATIONS"
          pageSize={PAGE_SIZE}
          selectedItem={selectedItem}
          {...listProps}
        />
      </SidebarLayout>
      <Router>
        <OrganizationHome path="/" />
        <NewOrganization path="/new" onDataChange={mutate} />
        <OrganizationDetails path="/:page" onDataChange={mutate} />
      </Router>
    </>
  );
}
