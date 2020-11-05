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
import { isEmpty } from 'lodash';

import { Card, Spinner, TitleHero, AsyncSelect, Pill } from '@marapp/earth-shared';

import { ICollection } from 'modules/collections/model';
import { updateCollection } from 'services/CollectionsService';
import PlacesService from 'services/PlacesService';

import './styles.scss';

interface IProps {
  placesFromGroups: string[];
  privateGroups: string[];
  data?: ICollection;
  loading?: boolean;
  error?: any;

  setCollectionData?: (payload: ICollection) => void;
  setMapBounds?: (payload: any) => void;
}

const CollectionDetails = (props: IProps) => {
  const { placesFromGroups, privateGroups, loading, data, setMapBounds, setCollectionData } = props;
  const [isAddingPlaces, setIsAddingPlaces] = useState(false);
  const [saveError, setSaveError] = useState('');
  const { control, handleSubmit, formState } = useForm({
    mode: 'onChange',
  });
  const { isValid, isSubmitting, dirty } = formState;
  const canEdit = privateGroups.includes(data.organization);

  if (loading || isEmpty(data)) {
    return <Spinner />;
  }

  const { id, organization, name, locations } = data;
  const hasLocations = locations.length > 0;

  return (
    <div className="marapp-qa-collection-details">
      <Card elevation="flush" className="ng-widget-header">
        <TitleHero title={name} subtitle={organization} extra="Collection" />
      </Card>

      {hasLocations ? (
        <Card className="c-legend-item-group">
          {canEdit && (
            <button
              className="marapp-qa-actioneditinline ng-button ng-button-link ng-edit-card-button ng-text-transform-remove"
              onClick={toggleEditPlaces}
            >
              edit
            </button>
          )}
          <h2 className="ng-text-display-s ng-body-color ng-margin-medium-bottom ng-margin-top-remove">
            Collection places ({locations.length})
          </h2>
          <p>
            {locations
              .filter((x) => !!x)
              .map((location) => (
                <Pill
                  label={location.name}
                  className="marapp-qa-locationpill ng-margin-small-right ng-margin-small-bottom"
                />
              ))}
          </p>
        </Card>
      ) : (
        <Card className="c-legend-item-group">
          <h2 className="ng-text-display-s ng-body-color ng-margin-bottom">
            Collection places {hasLocations && locations.length}
          </h2>
          <p>
            {canEdit
              ? `You currently don’t have any places added to your collection. Add places to your
            collection to access data metrics and share your insights with your team.`
              : `There are no places added to this collection.`}
          </p>
          {canEdit && (
            <button
              type="submit"
              className="marapp-qa-actionaddplaces ng-button ng-button-secondary ng-margin-right"
              onClick={toggleEditPlaces}
            >
              Add places
            </button>
          )}
        </Card>
      )}

      {isAddingPlaces && (
        <form onSubmit={handleSubmit(onSubmit)} className="sidebar-content-full">
          <Card elevation="high" className="ng-margin-bottom">
            <TitleHero title={name} subtitle={organization} extra="Collection" />
          </Card>

          <div className="scroll-container">
            <Card elevation="raised">
              <label>Add places:</label>
              <Controller
                as={AsyncSelect}
                name="locations"
                type="places"
                label="Add places"
                placeholder="Add places to your collection"
                className="marapp-qa-locationsdropdown ng-margin-medium-bottom"
                control={control}
                defaultValue={locations}
                getOptionLabel={(option) => option.name}
                getOptionValue={(option) => option.id}
                loadFunction={(query) =>
                  PlacesService.fetchPlaces({
                    ...query,
                    group: placesFromGroups.join(','),
                  })
                }
                selectedGroup={organization}
                isClearable={true}
                isSearchable={true}
                isMulti={true}
                closeMenuOnSelect={false}
              />

              {saveError && <p className="ng-form-error-block ng-margin-bottom">{saveError}</p>}

              <button
                type="submit"
                className="marapp-qa-actionsave ng-button ng-button-primary ng-margin-right"
                disabled={!isValid || isSubmitting || !dirty}
              >
                {isSubmitting ? 'Saving' : 'Save'}
              </button>
              <button
                className="marapp-qa-actioncancel ng-button ng-button-secondary"
                onClick={toggleEditPlaces}
              >
                Cancel
              </button>
            </Card>
          </div>
        </form>
      )}
    </div>
  );

  async function onSubmit(values) {
    const parsedValues = {
      ...values,

      // The api expects an array of ids or an empty array
      // should this be handled by AsyncSelect?
      ...(values.locations ? { locations: values.locations.map((x) => x.id) } : { locations: [] }),
    };

    try {
      const { data } = await updateCollection(id, parsedValues, {
        group: organization,
        include: 'locations',
        select: 'locations.slug,locations.name',
      });
      setCollectionData(data);
      toggleEditPlaces();
      setSaveError(null);

      if (data.bbox2d.length) {
        setMapBounds({ bbox: data.bbox2d });
      }
    } catch (e) {
      setSaveError('Something went wrong');
      console.log(e);
    }
  }

  function toggleEditPlaces() {
    setIsAddingPlaces(!isAddingPlaces);
    setSaveError('');
  }
};

export default CollectionDetails;
