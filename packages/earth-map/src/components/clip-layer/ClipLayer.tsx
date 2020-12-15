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
import { IPlace } from 'modules/places/model';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import ExportService from 'services/ExportService';
import LayersService from 'services/LayersService';

import {
  AsyncSelect,
  Card,
  DropdownItem,
  ReactSelect,
  serializeFilters,
  Spinner,
  TitleHero,
} from '@marapp/earth-shared';

interface IProps {
  place: Partial<IPlace>;
  onCancel?: () => void;
  groups?: string[];
}

export function ClipLayer(props: IProps) {
  const { onCancel, place, groups } = props;
  const { id, name, organization } = place;
  const [saveError, setSaveError] = useState('');
  const [childLayers, setChildLayers] = useState([]);
  const { t } = useTranslation();
  const { register, handleSubmit, formState, control, watch } = useForm({
    mode: 'onChange',
  });
  const { dirty, isValid, isSubmitting } = formState;
  const selectedPrimaryLayer = watch('primaryLayer');
  const selectedChildLayer = watch('childLayer');

  // unable to make layers dropdown required otherwise
  const isValidCustom =
    isValid && selectedPrimaryLayer && (childLayers.length ? selectedChildLayer : true);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="marapp-qa-cliplayer sidebar-content-full ng-form ng-form-dark"
    >
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
            name="primaryLayer"
            className="marapp-qa-primarylayers ng-margin-medium-bottom"
            placeholder={t('Select Widget Layers')}
            control={control}
            getOptionLabel={(option, extra) => (
              <DropdownItem title={option.name} subtitle={option.organization} />
            )}
            getOptionValue={(option) => option.id}
            loadFunction={fetchPrimaryLayers}
            selectedGroup={organization}
            onChange={([selectedLayer]) => {
              setSaveError('');
              setChildLayers(selectedLayer?.references || []);
              return selectedLayer;
            }}
            isClearable={true}
            isSearchable={true}
          />

          {!!childLayers.length && (
            <>
              <label htmlFor="child-layer-selector" className="ng-text-bold">
                {t('Select layer for download')}
              </label>
              <Controller
                as={ReactSelect}
                id="child-layer-selector"
                name="childLayer"
                className="marapp-qa-childlayers ng-margin-medium-bottom"
                placeholder={t('Select Widget Layers')}
                options={childLayers}
                control={control}
                defaultValue={childLayers[0]}
                getOptionLabel={(option) => option.name}
                getOptionValue={(option) => option.id}
                selectedGroup={organization}
                isClearable={true}
                isSearchable={true}
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
                name="exportType"
                ref={register({
                  required: true,
                })}
                className="marapp-qa-downloadgeotiff"
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
                value="thumbnail"
                name="exportType"
                ref={register({
                  required: true,
                })}
                className="marapp-qa-downloadjpg"
              />
              <label htmlFor="radio-jpg">
                <span className="legend-item-group--symbol" />
                <span className="legend-item-group--name">JPG</span>
              </label>
            </div>
          </div>

          {saveError && (
            <p className="marapp-qa-formerror ng-form-error-block ng-margin-bottom">{saveError}</p>
          )}

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

  async function onSubmit(values) {
    const { exportType, primaryLayer } = values;
    const { childLayer: selectedLayer = primaryLayer } = values;
    const extension = exportType === 'geotiff' ? '.zip' : '.jpg';

    try {
      const { data } = await ExportService.exportLayerForLocation(selectedLayer.id, id, {
        exportType,
        group: groups.join(','),
      });

      const rawResponse = await fetch(data.downloadURL);
      const blob = await rawResponse.blob();

      FileSaver.saveAs(blob, `${selectedLayer.name}${extension}`);
    } catch (e) {
      if (!e) {
        setSaveError(t('Something went wrong'));
      } else if (e.status === 413) {
        setSaveError(t('Could not download layer. Area too large'));
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
        select: 'name,organization,references.name',
      });

      return primaryLayers;
    } catch (e) {
      setSaveError(t('Something went wrong'));
    } finally {
    }
  }
}
