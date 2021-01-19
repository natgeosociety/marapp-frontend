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

import List from '@researchgate/react-intersection-list';
import ListItem from 'components/list-item';
import useLocations from 'fetchers/useLocations';
import { LocationTypeEnum } from 'modules/places/model';
import { EarthRoutes } from 'modules/router/model';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { PAGE_SIZE } from 'theme';

import { serializeFilters, Spinner } from '@marapp/earth-shared';

interface IProps {
  setPlacesSearch?: (value: any) => {};
  search?: any;
  filters?: any;
  group?: any;
}

export function PlacesSearchResults(props: IProps) {
  const { search, filters, group, setPlacesSearch } = props;
  const { t } = useTranslation();
  const title = t('Search results');

  const { data, awaitMore, nextPage, isValidating } = useLocations({
    search,
    filter: serializeFilters(filters),
    select: 'name,slug,organization,type',
    group: group.join(),
  });

  if (!data) {
    return <Spinner position="relative" />;
  }

  return (
    <div className="marapp-qa-infinitelist ng-section-background ng-position-relative ng-padding-medium-bottom">
      <h2 className="ng-padding-small-bottom ng-padding-medium-horizontal ng-padding-medium-top ng-text-display-s ng-body-color ng-margin-remove">
        {title}
      </h2>
      <List
        awaitMore={awaitMore}
        pageSize={PAGE_SIZE}
        itemCount={data.length}
        renderItem={(index) => {
          const { id, $searchHint, name, slug, organization, type } = data[index];

          return (
            <ListItem
              hint={$searchHint.name}
              title={name}
              key={`${slug}-${organization}`}
              onClick={() => {
                setPlacesSearch({ search: name });
              }}
              linkTo={{
                type:
                  type === LocationTypeEnum.COLLECTION
                    ? EarthRoutes.COLLECTION
                    : EarthRoutes.LOCATION,
                payload: { slug, id, organization },
              }}
              organization={group.length > 1 && organization}
              labels={[type]}
            />
          );
        }}
        onIntersection={nextPage}
      />
      {isValidating && <Spinner position="relative" />}
    </div>
  );
}
