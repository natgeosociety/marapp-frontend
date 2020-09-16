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

import { encodeQueryToURL, setPage } from 'utils';
import { useInfiniteList } from 'utils/hooks';
import { getAllWidgets, getWidget } from 'services/widgets';
import { useRequest } from 'utils/hooks';

import { WidgetDetails, WidgetEdit } from 'components/widgets';
import { DataListing, DefaultListItem } from 'components/data-listing';
import { LinkWithOrg } from 'components/link-with-org';
import { useAuth0 } from 'auth/auth0';
import { AuthzGuards } from 'auth/permissions';
import { SidebarLayout, ContentLayout } from 'layouts';

const PAGE_SIZE = 20;
const EXCLUDED_FIELDS = '-geojson,-bbox2d,-centroid';
const WIDGET_DETAIL_QUERY = {
  include: 'layers',
  select: 'layers.id,layers.name,layers.type',
  sort: 'layers.name',
};
const PAGE_TYPE = setPage('Widgets');

export default function WidgetsPage( props ) {
  return (
    <Router>
      <Page path="/">
        <HomePage path="/"/>
        <DetailsPage path="/:page"/>
        <EditPage path="/:page/edit" newWidget={false}/>
        <EditPage path="/new" newWidget={true}/>
      </Page>
    </Router>
  );
}

function Sidebar( props: any ) {
  const { selectedGroup } = useAuth0();
  const [searchValue, setSearchValue] = useState('');

  const getQuery = (pageIndex) => {
    const query = {
      search: searchValue,
      sort: 'name',
      page: { size: PAGE_SIZE, number: pageIndex },
      select: EXCLUDED_FIELDS,
      group: selectedGroup,
    };
    return encodeQueryToURL('widgets', query);
  }
  const { listProps, mutate } = useInfiniteList(getQuery, getAllWidgets);

  return (
    <SidebarLayout page={PAGE_TYPE}>
      <DataListing
        childComponent={DefaultListItem}
        categoryUrl="widgets"
        pageTitle="widgets"
        searchValueAction={setSearchValue}
        pageSize={PAGE_SIZE}
        searchValue={searchValue}
        {...listProps}
      />
    </SidebarLayout>
  );
}

function Page( props: any ) {
  return (
    <>
      <Sidebar/>
      {props.children}
    </>);
}

function HomePage( props: any ) {
  const { getPermissions } = useAuth0();
  const permissions = getPermissions(AuthzGuards.accessWidgetsGuard);
  const writePermissions = getPermissions(AuthzGuards.writeWidgetsGuard);
  return (writePermissions && (
    <ContentLayout>
      <div className="ng-flex ng-align-right">
        <LinkWithOrg className="ng-button ng-button-overlay" to="/widgets/new">
          add new widget
        </LinkWithOrg>
      </div>
    </ContentLayout>
  ));
}

function DetailsPage( path: any ) {
  const { selectedGroup } = useAuth0();
  const encodedQuery = encodeQueryToURL(`widgets/${path.page}`, {
    ...WIDGET_DETAIL_QUERY,
    ...{ group: selectedGroup },
  });
  const { isLoading, errors, data } = useRequest(() => getWidget(encodedQuery), {
    query: encodedQuery,
  });

  return (

    <ContentLayout errors={errors} backTo="/widgets" isLoading={isLoading}>
      <WidgetDetails data={data}/>
    </ContentLayout>

  );
}

function EditPage( path: any ) {
  const { selectedGroup } = useAuth0();
  const encodedQuery = encodeQueryToURL(`widgets/${path.page}`, {
    ...WIDGET_DETAIL_QUERY,
    group: selectedGroup,
  });
  const { isLoading, errors, data } = useRequest(() => getWidget(encodedQuery), {
    skip: path.newWidget,
  });

  return (

    <ContentLayout errors={errors} backTo="/widgets" isLoading={isLoading}>
      <WidgetEdit data={data} newWidget={path.newWidget}/>
    </ContentLayout>


  );
}
