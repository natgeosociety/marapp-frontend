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

import React from 'react';
import { useTranslation } from 'react-i18next';

import { Spinner } from '@marapp/earth-shared';

import ListItem from '../../../components/list-item';
import { QUERY_LOCATION, useLocations } from '../../../fetchers';

interface IProps {
  group?: string[];
}

export const FeaturedPlacesComponent = (props: IProps) => {
  const { group } = props;
  const { t } = useTranslation();
  const { data } = useLocations(QUERY_LOCATION.getFeatured());

  return (
    <div className="marapp-qa-featuredplaces ng-section-background ng-position-relative ng-padding-medium-bottom">
      <h2 className="ng-padding-small-bottom ng-padding-medium-horizontal ng-padding-medium-top ng-text-display-s ng-body-color ng-margin-remove">
        {t('Featured places')}
      </h2>
      <div>
        {!data && (
          <div className="ng-padding-large ng-position-relative">
            <Spinner />
          </div>
        )}
        {data?.map((place: any) => {
          const { slug, name, id, organization, type } = place;

          return (
            <ListItem
              title={name}
              key={`${slug}-${organization}`}
              linkTo={{ type: 'LOCATION', payload: { slug, id, organization } }}
              organization={group.length > 1 && organization}
              labels={[type]}
            />
          );
        })}
      </div>
    </div>
  );
};
