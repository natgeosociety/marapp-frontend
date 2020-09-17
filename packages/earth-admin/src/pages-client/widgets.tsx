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
import useSWR from 'swr';

import { encodeQueryToURL, setPage } from 'utils';
import { useInfiniteList } from 'utils/hooks';
import { getAllWidgets, getWidget } from 'services/widgets';

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
    <>
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
      <Router>
        <HomePage path="/"/>
        <DetailsPage path="/:page" onDataChange={mutate} />
        <EditPage path="/:page/edit" newWidget={false} onDataChange={mutate} />
        <EditPage path="/new" newWidget={true} onDataChange={mutate} />
      </Router>
    </>
  );
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

function DetailsPage( props: any ) {
  const { selectedGroup } = useAuth0();
  const encodedQuery = encodeQueryToURL(`widgets/${props.page}`, {
    ...WIDGET_DETAIL_QUERY,
    ...{ group: selectedGroup },
  });
  const { data, error, mutate } = useSWR(
    encodedQuery,
    (url) => getWidget(url).then((response: any) => response.data)
  );

  return (
    <ContentLayout backTo="/widgets" isLoading={!data}>
      <WidgetDetails data={data} />
    </ContentLayout>

  );
}

function EditPage( props: any ) {
  const { selectedGroup } = useAuth0();
  const encodedQuery = encodeQueryToURL(`widgets/${props.page}`, {
    ...WIDGET_DETAIL_QUERY,
    group: selectedGroup,
  });
  const { data, error, mutate } = useSWR(
    !props.newWidget && encodedQuery,
    (url) => getWidget(url).then((response: any) => response.data)
  );

  return (
    <ContentLayout backTo="/widgets" isLoading={props.newWidget ? false : !data}>
      <WidgetEdit
        data={data || {}}
        newWidget={props.newWidget}
        onDataChange={props.onDataChange} />
    </ContentLayout>


  );
}
