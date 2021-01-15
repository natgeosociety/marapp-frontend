/*
 * Copyright 2018-2020 National Geographic Society
 *
 * Use of this software does not constitute endorsement by National Geographic
 * Society (NGS). The NGS name and NGS logo may not be used for any purpose without
 * written permission from NGS.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use
 * this file except in compliance with the License. You may obtain a copy of the
 * License at
 *
 *   https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed
 * under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
 * CONDITIONS OF ANY KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
 */

import React from 'react';
import { useInfiniteList } from '@marapp/earth-shared';
import { BaseAPIService, metaDeserializer } from 'services/base/APIBase';
import List from '@researchgate/react-intersection-list';
import ListItem from 'components/list-item';

export function PlacesSearchResults(props) {
  const { search, group } = props;
  const pageSize = 20;
  const getQueryFn = (cursor: string): { query: any; resourceType: string } => {
    const query = {
      search,
      sort: 'name',
      page: { size: pageSize, cursor },
      select: 'name,slug,organization',
      group: group.join(),
    };
    return { query, resourceType: 'locations' };
  };
  const { listProps, mutate } = useInfiniteList(getQueryFn, (url) =>
    BaseAPIService.requestSWR(url, undefined, metaDeserializer)
  );

  const data = listProps.data || [];
  console.log(listProps);

  return (
    <List
      awaitMore={listProps.awaitMore}
      pageSize={pageSize}
      itemCount={data.length}
      renderItem={(index) => {
        const { id, $searchHint, name, slug, organization, type } = data[index];

        return (
          <ListItem
            hint={$searchHint.name}
            title={name}
            key={`${slug}-${organization}`}
            onClick={() => {
              // setSidebarPanelExpanded(false);
              // setPlacesSearch({ search: name });
            }}
            // linkTo={{
            //   type:
            //     type === LocationTypeEnum.COLLECTION
            //       ? EarthRoutes.COLLECTION
            //       : EarthRoutes.LOCATION,
            //   payload: { slug, id, organization },
            // }}
            organization={group.length > 1 && organization}
            labels={[type]}
          />
        );
      }}
      onIntersection={listProps.onIntersection}
    />
  );
}
