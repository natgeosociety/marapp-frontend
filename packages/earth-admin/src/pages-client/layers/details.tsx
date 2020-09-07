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

import * as React from 'react';
import { useEffect, useState } from 'react';
import { JSHINT } from 'jshint';
import { LayerContext } from 'utils/contexts';
import { encodeQueryToURL, setPage } from 'utils';
import { getAllLayers, getLayer, handleLayerForm } from 'services/layers';
import { useRequest } from 'utils/hooks';
import {
  LayerList,
  LayerDetails,
  LayerEdit,
  LinkWithOrg,
  ActionModal,
  Input,
  InlineEditCard,
  Card,
  Toggle,
} from 'components';
import { useAuth0 } from 'auth/auth0';
import { AuthzGuards } from 'auth/permissions';
import { ContentLayout, SidebarLayout } from 'layouts';
import { useForm } from 'react-hook-form';
import { noSpecialChars, setupErrors } from 'utils/validations';
import { navigate } from 'gatsby';

const LAYER_DETAIL_QUERY = {include: 'references', select: 'references.name,references.id'};
const INIT_CURSOR_LOCATION = '-1';

const PAGE_TYPE = setPage('Layers');

export function LayerDetail(path: any) {
  const {getPermissions, selectedGroup} = useAuth0();
  const writePermissions = getPermissions(AuthzGuards.writeLayersGuard);

  const encodedQuery = encodeQueryToURL(`layers/${path.page}`, {
    ...LAYER_DETAIL_QUERY,
    ...{group: selectedGroup},
  });
  const {isLoading, data} = useRequest(() => getLayer(encodedQuery), {
    permissions: AuthzGuards.writeLayersGuard,
    skip: path.newLayer,
  });

  const [layer, setLayer] = useState(data);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [formValid, setFormValid] = useState(true);
  const [jsonError, setJsonError] = useState(false);
  const [serverErrors, setServerErrors] = useState();
  const [layerConfig, setLayerConfig] = useState();

  const {
    id,
    name,
    description,
    primary,
    published,
    version,
    createdAt,
    updatedAt,
    slug,
    type,
    provider,
    category,
    config,
    references
  } = layer;

  useEffect(() => {
    setLayer(data);
  }, [data]);

  const {getValues, register, formState, errors} = useForm({
    mode: 'onChange',
  });

  const {touched, dirty, isValid} = formState;
  const renderErrorFor = setupErrors(errors, touched);

  useEffect(() => {
    setFormValid(isValid);
  }, [isValid])

  async function onSubmit(e?, setIsEditing?, setIsLoading?, setServerErrors?) {
    e.preventDefault();

    const formData = getValues();

    try {
      setIsLoading && setIsLoading(true);
      await handleLayerForm(false, formData, id, selectedGroup);
      const res = getLayer(encodedQuery);
      setLayer(res.data);
      setIsLoading && setIsLoading(false);
      setIsEditing && setIsEditing(false);
    } catch (error) {
      setIsLoading && setIsLoading(false);
      setServerErrors && setServerErrors(error.data.errors);
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
      setLayerConfig(parsedJson);
      setJsonError(false);
      return parsedJson;
    }
    setJsonError(true);
  };


  function handleServerErrors(errors) {
    setServerErrors(errors);
  }

  function handleDeleteToggle() {
    setShowDeleteModal(!showDeleteModal);
  }

  return (
    <ContentLayout backTo="/layers" isLoading={isLoading} className="marapp-qa-layerdetail">
      {showDeleteModal && (
        <ActionModal
          id={id}
          navigateRoute={'layers'}
          name={name}
          type="layer"
          toggleModal={handleDeleteToggle}
          visibility={showDeleteModal}
        />
      )}
      <div className="ng-padding-medium-horizontal">
        <LinkWithOrg className="marapp-qa-actionreturn ng-border-remove ng-margin-bottom ng-display-block" to="/layers">
          <i className="ng-icon ng-icon-directionleft"></i>
          return to layers home
        </LinkWithOrg>
        <form className="ng-form ng-form-dark ng-flex-column">
          <div className="ng-grid">
            <div className="ng-width-3-4">
              <InlineEditCard
                onSubmit={onSubmit}
                validForm={formValid}
                render={({ setIsEditing, setIsLoading, setServerErrors }) => (
                  <>
                    <Input
                      name="name"
                      placeholder="Layer title"
                      label="Title*"
                      defaultValue={name}
                      className="ng-display-block"
                      error={renderErrorFor('name', 'noSpecialChars')}
                      ref={register({
                        required: 'Layer title is required',
                        validate: { noSpecialChars }
                      })} />
                  </>
                )}>
                <h1 className="ng-text-display-m ng-margin-remove">{name}</h1>
              </InlineEditCard>
            </div>
            <div className="ng-width-1-4">
              <Card>
                <Toggle
                  name="featured"
                  label="Featured"
                  value={primary}
                  className="ng-display-block"
                  onChange={(e) => onSubmit(e)}
                  ref={register({})} />
                <Toggle
                  name="published"
                  label="Published"
                  value={published}
                  className="ng-display-block"
                  onChange={(e) => onSubmit(e)}
                  ref={register({})} />
              </Card>
            </div>
          </div>
        </form>
      </div>
    </ContentLayout>
  );
}
