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
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Typography from '@material-ui/core/Typography';
import FileSaver from 'file-saver';
import flatten from 'flat';
import json2csv from 'json2csv';
import JSZip from 'jszip';
import { groupBy } from 'lodash';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { ReactSelect, serializeFilters, TitleHero } from '@marapp/earth-shared';

import { ICollection } from '../../../fetchers/locations/queries';
import MetricService from '../../../services/MetricService';
import CircularProgress from '@material-ui/core/CircularProgress';

interface IProps {
  collection: ICollection;
  onCancel: () => void;
  onDownloadStart: () => void;
  onDownloadEnd: () => void;
  onDownloadError: (err: string) => void;
  onDownloadSuccess: () => void;
}

const FILE_TYPES = [
  { name: 'CSV', value: 'csv', className: 'marapp-qa-downloadmetricscsv' },
  { name: 'JSON', value: 'json', className: 'marapp-qa-downloadmetricsjson' },
];

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

export function CollectionDownloadMetrics(props: IProps) {
  const {
    collection,
    onCancel,
    onDownloadStart,
    onDownloadEnd,
    onDownloadError,
    onDownloadSuccess,
  } = props;
  const { t } = useTranslation();
  const { name, organization, slug: collectionSlug } = collection;
  const [metricSlugs, setMetricSlugs] = useState([]);
  const [isLoadingMetricSlugs, setIsLoadingMetricSlugs] = useState(false);
  const { handleSubmit, formState, control, watch } = useForm({
    mode: 'all',
  });
  const { isDirty, isValid, isSubmitting } = formState;
  const metricsWatcher = watch('metrics');
  const classes = useStyles();

  useEffect(() => {
    (async () => {
      setIsLoadingMetricSlugs(true);

      const data = await MetricService.fetchMetricSlugs({ group: organization });

      setMetricSlugs(data.map((item) => ({ value: item.slug, label: item.slug })));

      setIsLoadingMetricSlugs(false);
    })();
  }, []);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={classes.root}>
      <Box mb={1}>
        <Paper square={true} elevation={3} className={classes.header}>
          <Box p={2}>
            <TitleHero title={name} subtitle={organization} extra={t('Collection')} />
          </Box>
        </Paper>
      </Box>

      <div className={classes.scrollContainer}>
        <Paper square={true}>
          <Box p={2}>
            <Grid container={true} spacing={2}>
              <Grid item={true} xs={12}>
                <Typography component="label" gutterBottom={true}>
                  {t('Select metrics for download')}
                </Typography>

                <Controller
                  as={ReactSelect}
                  name="metrics"
                  type="metrics"
                  placeholder={t('Select metrics to download data files')}
                  className="marapp-qa-downloadmetricsdropdown"
                  options={metricSlugs}
                  isLoading={isLoadingMetricSlugs}
                  defaultValue={[]}
                  control={control}
                  isClearable={true}
                  isSearchable={true}
                  isMulti={true}
                  closeMenuOnSelect={false}
                />
              </Grid>

              <Grid item={true} xs={12}>
                <Typography component="label">{t('Select a file type for download')}</Typography>

                <Controller
                  name="fileType"
                  control={control}
                  as={
                    <RadioGroup row={true}>
                      {FILE_TYPES.map((type) => (
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
                  rules={{
                    required: true,
                  }}
                />
              </Grid>

              <Grid item={true} xs={12} container={true} spacing={1}>
                <Grid item={true}>
                  <Button
                    variant="contained"
                    color="secondary"
                    type="submit"
                    size="large"
                    className="marapp-qa-actiondownload"
                    disabled={!isValid || isSubmitting || !isDirty || !metricsWatcher?.length}
                    endIcon={isSubmitting && <CircularProgress size={16} />}
                  >
                    {t(isSubmitting ? 'Downloading' : 'Download')}
                  </Button>
                </Grid>
                <Grid item={true}>
                  <Button className="marapp-qa-actioncancel" onClick={onCancel} size="large">
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
    onDownloadStart();

    const { metrics, fileType } = values;

    try {
      const data = await MetricService.downloadMetrics(collectionSlug, {
        filter: serializeFilters({
          slug: metrics.map((metric) => metric.value),
        }),
        group: organization,
        include: 'location',
        select: 'location.name',
      });

      const zip = new JSZip();

      const metricTypes = groupBy(data, 'slug');
      const locationNameField = '#';

      Object.keys(metricTypes).forEach((metricType) => {
        const normalizedData = metricTypes[metricType].map((item) => ({
          [locationNameField]: item.location.name,
          ...item.metric,
        }));
        const fileName = `${metricType}.${fileType}`;

        if (fileType === 'csv') {
          const json2csvParser = new json2csv.Parser();

          zip.file(
            fileName,
            json2csvParser.parse(
              normalizedData.map(({ [locationNameField]: locationName, ...item }) => ({
                [locationNameField]: locationName,
                ...flatten(item),
              }))
            )
          );
        } else {
          zip.file(fileName, JSON.stringify(normalizedData));
        }
      });

      const zipName = `${collectionSlug}-metrics.zip`;
      const zipContent = await zip.generateAsync({ type: 'blob' });

      FileSaver.saveAs(zipContent, zipName);
      onDownloadSuccess();
    } catch (e) {
      onDownloadError('Something went wrong');
      console.log(e);
    }

    onDownloadEnd();
  }
}
