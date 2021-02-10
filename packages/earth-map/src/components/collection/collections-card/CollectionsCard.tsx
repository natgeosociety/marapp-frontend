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
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import { useTranslation } from 'react-i18next';

import Link from 'redux-first-router-link';
import { getGenericDate } from '@marapp/earth-shared';
import { makeStyles } from '@material-ui/core/styles';

import ListItem from '../../../components/list-item';
import MenuItemSkeleton from '../../../components/MenuItemSkeleton';
import { ICollection } from '../../../fetchers/locations/queries';
import { EMainType } from '../../../modules/global/model';
import { EarthRoutes } from '../../../modules/router/model';

const { NEW_COLLECTION } = EarthRoutes;

const useStyles = makeStyles((theme) => ({
  cardEditButton: {
    position: 'absolute',
    right: theme.spacing(2),
    top: theme.spacing(2),
  },
}));

interface IProps {
  canCreate: boolean;
  group: string[];
  data: ICollection[];
}

export const CollectionsCard = (props: IProps) => {
  const { canCreate, data, group } = props;
  const { t } = useTranslation();
  const hasCollections = !!data?.length;
  const classes = useStyles();

  if (!data) {
    return (
      <Box mb={1} position="relative">
        <Paper className="marapp-qa-other" square={true}>
          <Box p={2} pb={0}>
            <Typography variant="subtitle1">{t('Collections')}</Typography>
          </Box>

          <List>
            {Array(3)
              .fill(null)
              .map((_, index) => (
                <MenuItemSkeleton key={index} />
              ))}
          </List>
        </Paper>
      </Box>
    );
  }

  if (hasCollections) {
    return (
      <Box mb={1} position="relative">
        <Paper className="marapp-qa-collections" square={true}>
          <Box p={2} pb={0}>
            <Typography variant="subtitle2" color="textSecondary">
              {t('Collections')}
            </Typography>
          </Box>
          {canCreate && (
            <Button
              variant="outlined"
              color="primary"
              component={Link}
              size="small"
              to={{ type: NEW_COLLECTION }}
              className={`${classes.cardEditButton} marapp-qa-create-collection`}
            >
              {t('create new')}
            </Button>
          )}

          <List>
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
          </List>
        </Paper>
      </Box>
    );
  }

  return (
    <Box mb={1}>
      <Paper className="marapp-qa-collections" square={true}>
        <Box p={2} pb={0}>
          <Typography variant="subtitle2" color="textSecondary">
            {t('Collections')}
          </Typography>
        </Box>
        <Box p={2} pt={1}>
          <Typography paragraph={true}>
            {t('You currently do not have any collections in your organizations')}.&nbsp;
            {canCreate &&
              t(
                `Create a collection and start sharing your insights with your organization members`
              )}
            .
          </Typography>
          {canCreate && (
            <Button
              className="marapp-qa-create-collection"
              variant="outlined"
              size="large"
              component={Link}
              to={{ type: NEW_COLLECTION }}
            >
              {t('Create New Collection')}
            </Button>
          )}
        </Box>
      </Paper>
    </Box>
  );
};
