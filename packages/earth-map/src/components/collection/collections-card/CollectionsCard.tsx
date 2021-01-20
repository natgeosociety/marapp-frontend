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
import Link from 'redux-first-router-link';

import { Card, getGenericDate } from '@marapp/earth-shared';

import ListItem from '../../../components/list-item';
import { ICollection } from '../../../modules/collections/model';
import { EMainType } from '../../../modules/global/model';
import { EarthRoutes } from '../../../modules/router/model';

const { NEW_COLLECTION } = EarthRoutes;

interface IProps {
  canCreate: boolean;
  group: string[];
  data: ICollection[];
}

export const CollectionsCard = (props: IProps) => {
  const { canCreate, data, group } = props;
  const { t } = useTranslation();
  const hasCollections = !!data?.length;

  if (hasCollections) {
    return (
      <Card expanded={true} className="ng-margin-bottom ng-padding-medium-bottom">
        <h2 className="ng-padding-small-bottom ng-padding-medium-horizontal ng-padding-medium-top ng-text-display-s ng-body-color ng-margin-remove">
          {t('Collections')}
        </h2>
        {canCreate && (
          <Link
            to={{ type: NEW_COLLECTION }}
            className="marapp-qa-create-collection  ng-button ng-button-link ng-edit-card-button ng-text-transform-remove"
          >
            {t('create new')}
          </Link>
        )}
        {data.map((collection) => {
          const { slug, name, id, organization, updatedAt } = collection;

          return (
            <ListItem
              title={name}
              key={`${slug}-${organization}`}
              linkTo={{ type: EMainType.COLLECTION, payload: { slug, id, organization } }}
              organization={group.length > 1 && organization}
              labels={[getGenericDate(updatedAt)]}
            />
          );
        })}
      </Card>
    );
  }

  return (
    <Card className="ng-margin-bottom">
      <h2 className="ng-text-display-s ng-body-color ng-margin-bottom">{t('Collections')}</h2>
      <p>
        {t('You currently do not have any collections in your organizations')}.
        {canCreate &&
          t(`Create a collection and start sharing your insights with your organization members`)}
        .
      </p>
      {canCreate && (
        <Link
          to={{ type: NEW_COLLECTION }}
          className="marapp-qa-create-collection ng-button ng-button-secondary"
        >
          {t('Create New Collection')}
        </Link>
      )}
    </Card>
  );
};
