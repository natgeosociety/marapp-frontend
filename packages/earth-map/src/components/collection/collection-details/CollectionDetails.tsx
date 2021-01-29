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

import { isEmpty } from 'lodash';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Card, getGenericDate, Spinner, TitleHero } from '@marapp/earth-shared';

import { ICollection } from '../../../modules/collections/model';
import CollectionDelete from '../collection-delete';
import { CollectionDownloadMetrics } from '../collection-downloadmetrics';
import { CollectionEditPlaces } from '../collection-editplaces';
import { CollectionRename } from '../collection-rename';
import './styles.scss';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Fab from '@material-ui/core/Fab';
import Chip from '@material-ui/core/Chip';
import { makeStyles } from '@material-ui/core/styles';
import { usePopupState, bindTrigger, bindMenu } from 'material-ui-popup-state/hooks';
import IconDotsHorizontal from 'mdi-material-ui/DotsHorizontal';
import IconDownload from 'mdi-material-ui/Download';

const useStyles = makeStyles((theme) => ({
  cardEditButton: {
    position: 'absolute',
    right: theme.spacing(2),
    top: theme.spacing(2),
  },
}));

interface IProps {
  privateGroups: string[];
  data?: ICollection;
  loading?: boolean;
  error?: any;

  reloadCollection?: (payload: ICollection) => void;
  setCollectionData?: (payload: ICollection) => void;
  setMapBounds?: (payload: any) => void;
}

const CollectionDetails = (props: IProps) => {
  const { reloadCollection, privateGroups, loading, data, setMapBounds, setCollectionData } = props;
  const { t } = useTranslation();
  const classes = useStyles();
  const popupState = usePopupState({ variant: 'popover', popupId: 'demoMenu' });
  const [isAddingPlaces, setIsAddingPlaces] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isOnDownloadMetrics, setIsOnDownloadMetrics] = useState(false);
  const [isDownloadingMetrics, setIsDownloadingMetrics] = useState(false);
  const [downloadError, setDownloadError] = useState('');

  const canEdit = privateGroups.includes(data.organization);

  if (loading || isEmpty(data)) {
    return <Spinner />;
  }

  const editActions = (
    <>
      <Fab size="small" {...bindTrigger(popupState)}>
        <IconDotsHorizontal />
      </Fab>

      <Menu {...bindMenu(popupState)}>
        <MenuItem
          onClick={() => {
            setIsRenaming(true);
            popupState.close();
          }}
        >
          {t('Rename Collection')}
        </MenuItem>
        <MenuItem
          onClick={() => {
            setIsDeleting(true);
            popupState.close();
          }}
        >
          {t('Delete')}
        </MenuItem>
      </Menu>
    </>
  );

  const { organization, name, locations, updatedAt } = data;
  const hasLocations = locations.length > 0;

  return (
    <div className="marapp-qa-collection-details">
      <Card elevation="flush" className="ng-widget-header">
        <TitleHero
          title={name}
          subtitle={organization}
          extra={t('Collection')}
          actions={canEdit ? editActions : null}
          finePrint={`Updated: ${getGenericDate(updatedAt)}`}
        />
      </Card>

      {hasLocations ? (
        <Grid container={true} direction="column" spacing={1}>
          <Grid item={true}>
            <Paper square={true}>
              <Box position="relative" p={2}>
                {canEdit && (
                  <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    className={`${classes.cardEditButton} marapp-qa-actioneditinline`}
                    onClick={toggleEditPlaces}
                  >
                    {t('edit')}
                  </Button>
                )}
                <Box mb={1}>
                  <Typography variant="subtitle1">
                    {t('Collection places')} ({locations.length})
                  </Typography>
                </Box>
                <Grid container={true} spacing={1}>
                  {locations
                    .filter((x) => !!x)
                    .map((location) => (
                      <Grid item={true}>
                        <Chip
                          label={location.name}
                          size="small"
                          className="marapp-qa-locationpill"
                        />
                      </Grid>
                    ))}
                </Grid>
              </Box>
            </Paper>
          </Grid>
          <Grid item={true}>
            <Paper square={true}>
              <Box position="relative" p={2}>
                <Box mb={1}>
                  <Typography variant="subtitle1">
                    {t('Download metrics')}
                    &nbsp;
                    <IconDownload />
                  </Typography>
                </Box>
                <Typography paragraph={true}>
                  {isDownloadingMetrics ? (
                    <>{t('Your selected metric files should be ready soon')}.</>
                  ) : (
                    <>
                      {t(
                        'Individual metrics related to each of the places in your collection can be viewed once downloaded'
                      )}
                      .{t('Select single or multiple metric data files for download')}.
                    </>
                  )}
                </Typography>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => setIsOnDownloadMetrics(true)}
                  disabled={isDownloadingMetrics}
                >
                  {isDownloadingMetrics ? (
                    <>
                      <Spinner size="nano" position="relative" className="ng-display-inline" />
                      {t('Downloading metrics')}
                    </>
                  ) : (
                    <>{t('Download metric data files')}</>
                  )}
                </Button>
                {downloadError && (
                  <p className="ng-form-error-block ng-margin-top">{downloadError}</p>
                )}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      ) : (
        <Paper square={true}>
          <Box position="relative" p={2}>
            <Typography variant="subtitle1">
              {t('Collection places')} {hasLocations && locations.length}
            </Typography>
            <Typography>
              {canEdit
                ? t(
                    `You currently don’t have any places added to your collection. Add places to your collection to access data metrics and share your insights with your team`
                  )
                : t(`There are no places added to this collection`)}
              .
            </Typography>
            {canEdit && (
              <button
                type="submit"
                className="marapp-qa-actionaddplaces ng-button ng-button-secondary ng-margin-right"
                onClick={toggleEditPlaces}
              >
                {t('Add places')}
              </button>
            )}
          </Box>
        </Paper>
      )}

      {isRenaming && (
        <CollectionRename
          collection={data}
          onCancel={() => setIsRenaming(false)}
          toggleRenaming={toggleRenaming}
          reloadCollection={reloadCollection}
        />
      )}

      {isAddingPlaces && (
        <CollectionEditPlaces
          collection={data}
          setCollectionData={setCollectionData}
          setMapBounds={setMapBounds}
          toggleEditPlaces={toggleEditPlaces}
          reloadCollection={reloadCollection}
        />
      )}

      {isDeleting && (
        <CollectionDelete collection={data} isDeleting={isDeleting} setIsDeleting={setIsDeleting} />
      )}

      {isOnDownloadMetrics && (
        <CollectionDownloadMetrics
          collection={data}
          onCancel={() => setIsOnDownloadMetrics(false)}
          onDownloadStart={() => [setIsDownloadingMetrics(true), setIsOnDownloadMetrics(false)]}
          onDownloadEnd={() => setIsDownloadingMetrics(false)}
          onDownloadError={setDownloadError}
          onDownloadSuccess={() => setDownloadError('')}
        />
      )}
    </div>
  );

  function toggleRenaming() {
    setIsRenaming(!isRenaming);
  }

  function toggleEditPlaces() {
    setIsAddingPlaces(!isAddingPlaces);
  }
};

export default CollectionDetails;
