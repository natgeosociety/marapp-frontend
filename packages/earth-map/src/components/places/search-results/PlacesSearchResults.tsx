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

import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import { useTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import List from '@researchgate/react-intersection-list';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { serializeFilters, Spinner } from '@marapp/earth-shared';

import MenuItemSkeleton from '../../../components/MenuItemSkeleton';
import useLocations from '../../../fetchers/useLocations';
import { LocationTypeEnum } from '../../../modules/places/model';
import { EarthRoutes } from '../../../modules/router/model';
import { PAGE_SIZE } from '../../../theme';
import ListItem from '../../list-item';

interface IProps {
  availableFilters?: any;
  setPlacesSearch?: (value: any) => {};
  search?: any;
  filters?: any;
  group?: any;
  setSidebarOpen?: (value: boolean) => void;
  setSidebarPanelExpanded?: (value: boolean) => void;
}

export function PlacesSearchResults(props: IProps) {
  const {
    search,
    filters,
    group,
    setPlacesSearch,
    setSidebarOpen,
    setSidebarPanelExpanded,
  } = props;
  const { t } = useTranslation();
  const title = t('Search results');

  const theme = useTheme();
  const isSmallDevice = useMediaQuery(theme.breakpoints.down('sm'));

  const { data, awaitMore, nextPage, isValidating } = useLocations({
    search,
    filter: serializeFilters(filters),
    select: 'name,slug,organization,type',
    group: group.join(),
  });

  const fakeResultsMapping = {
    '1': 10,
    '2': 5,
    '3': 2,
  };

  const isLoading = isValidating !== false;

  let itemCount = data?.length || 0;

  if (isLoading) {
    itemCount += fakeResultsMapping[search.length] || 1;
  }

  return (
    <Paper square={true} className="marapp-qa-infinitelist">
      <Box pb={2}>
        <Box p={2} pb={0}>
          <Typography variant="subtitle1" color="textSecondary">
            {title}
          </Typography>
        </Box>
        <List
          awaitMore={awaitMore}
          pageSize={PAGE_SIZE}
          itemCount={itemCount}
          renderItem={(index) => {
            if (!(data && data[index])) {
              return <MenuItemSkeleton key={index} />;
            }

            const { id, $searchHint, name, slug, organization, type } = data[index];

            return (
              <ListItem
                hint={$searchHint.name}
                title={name}
                key={`${slug}-${organization}`}
                onClick={() => {
                  setSidebarPanelExpanded(false);
                  setPlacesSearch({ search: name });
                  isSmallDevice && setSidebarOpen(false);
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
        {/*{isValidating && <Spinner position="relative" />}*/}
      </Box>
    </Paper>
  );
}
