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
import Box from '@material-ui/core/Box';
import List from '@material-ui/core/List';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { useTranslation } from 'react-i18next';

import ListItem from '../../components/list-item';
import { ILastViewedPlace } from '../../modules/global/model';

interface IProps {
  place: ILastViewedPlace;
  group: any;
}

export const LastViewedPlace = ({ place, group }: IProps) => {
  const { name, slug, id, organization, mainType, subType } = place;
  const { t } = useTranslation();

  return (
    <Box mb={1}>
      <Paper className="marapp-qa-lastviewedplace" square={true}>
        <Box p={2} pb={0}>
          <Typography variant="subtitle2" color="textSecondary">
            {t('Last viewed place')}
          </Typography>
        </Box>

        <List>
          <ListItem
            title={name}
            key={`${slug}-${organization}`}
            linkTo={{ type: mainType, payload: { slug, id, organization } }}
            organization={group.length > 1 && organization}
            labels={[subType]}
          />
        </List>
      </Paper>
    </Box>
  );
};
