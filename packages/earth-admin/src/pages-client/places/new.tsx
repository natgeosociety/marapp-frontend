import * as React from 'react';
import { useState } from 'react';
import { navigate } from 'gatsby';
import { useForm, Controller } from 'react-hook-form';
import { JSHINT } from 'jshint';

import { useAuth0 } from 'auth/auth0';
import { addPlace } from 'services/places';
import { PlaceTypeEnum } from './model';

import { JsonEditor, LinkWithOrg, ErrorMessages } from 'components';
import { Card } from 'components/card';
import { ContentLayout } from 'layouts';

export default function NewPlace(path: any) {
  const { getValues, register, formState, triggerValidation, control } = useForm({
    mode: 'onChange',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [geojsonValue, setGeojson] = useState();
  const [serverErrors, setServerErrors] = useState([]);
  const [jsonError, setJsonError] = useState(false);
  const { selectedGroup } = useAuth0();
  const INPUT_SIZE_CLASSNAME = 'ng-width-1-1 ng-form-large';

  async function onSubmit(e) {
    e.preventDefault();

    const formData = getValues();
    try {
      setIsLoading(true);
      await addPlace(formData, selectedGroup);
      await navigate(`${selectedGroup}/places`);
    } catch (error) {
      setServerErrors(error.data.errors);
    }
  }

  const handleJsonChange = (json) => {
    try {
      JSON.parse(json);
    } catch (err) {
      setJsonError(true);
    }
    if (!JSHINT.errors.length) {
      const parsedJson = JSON.parse(json);
      setGeojson(parsedJson);
      setJsonError(false);
      return parsedJson;
    }
    setJsonError(true);
  };

  const handleUpload = (e) => {
    console.log(e);
    debugger;
  }

  return (
    <ContentLayout errors={serverErrors} backTo="/places" isLoading={isLoading}>
      <div>
        <div className="ng-flex ng-flex-space-between">
          <h2 className="ng-text-display-m ng-c-flex-grow-1">New place</h2>
        </div>

        <form className="ng-form ng-form-dark ng-flex-column ng-width-4-5">

          {/* need a card component here */}
          <Card>
            <label className="ng-form-label" htmlFor="name">
              Title*
              </label>
            <input
              ref={register({
                required: true,
              })}
              name="name"
              type="text"
              placeholder="Place title"
              className={INPUT_SIZE_CLASSNAME}
            />
          </Card>

          <Card>
            <div className="ng-margin-medium-bottom">
              <label htmlFor="type">Place type*</label>
              <select
                className="ng-width-1-1 ng-form-large"
                id="type"
                ref={register({
                  required: true,
                })}
                name="type"
              >
                {Object.keys(PlaceTypeEnum).map((t, idx) => (
                  <option
                    key={idx}
                    value={PlaceTypeEnum[t]}
                  >
                    {PlaceTypeEnum[t]}
                  </option>
                ))}
              </select>
            </div>

            <div className="ng-width-1-1">
              <label htmlFor="slug">Slug*</label>
              <input
                ref={register({
                  required: true,
                })}
                name="slug"
                type="text"
                placeholder="Place slug"
                className={INPUT_SIZE_CLASSNAME}
              />
            </div>

            {/* {!!geojsonValue && (
              <div className="ng-margin-medium-bottom">
                <Controller
                  name="geojson"
                  control={control}
                  defaultValue={geojsonValue}
                  onChange={(layerConfig) => handleJsonChange(layerConfig)}
                  as={<JsonEditor json={geojsonValue} />}
                />
              </div>
            )} */}

            {!!serverErrors.length && <ErrorMessages errors={serverErrors} />}
          </Card>

          <Card>
            <p>Choose a GeoJSON to calulate shape maths and geographic relationships.</p>
            <input
              type="file"
              name="geojson"
              accept=".json"
              onChange={handleUpload} />
          </Card>

          <div className="ng-flex">
            <button
              className="ng-button ng-button-primary ng-margin-medium-right"
              onClick={onSubmit}
              disabled={!formState.isValid || jsonError}
            >
              Save and view details
            </button>

            <LinkWithOrg className="ng-button ng-button-secondary" to="/places">
              Return to dashboard
            </LinkWithOrg>
          </div>

        </form>
      </div>
    </ContentLayout>
  );
}