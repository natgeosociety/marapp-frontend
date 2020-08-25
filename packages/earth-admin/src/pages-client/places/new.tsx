import * as React from 'react';
import { useState } from 'react';
import { navigate } from 'gatsby';
import { useForm } from 'react-hook-form';
import { Spinner } from '@marapp/earth-components';

import { useAuth0 } from 'auth/auth0';
import { addPlace, getUniqueSlug } from 'services/places';
import { PlaceTypeEnum } from './model';

import { LinkWithOrg, ErrorMessages, Card, FakeJsonUpload, Input } from 'components';
import { ContentLayout } from 'layouts';

export function NewPlace(path: any) {
  const { getValues, register, watch, formState, errors, setValue } = useForm({
    mode: 'onChange',
  });
  const { touched, dirty, isValid } = formState;
  const watchName = watch('name');
  const [isLoading, setIsLoading] = useState(false);
  const [geojsonValue, setGeojson] = useState(null);
  const [serverErrors, setServerErrors] = useState([]);
  const [jsonError, setJsonError] = useState(false);
  const { selectedGroup } = useAuth0();

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
  const generateSlug = async (e) => {
    e.preventDefault();
    try {
      const { data }: any = await getUniqueSlug(watchName, selectedGroup, 'shortid');
      setValue('slug', data.slug, true);
    } catch (error) {
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
            <Input
              name="name"
              placeholder="Place title"
              label="Title*"
              className="ng-display-block"
              error={touched.name && errors.name && errors.name.message}
              ref={register({
                required: 'Place title is required',
              })} />
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

            <div className="ng-grid ng-flex-top">
              <div className="ng-flex-item-1">
                <Input
                  name="slug"
                  placeholder="Place slug"
                  label="Slug*"
                  className="ng-display-block"
                  error={touched.slug && errors.slug && errors.slug.message}
                  ref={register({
                    required: 'Slug is required',
                  })} />
              </div>
              <div>
                <button
                  onClick={generateSlug}
                  disabled={!watchName}
                  title={watchName ? 'Generate slug' : 'Add a title first'}
                  className="ng-button ng-button-secondary ng-button-large ng-pointer"
                  style={{ marginTop: '36px' }}>
                  Generate a slug name
                </button>
              </div>
            </div>

          </Card>

          <Card>
            <p>Choose a GeoJSON to calulate shape maths and geographic relationships.</p>
            <FakeJsonUpload
              name="geojson"
              label="Place shape*"
              ref={register({
                required: 'GeoJSON is required',
              })}
              onChange={(json) => {
                setGeojson(json);
                setJsonError(false);
              }}
              onError={(err) => setJsonError(true)} />
          </Card>

          {!!serverErrors.length && <ErrorMessages errors={serverErrors} />}

          {isLoading
            ? <div className="ng-padding-large ng-position-relative"><Spinner /></div>
            : (
              <div className="ng-flex">
                <button
                  className="ng-button ng-button-primary ng-button-large ng-margin-medium-right"
                  onClick={onSubmit}
                  disabled={!isValid || jsonError || !dirty}
                >
                  Save and view details
                </button>

                <LinkWithOrg className="ng-button ng-button-secondary ng-button-large" to="/places">
                  Return to dashboard
                </LinkWithOrg>
              </div>
            )}
        </form>
      </div>
    </ContentLayout>
  );
}