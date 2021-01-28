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
import flatten from 'flat';
import json2csv from 'json2csv';
import JSZip from 'jszip';
import { groupBy } from 'lodash';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Card, ReactSelect, serializeFilters, TitleHero } from '@marapp/earth-shared';

import { ICollection } from '../../../modules/collections/model';
import MetricService from '../../../services/MetricService';

interface IProps {
  collection: ICollection;
  onCancel: () => void;
  onDownloadStart: () => void;
  onDownloadEnd: () => void;
  onDownloadError: (err: string) => void;
  onDownloadSuccess: () => void;
}

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
  const { register, handleSubmit, formState, control, watch } = useForm({
    mode: 'all',
  });
  const { isDirty, isValid, isSubmitting } = formState;
  const metricsWatcher = watch('metrics');

  useEffect(() => {
    (async () => {
      setIsLoadingMetricSlugs(true);

      const data = await MetricService.fetchMetricSlugs({ group: organization });

      setMetricSlugs(data.map((item) => ({ value: item.slug, label: item.slug })));

      setIsLoadingMetricSlugs(false);
    })();
  }, []);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="sidebar-content-full ng-form ng-form-dark">
      <Card elevation="high" className="ng-margin-bottom">
        <TitleHero title={name} subtitle={organization} extra={t('Collection')} />
      </Card>

      <div className="scroll-container">
        <Card elevation="raised">
          <label>{t('Select metrics for download')}</label>
          <Controller
            as={ReactSelect}
            name="metrics"
            type="metrics"
            placeholder={t('Select metrics to download data files')}
            className="marapp-qa-downloadmetricsdropdown ng-margin-medium-bottom"
            options={metricSlugs}
            isLoading={isLoadingMetricSlugs}
            defaultValue={[]}
            control={control}
            isClearable={true}
            isSearchable={true}
            isMulti={true}
            closeMenuOnSelect={false}
          />
          <label>{t('Select a file type for download')}</label>
          <div className="legend-item-group--radio ng-margin-top ng-margin-medium-bottom">
            <div className="ng-display-inline-block ng-margin-medium-right">
              <input
                type="radio"
                id={`radio-csv`}
                value={'csv'}
                name="fileType"
                ref={register({
                  required: true,
                })}
                className="marapp-qa-downloadmetricscsv"
              />
              <label htmlFor={`radio-csv`}>
                <span className="legend-item-group--symbol" />
                <span className="legend-item-group--name">CSV</span>
              </label>
            </div>
            <div className="ng-display-inline-block ng-margin-medium-left">
              <input
                type="radio"
                id={`radio-json`}
                value={'json'}
                name="fileType"
                ref={register({
                  required: true,
                })}
                className="marapp-qa-downloadmetricsjson"
              />
              <label htmlFor={`radio-json`}>
                <span className="legend-item-group--symbol" />
                <span className="legend-item-group--name">JSON</span>
              </label>
            </div>
          </div>
          <button
            type="submit"
            className="marapp-qa-actiondownload ng-button ng-button-primary ng-margin-right"
            disabled={!isValid || isSubmitting || !isDirty || !metricsWatcher?.length}
          >
            {t('Download')}
          </button>
          <button
            className="marapp-qa-actioncancel ng-button ng-button-secondary"
            onClick={onCancel}
          >
            {t('Cancel')}
          </button>
        </Card>
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
