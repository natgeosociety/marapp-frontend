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

import Box from '@material-ui/core/Box';
import List from '@material-ui/core/List';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { Spinner } from '@marapp/earth-shared';

import ListItem from '../../../components/list-item';
import MenuItemSkeleton from '../../../components/MenuItemSkeleton';
import useLocations from '../../../fetchers/useLocations';

interface IFeaturedPlaces {
  meta?: object;
  group?: string[];
}

export const FeaturedPlacesComponent = (props: IFeaturedPlaces) => {
  const { group } = props;
  const { t } = useTranslation();

  const { data } = useLocations({
    select: 'slug,name,id,organization,type',
    page: { size: 100 },
    filter: 'featured==true',
    sort: 'name',
    group: group.join(),
  });

  if (!data) {
    return (
      <Box mb={1} position="relative">
        <Paper className="marapp-qa-other" square={true}>
          <Box p={2} pb={0}>
            <Typography variant="subtitle1">{t('Collections')}</Typography>
          </Box>

          <List>
            {Array(5)
              .fill(null)
              .map(() => (
                <MenuItemSkeleton />
              ))}
          </List>
        </Paper>
      </Box>
    );
  }

  return (
    <Paper className="marapp-qa-featuredplaces" square={true}>
      <Box p={2} pb={0}>
        <Typography variant="subtitle1">{t('Featured places')}</Typography>
      </Box>

      {!data.length && (
        <div className="ng-padding-large ng-position-relative">
          <Spinner />
        </div>
      )}
      {!!data.length && (
        <List>
          {data.map((place: any) => {
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
        </List>
      )}
    </Paper>
  );
};
