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

import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { replace } from 'redux-first-router';
import Link from 'redux-first-router-link';

import { Card, setupErrors } from '@marapp/earth-shared';

import { IRouter } from '../../../modules/router/model';
import PlacesService from '../../../services/PlacesService';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';

interface IProps {
  privateGroups: string[];
  router?: IRouter;
}

const CollectionNew = (props: IProps) => {
  const { privateGroups, router } = props;
  const { prev } = router;
  const { t } = useTranslation();
  const canCreateCollection = !!privateGroups.length;
  const [saveError, setSaveError] = useState(null);
  const { handleSubmit, register, errors, formState, control } = useForm({ mode: 'all' });
  const { touched, isDirty, isValid, isSubmitting } = formState;
  const renderErrorFor = setupErrors(errors, touched);

  const onSubmit = async (values) => {
    try {
      const { data } = await PlacesService.addCollection(values, {
        group: values.organization,
      });
      replace(`/collection/${data.organization}/${data.slug}`);
    } catch (e) {
      if (typeof e === 'undefined') {
        return setSaveError('Unable to create collection. You might be offline');
      } else if (e?.data?.errors.length) {
        const [firstError] = e.data.errors;
        return setSaveError(firstError.detail);
      }
    }
  };

  return (
    <form className="marapp-qa-collection-new" onSubmit={handleSubmit(onSubmit)}>
      <Card elevation="high" className="ng-margin-bottom">
        <Typography variant="h5" component="h2" color="textPrimary">
          {t('Create a Collection')}
        </Typography>
      </Card>

      <Paper>
        <Box p={2} mb={1}>
          <Grid container={true} direction="column" spacing={3}>
            <Grid item={true}>
              {canCreateCollection && (
                <Controller
                  as={TextField}
                  name="name"
                  label={t('Name Collection')}
                  variant="outlined"
                  fullWidth={true}
                  placeholder={t('enter a name for your collection')}
                  error={renderErrorFor('name')}
                  control={control}
                />
              )}
            </Grid>

            <Grid item={true}>
              <Typography variant="subtitle1" gutterBottom={true}>
                {t('Select an Organization')}
              </Typography>
              <Typography>
                {canCreateCollection
                  ? t(
                      `Please select an organization to create a collection under. After selecting an organization, you will be able to select places and share insights with members of your selected organization. Organizations can not be edited once picked`
                    )
                  : t(`You don't have rights to create a new collection`)}
                .
              </Typography>
            </Grid>

            <Grid item={true}>
              <Controller
                name="organization"
                control={control}
                as={
                  <RadioGroup>
                    {privateGroups.map((group) => (
                      <FormControlLabel value={group} control={<Radio />} label={group} />
                    ))}
                  </RadioGroup>
                }
              />
            </Grid>

            <Grid item={true}>
              {saveError && <p className="ng-form-error-block ng-margin-bottom">{saveError}</p>}
              <Grid container={true} spacing={1}>
                <Grid item={true}>
                  <Button
                    variant="contained"
                    color="secondary"
                    type="submit"
                    disabled={!isValid || !isDirty || isSubmitting || !canCreateCollection}
                  >
                    {t('Create Collection')}
                  </Button>
                </Grid>
                <Grid item={true}>
                  <Button
                    component={Link}
                    className="marapp-qa-cancel-collection"
                    to={{
                      type: EarthRoutes.EARTH,
                      query: prev.query,
                    }}
                  >
                    {t('Cancel')}
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </form>
  );
};

export default CollectionNew;
