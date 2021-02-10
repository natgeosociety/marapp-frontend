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
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Typography from '@material-ui/core/Typography';
import isBoolean from 'lodash/isBoolean';
import React, { BaseSyntheticEvent, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { replace } from 'redux-first-router';

import { MuiInput, setupErrors } from '@marapp/earth-shared';

import { ICollection } from '../../../fetchers/locations/queries';
import PlacesService from '../../../services/PlacesService';
import { CollectionConflict } from '../collection-conflict';

interface IProps {
  collection: ICollection;
  onCancel: () => void;
  toggleRenaming: (payload?: any) => void;
  mutateCollection: any;
  onSlugChange: (payload: any) => void;
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

export function CollectionRename(props: IProps) {
  const { collection, onCancel, mutateCollection, onSlugChange, toggleRenaming } = props;
  const { id, slug, name, organization, version } = collection;
  const { t } = useTranslation();
  const classes = useStyles();
  const [saveError, setSaveError] = useState('');
  const [isSaveConflict, setIsSaveConflict] = useState(false);
  const { register, errors, handleSubmit, formState, getValues, control } = useForm({
    mode: 'all',
  });
  const { touched, isDirty, isValid, isSubmitting } = formState;
  const renderErrorFor = setupErrors(errors, touched);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={`${classes.root} collection-rename`}>
      <Box mb={1}>
        <Paper square={true} elevation={3} className={classes.header}>
          <Box p={2}>
            <Typography variant="h5" component="h2" color="textPrimary">
              {t('Rename Collection')}
            </Typography>
          </Box>
        </Paper>
      </Box>

      <div className={classes.scrollContainer}>
        <Paper square={true}>
          <Box p={2} mb={1}>
            <Box mb={2}>
              <Controller
                as={MuiInput}
                name="name"
                className="marapp-qa-collection-name-input"
                label={t('Name Collection')}
                placeholder={t('enter a name for your collection')}
                control={control}
                defaultValue={name}
                required={true}
                error={renderErrorFor('name')}
                inputRef={register({
                  required: t('Collection name is required') as string,
                })}
              />
            </Box>

            {saveError && (
              <Typography color="error" paragraph={true}>
                {saveError}
              </Typography>
            )}

            <Grid container={true} spacing={1}>
              <Grid item={true}>
                <Button
                  className="marapp-qa-save-collection"
                  type="submit"
                  variant="contained"
                  color="secondary"
                  size="large"
                  disabled={!isDirty || !isValid || isSubmitting}
                  endIcon={isSubmitting && <CircularProgress size={16} />}
                >
                  {t(isSubmitting ? 'Renaming collection' : 'Rename Collection')}
                </Button>
              </Grid>
              <Grid item={true}>
                <Button className="marapp-qa-cancel-collection" onClick={onCancel} size="large">
                  {t('Cancel')}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Paper>

        {isSaveConflict && (
          <CollectionConflict
            onRefresh={() => {
              onSlugChange(id);
              toggleRenaming();
            }}
            onOverwrite={saveAnyway}
          />
        )}
      </div>
    </form>
  );

  async function onSubmit(values, optional: BaseSyntheticEvent | boolean) {
    const shouldOverwrite = isBoolean(optional);
    try {
      const { data } = await mutateCollection(
        PlacesService.updatePlace(
          id,
          {
            name: values.name,
            slug: null,
            // Sending the version to the backend will kick in the version validation
            // To keep the api backwards compatible, when no version is passed, we overwrite
            ...(!shouldOverwrite && { version }),
          },
          { group: organization }
        ),
        false // don't trigger another request
      );
      onCancel();
    } catch (e) {
      if (!e) {
        setSaveError('Something went wrong');
      } else if (e.status === 404) {
        replace('/404');
      } else if (e.data.errors.find((err) => err.title === 'DocumentVersionError')) {
        setIsSaveConflict(true);
      }
    }
  }

  function saveAnyway() {
    const values = getValues();
    onSubmit(values, true);
  }
}
