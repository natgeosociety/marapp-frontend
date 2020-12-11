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

import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import {
  TitleHero,
  Card,
  AsyncSelect,
  ReactSelect,
  Spinner,
  serializeFilters,
} from '@marapp/earth-shared';
import { IPlace } from 'modules/places/model';
import LayersService from 'services/LayersService';
import ExportService from 'services/ExportService';

interface IProps {
  place: Partial<IPlace>;
  onCancel?: () => void;
}

export function ClipLayer(props: IProps) {
  const { onCancel, place } = props;
  const { name, organization } = place;
  const [primaryLayers, setPrimaryLayers] = useState([]);
  const [childLayers, setChildLayers] = useState([]);
  const { t } = useTranslation();
  const { register, handleSubmit, formState, control, watch } = useForm({
    mode: 'onChange',
  });
  const { dirty, isValid, isSubmitting } = formState;
  const selectedPrimaryLayer = watch('primary-layer');
  const selectedChildLayer = watch('child-layer');

  console.log(selectedPrimaryLayer, selectedChildLayer);

  // unable to make layers dropdown required otherwise
  const isValidCustom =
    isValid && selectedPrimaryLayer && (childLayers.length ? selectedChildLayer : true);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="sidebar-content-full ng-form ng-form-dark">
      <Card elevation="high" className="ng-margin-bottom">
        <TitleHero title={name} subtitle={organization} extra={t('Collection')} />
      </Card>

      <div className="scroll-container">
        <Card elevation="raised">
          <label htmlFor="layer-selector" className="ng-text-bold">
            {t('Select layer for download')}
          </label>
          <Controller
            as={AsyncSelect}
            id="layer-selector"
            name="primary-layer"
            className="marapp-qa-layers ng-margin-medium-bottom"
            placeholder={t('Select Widget Layers')}
            control={control}
            getOptionLabel={(option) => option.name}
            getOptionValue={(option) => option.id}
            loadFunction={fetchPrimaryLayers}
            selectedGroup={organization}
            onChange={([selectedLayer]) => {
              setChildLayers(selectedLayer?.references || []);
              return selectedLayer;
            }}
            isMulti={false}
            isClearable={true}
            isSearchable={true}
            closeMenuOnSelect={false}
          />

          {!!childLayers.length && (
            <>
              <label htmlFor="child-layer-selector" className="ng-text-bold">
                {t('Select layer for download')}
              </label>
              <Controller
                as={ReactSelect}
                id="child-layer-selector"
                name="child-layer"
                className="marapp-qa-layers ng-margin-medium-bottom"
                placeholder={t('Select Widget Layers')}
                options={childLayers}
                control={control}
                getOptionLabel={(option) => option.name}
                getOptionValue={(option) => option.id}
                selectedGroup={organization}
                isMulti={false}
                isClearable={true}
                isSearchable={true}
                closeMenuOnSelect={false}
              />
            </>
          )}

          <label className="ng-text-bold">{t('Select a file type for download')}</label>
          <div className="legend-item-group--radio ng-margin-top ng-margin-medium-bottom">
            <div className="ng-display-inline-block ng-margin-medium-right">
              <input
                type="radio"
                id="radio-geotiff"
                value="geotiff"
                name="fileType"
                ref={register({
                  required: true,
                })}
                className="marapp-qa-downloadmetricsgeotiff"
              />
              <label htmlFor="radio-geotiff">
                <span className="legend-item-group--symbol" />
                <span className="legend-item-group--name">GeoTIFF</span>
              </label>
            </div>
            <div className="ng-display-inline-block ng-margin-medium-left">
              <input
                type="radio"
                id="radio-jpg"
                value="jpg"
                name="fileType"
                ref={register({
                  required: true,
                })}
                className="marapp-qa-downloadmetricsjpg"
              />
              <label htmlFor="radio-jpg">
                <span className="legend-item-group--symbol" />
                <span className="legend-item-group--name">JPG</span>
              </label>
            </div>
          </div>
          <button
            type="submit"
            className="marapp-qa-actiondownload ng-button ng-button-primary ng-margin-right"
            disabled={!isValidCustom || isSubmitting || !dirty}
          >
            {isSubmitting ? (
              <>
                <Spinner size="nano" position="relative" className="ng-display-inline" />
                {t('Downloading')}
              </>
            ) : (
              <>{t('Download')}</>
            )}
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

  function onSubmit(values) {
    console.log(values);
  }

  async function fetchPrimaryLayers(query) {
    try {
      const primaryLayers = await LayersService.fetchLayers({
        ...query,
        group: organization,
        filters: serializeFilters({
          primary: true,
          provider: 'gee',
        }),
        include: 'references',
        select: 'name,references.name',
      });

      return primaryLayers;
    } catch (e) {
    } finally {
    }
  }
}
