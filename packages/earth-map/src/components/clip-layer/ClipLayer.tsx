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

import FileSaver from 'file-saver';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import Typography from '@material-ui/core/Typography';
import makeStyles from '@material-ui/core/styles/makeStyles';

const useStyles = makeStyles((theme) => ({
  header: {
    backgroundColor: theme.palette.grey['600'],
  },
  scrollContainer: {
    flex: '1 1 auto',
    overflow: 'auto',
  },
  radioGroup: {
    flexDirection: 'row',
  },
}));

import {
  AsyncSelect,
  Card,
  DropdownItem,
  ReactSelect,
  serializeFilters,
  Spinner,
  TitleHero,
} from '@marapp/earth-shared';

import { IPlace } from '../../modules/places/model';
import ExportService from '../../services/ExportService';
import LayersService from '../../services/LayersService';

interface IProps {
  place: Partial<IPlace>;
  onCancel?: () => void;
  groups?: string[];
}

const EXPORT_TYPES = [
  { name: 'GeoTIFF', value: 'geotiff', className: 'marapp-qa-downloadgeotiff' },
  { name: 'JPG', value: 'thumbnail', className: 'marapp-qa-downloadjpg' },
];

export function ClipLayer(props: IProps) {
  const { onCancel, place, groups } = props;
  const { id, name, organization } = place;
  const [saveError, setSaveError] = useState('');
  const [childLayers, setChildLayers] = useState([]);
  const { t } = useTranslation();
  const { register, handleSubmit, formState, control, watch, setValue } = useForm({
    mode: 'all',
  });
  const classes = useStyles();
  const { isDirty, isValid, isSubmitting } = formState;
  const selectedPrimaryLayer = watch('primaryLayer');
  const selectedChildLayer = watch('childLayer');
  const selectedExportType = watch('exportType');

  // When primaryLayer changes set child layers
  useEffect(() => {
    setChildLayers(selectedPrimaryLayer?.references || []);
  }, [selectedPrimaryLayer]);

  // clear errors when form changes
  useEffect(() => {
    setSaveError('');
  }, [selectedPrimaryLayer, selectedChildLayer, selectedExportType]);

  // Pre-select the first child layer
  useEffect(() => {
    setValue('childLayer', childLayers[0]);
  }, [childLayers]);

  // unable to make layers dropdown required otherwise
  const isValidCustom =
    isValid &&
    selectedExportType &&
    selectedPrimaryLayer &&
    (childLayers.length ? selectedChildLayer : true);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="marapp-qa-cliplayer sidebar-content-full ng-form ng-form-dark"
    >
      <Box mb={1}>
        <Paper className={classes.header} elevation={4} square={true}>
          <Box p={2}>
            <TitleHero title={name} subtitle={organization} extra={t('Collection')} />
          </Box>
        </Paper>
      </Box>

      <div className={classes.scrollContainer}>
        <Paper elevation={3}>
          <Box p={2}>
            <Grid container={true} spacing={2}>
              <Grid item={true} xs={12}>
                <label htmlFor="layer-selector" className="ng-text-bold">
                  {t('Select layer for download')}
                </label>
                <Controller
                  as={AsyncSelect}
                  id="layer-selector"
                  name="primaryLayer"
                  className="marapp-qa-primarylayers"
                  placeholder={t('Select Widget Layers')}
                  control={control}
                  getOptionLabel={(option, extra) => (
                    <DropdownItem title={option.name} subtitle={option.organization} />
                  )}
                  getOptionValue={(option) => option.id}
                  loadFunction={fetchPrimaryLayers}
                  selectedGroup={organization}
                  isClearable={true}
                  isSearchable={true}
                />
              </Grid>

              {!!childLayers.length && (
                <Grid item={true} xs={12}>
                  <label htmlFor="child-layer-selector" className="ng-text-bold">
                    {t('Select layer for download')}
                  </label>
                  <Box mb={2}>
                    <Controller
                      as={ReactSelect}
                      id="child-layer-selector"
                      name="childLayer"
                      className="marapp-qa-childlayers"
                      placeholder={t('Select Widget Layers')}
                      options={childLayers}
                      control={control}
                      getOptionLabel={(option) => option.name}
                      getOptionValue={(option) => option.id}
                      selectedGroup={organization}
                      isClearable={true}
                      isSearchable={true}
                    />
                  </Box>
                </Grid>
              )}

              <Grid item={true} xs={12}>
                <label className="ng-text-bold">{t('Select a file type for download')}</label>
                <Controller
                  name="exportType"
                  control={control}
                  as={
                    <RadioGroup className={classes.radioGroup}>
                      {EXPORT_TYPES.map((type) => (
                        <FormControlLabel
                          control={<Radio />}
                          className={type.className}
                          key={type.name}
                          label={type.name}
                          value={type.value}
                        />
                      ))}
                    </RadioGroup>
                  }
                />
              </Grid>

              {saveError && (
                <Grid item={true} xs={12}>
                  <Typography className="marapp-qa-formerror" color="error">
                    {saveError}
                  </Typography>
                </Grid>
              )}

              <Grid item={true} xs={12} container={true} spacing={1}>
                <Grid item={true}>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    color="secondary"
                    className="marapp-qa-actiondownload"
                    disabled={!isValidCustom || isSubmitting || !isDirty}
                  >
                    {isSubmitting ? (
                      <>
                        <Spinner size="nano" position="relative" className="ng-display-inline" />
                        {t('Downloading')}
                      </>
                    ) : (
                      <>{t('Download')}</>
                    )}
                  </Button>
                </Grid>

                <Grid item={true}>
                  <Button className="marapp-qa-actioncancel" size="large" onClick={onCancel}>
                    {t('Cancel')}
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </div>
    </form>
  );

  async function onSubmit(values) {
    const { exportType, primaryLayer } = values;
    const { childLayer: selectedLayer = primaryLayer } = values;
    const { config } = selectedLayer;
    const extension = exportType === 'geotiff' ? '.zip' : '.jpg';

    try {
      if (config.decodeConfig || config.decodeFunction) {
        throw new Error(t('Selected layers are currently not supported'));
      }

      const { data } = await ExportService.exportLayerForLocation(selectedLayer.id, id, {
        exportType,
        group: groups.join(','),
      });

      const rawResponse = await fetch(data.downloadURL);

      if (rawResponse.status === 200) {
        const blob = await rawResponse.blob();
        FileSaver.saveAs(blob, `${selectedLayer.name}${extension}`);
      } else {
        throw new Error(t('Could not download layer. Area too large'));
      }
    } catch (e) {
      if (!e) {
        setSaveError(t('Something went wrong'));
      } else if (e.status === 413) {
        setSaveError(t('Could not download layer. Area too large'));
      } else {
        setSaveError(e.message);
      }
    }
  }

  async function fetchPrimaryLayers(query) {
    try {
      const primaryLayers = await LayersService.fetchLayers({
        ...query,
        group: groups.join(','),
        filter: serializeFilters({
          primary: true,
          provider: 'gee',
        }),
        include: 'references',
        select: 'name,organization,config,references.name,references.config',
      });

      return primaryLayers;
    } catch (e) {
      setSaveError(t('Something went wrong'));
    } finally {
    }
  }
}
