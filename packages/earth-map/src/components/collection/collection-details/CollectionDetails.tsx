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

import cn from 'classnames';
import { isEmpty } from 'lodash';
import { ICollection } from 'modules/collections/model';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Card,
  DropdownSimple,
  getGenericDate,
  Pill,
  Spinner,
  TitleHero,
} from '@marapp/earth-shared';

import CollectionDelete from '../collection-delete';
import { CollectionDownloadMetrics } from '../collection-downloadmetrics';
import { CollectionEditPlaces } from '../collection-editplaces';
import { CollectionRename } from '../collection-rename';
import './styles.scss';

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
    <DropdownSimple
      trigger={(open) => (
        <i
          className={cn({
            'ng-icon-ellipse ng-toolbar-button': true,
            'ng-toolbar-button-raised': true,
            'ng-toolbar-button-open': open,
          })}
        />
      )}
    >
      <a onClick={() => setIsRenaming(true)}>{t('Rename Collection')}</a>
      <a onClick={() => setIsDeleting(true)}>{t('Delete')}</a>
    </DropdownSimple>
  );

  const { id, organization, name, locations, updatedAt } = data;
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
        <>
          <Card className="c-legend-item-group">
            {canEdit && (
              <button
                className="marapp-qa-actioneditinline ng-button ng-button-link ng-edit-card-button ng-text-transform-remove"
                onClick={toggleEditPlaces}
              >
                {t('edit')}
              </button>
            )}
            <h2 className="ng-text-display-s ng-body-color ng-margin-medium-bottom ng-margin-top-remove">
              {t('Collection places')} ({locations.length})
            </h2>
            <p>
              {locations
                .filter((x) => !!x)
                .map((location) => (
                  <Pill
                    label={location.name}
                    key={location.id}
                    className="marapp-qa-locationpill ng-margin-small-right ng-margin-small-bottom"
                  />
                ))}
            </p>
          </Card>
          <Card className="c-legend-item-group ng-margin-top">
            <h2 className="ng-text-display-s ng-body-color ng-margin-medium-bottom ng-margin-top-remove">
              {t('Download metrics')}
              &nbsp;
              <i className="ng-icon-download-outline ng-vertical-align-middle" />
            </h2>
            <p>
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
            </p>
            <button
              className="marapp-qa-actiondownloadmetrics ng-button ng-button-secondary"
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
            </button>
            {downloadError && <p className="ng-form-error-block ng-margin-top">{downloadError}</p>}
          </Card>
        </>
      ) : (
        <Card className="c-legend-item-group">
          <h2 className="ng-text-display-s ng-body-color ng-margin-bottom">
            {t('Collection places')} {hasLocations && locations.length}
          </h2>
          <p>
            {canEdit
              ? t(
                  `You currently don’t have any places added to your collection. Add places to your collection to access data metrics and share your insights with your team`
                )
              : t(`There are no places added to this collection`)}
            .
          </p>
          {canEdit && (
            <button
              type="submit"
              className="marapp-qa-actionaddplaces ng-button ng-button-secondary ng-margin-right"
              onClick={toggleEditPlaces}
            >
              {t('Add places')}
            </button>
          )}
        </Card>
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
