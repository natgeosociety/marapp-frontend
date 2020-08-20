import * as React from 'react';
import { useState } from 'react';
import { navigate } from 'gatsby';
import { useForm } from 'react-hook-form';
import { Spinner } from '@marapp/earth-components';

import { useAuth0 } from 'auth/auth0';
import { addPlace } from 'services/places';
import { PlaceTypeEnum } from './model';

import { LinkWithOrg, ErrorMessages, Card, FakeJsonUpload } from 'components';
import { ContentLayout } from 'layouts';

export function NewPlace(path: any) {
  const { getValues, register, formState } = useForm({
    mode: 'onChange',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [geojsonValue, setGeojson] = useState(null);
  const [serverErrors, setServerErrors] = useState([]);
  const [jsonError, setJsonError] = useState(false);
  const { selectedGroup } = useAuth0();
  const INPUT_SIZE_CLASSNAME = 'ng-width-1-1 ng-form-large';

  async function onSubmit(e) {
    e.preventDefault();

    const formData = getValues();
    const parsed = {
      ...formData,
      geojson: geojsonValue,
    }
    try {
      setIsLoading(true);
      const response: any = await addPlace(parsed, selectedGroup);
      await navigate(`/${selectedGroup}/places/${response.data.id}`);
    } catch (error) {
      setIsLoading(false);
      setServerErrors(error.data.errors);
    }
  }

  return (
    <ContentLayout backTo="/places">
      <div>
        <div className="ng-flex ng-flex-space-between">
          <h2 className="ng-text-display-m ng-c-flex-grow-1">New place</h2>
        </div>

        <form className="ng-form ng-form-dark ng-flex-column ng-width-4-5">

          <Card>
            <label className="ng-form-label" htmlFor="input-name">Title*</label>
            <input
              ref={register({
                required: true,
              })}
              id="input-name"
              name="name"
              type="text"
              placeholder="Place title"
              className={INPUT_SIZE_CLASSNAME}
            />
          </Card>

          <Card>
            <div className="ng-margin-medium-bottom">
              <label htmlFor="input-type">Place type*</label>
              <select
                className="ng-width-1-1 ng-form-large"
                id="input-type"
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
              <label htmlFor="input-slug">Slug*</label>
              <input
                ref={register({
                  required: true,
                })}
                id="input-slug"
                name="slug"
                type="text"
                placeholder="Place slug"
                className={INPUT_SIZE_CLASSNAME}
              />
            </div>

            {!!serverErrors.length && <ErrorMessages errors={serverErrors} />}
          </Card>

          <Card>
            <p>Choose a GeoJSON to calulate shape maths and geographic relationships.</p>
            <FakeJsonUpload
              name="geojson"
              label="Place shape*"
              ref={register({
                required: true,
              })}
              onChange={(json) => setGeojson(json)}
              onError={(err) => setJsonError(err)} />
          </Card>

          {isLoading
            ? <div className="ng-padding-large ng-position-relative"><Spinner /></div>
            : (
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
            )}

        </form>
      </div>
    </ContentLayout>
  );
}