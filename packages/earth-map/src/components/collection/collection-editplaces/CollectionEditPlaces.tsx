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
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Typography from '@material-ui/core/Typography';
import isBoolean from 'lodash/isBoolean';
import React, { BaseSyntheticEvent, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { replace } from 'redux-first-router';

import { AsyncSelect, Card, DropdownItem } from '@marapp/earth-shared';

import { MAP_ENABLE_PUBLIC_ACCESS } from '../../../config';
import { ICollection } from '../../../modules/collections/model';
import { LocationTypeEnum } from '../../../modules/places/model';
import PlacesService from '../../../services/PlacesService';
import { CollectionConflict } from '../collection-conflict';
import CircularProgress from '@material-ui/core/CircularProgress';

interface IProps {
  collection: ICollection;
  setMapBounds: (payload?: any) => void;
  setCollectionData: (payload?: any) => void;
  toggleEditPlaces: () => void;
  reloadCollection: (payload?: any) => void;
}

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    zIndex: 2,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: theme.palette.background.default,
  },
  header: {
    backgroundColor: theme.palette.grey['600'],
  },
  scrollContainer: {
    flex: '1 1 auto',
    overflow: 'auto',
  },
}));

export function CollectionEditPlaces(props: IProps) {
  const { collection, setCollectionData, setMapBounds, toggleEditPlaces, reloadCollection } = props;
  const { t } = useTranslation();
  const classes = useStyles();
  const { id, slug, organization, name, locations, version } = collection;
  const [saveError, setSaveError] = useState('');
  const [isSaveConflict, setIsSaveConflict] = useState(false);
  const { control, handleSubmit, formState, getValues } = useForm({
    mode: 'all',
  });
  const { isValid, isSubmitting, isDirty } = formState;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={`${classes.root} collection-edit-places`}>
      <Box mb={1}>
        <Paper square={true} elevation={3} className={classes.header}>
          <Box p={2}>
            <Typography variant="subtitle1" color="textPrimary" gutterBottom={true}>
              {organization} |{' '}
              <Typography component="span" variant="subtitle1" color="textPrimary">
                {t('Collection')}
              </Typography>
            </Typography>

            <Typography variant="h5" component="h2" color="textPrimary">
              {name}
            </Typography>
          </Box>
        </Paper>
      </Box>

      <div className={classes.scrollContainer}>
        <Paper square={true}>
          <Box p={2}>
            <Grid container={true} spacing={2}>
              <Grid item={true} xs={12}>
                <Typography component="label" gutterBottom={true}>
                  {t('Add places')}:
                </Typography>
                <Controller
                  as={AsyncSelect}
                  name="locations"
                  type="places"
                  label={t('Add places')}
                  placeholder={t('Add places to your collection')}
                  className="marapp-qa-locationsdropdown"
                  control={control}
                  defaultValue={locations}
                  getOptionLabel={(option, extra) => {
                    const itemProps: any = {
                      title: option.name,
                    };

                    if (MAP_ENABLE_PUBLIC_ACCESS) {
                      itemProps.subtitle = option.organization;
                    }

                    return <DropdownItem {...itemProps} />;
                  }}
                  getOptionValue={(option) => option.id}
                  loadFunction={(query) =>
                    PlacesService.fetchPlaces({
                      ...query,
                      filter: ['type', '!=', LocationTypeEnum.COLLECTION].join(''),
                      select: ['id', 'slug', 'name', 'organization'].join(','),
                      group: organization,
                      public: true,
                    })
                  }
                  selectedGroup={organization}
                  isClearable={true}
                  isSearchable={true}
                  isMulti={true}
                  closeMenuOnSelect={false}
                />
              </Grid>

              {saveError && (
                <Grid item={true} xs={12}>
                  <Typography color="error">{saveError}</Typography>
                </Grid>
              )}

              <Grid item={true} xs={12} container={true} spacing={1}>
                <Grid item={true}>
                  <Button
                    className="marapp-qa-actionsave"
                    color="secondary"
                    variant="contained"
                    size="large"
                    type="submit"
                    disabled={!isValid || isSubmitting || !isDirty}
                    endIcon={isSubmitting && <CircularProgress size={16} />}
                  >
                    {t(isSubmitting ? 'Saving' : 'Save')}
                  </Button>
                </Grid>
                <Grid item={true}>
                  <Button
                    className="marapp-qa-actioncancel"
                    onClick={toggleEditPlaces}
                    size="large"
                  >
                    {t('Cancel')}
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </Paper>

        {isSaveConflict && <CollectionConflict onRefresh={refresh} onOverwrite={saveAnyway} />}
      </div>
    </form>
  );

  /**
   * Receives event when called by react-hook-form and boolean when called by us
   */
  async function onSubmit(values, optional: BaseSyntheticEvent | boolean) {
    const shouldOverwrite = isBoolean(optional);
    const parsedValues = {
      ...values,

      // The api expects an array of ids or an empty array
      // should this be handled by AsyncSelect?
      ...(values.locations ? { locations: values.locations.map((x) => x.id) } : { locations: [] }),
      // Sending the version to the backend will kick in the version validation
      // To keep the api backwards compatible, when no version is passed, we overwrite
      ...(!shouldOverwrite && { version }),
    };

    try {
      const { data } = await PlacesService.updateCollection(id, parsedValues, {
        group: organization,
        include: 'locations',
      });
      setCollectionData(data);
      resetErrors();

      // someone changed the slug, redirect to the new collection
      if (slug !== data.slug) {
        replace(`/collection/${organization}/${data.slug}`);
      }

      if (data.bbox2d.length) {
        setMapBounds({ bbox: data.bbox2d });
      }
      toggleEditPlaces();
    } catch (e) {
      if (!e) {
        setSaveError('Something went wrong');
      } else if (e.status === 404) {
        replace('/404');
      } else if (e.data.errors.find((err) => err.title === 'DocumentVersionError')) {
        setIsSaveConflict(true);
      }
      console.log(e);
    }
  }

  function refresh() {
    reloadCollection({ organization, id, slug });
    toggleEditPlaces();
  }

  function saveAnyway() {
    const values = getValues();
    onSubmit(values, true);
  }

  function resetErrors() {
    setSaveError(null);
    setIsSaveConflict(false);
  }
}
