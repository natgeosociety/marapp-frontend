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
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { OrganizationDetailsProps } from './model';
import { useRequest } from 'utils/hooks';
import { useAuth0 } from 'auth/auth0';
import { AuthzGuards } from 'auth/permissions';
import { setupErrors, validEmailRule, noSpecialCharsRule } from 'utils/validations';
import { getOrganization, updateOrganization } from 'services/organizations';
import { ContentLayout } from 'layouts';
import { encodeQueryToURL } from 'utils';
import { DeleteConfirmation } from 'components/modals/delete-confirmation';
import { LinkWithOrg } from 'components/link-with-org';
import { InlineEditCard } from 'components/inline-edit-card';
import { Input } from 'components/input';

export function OrganizationDetails(props: OrganizationDetailsProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [localOrgData, setLocalOrgData] = useState(null);
  const {getPermissions, selectedGroup} = useAuth0();
  const writePermissions = getPermissions(AuthzGuards.accessOrganizationsGuard);
  const encodedQuery = encodeQueryToURL(`organizations/${props.page}`, {include: 'owners'});

  const {isLoading, errors, data} = useRequest(() =>
    getOrganization(encodedQuery), {
    permissions: AuthzGuards.accessOrganizationsGuard,
    query: encodedQuery,
  });

  useEffect(() => {
    setLocalOrgData(data);
  }, [data]);


  const {getValues, register, formState, errors: formErrors} = useForm({
    mode: 'onChange',
  });

  const {touched} = formState;
  const renderErrorFor = setupErrors(formErrors, touched);

  function handleDeleteToggle() {
    setShowDeleteModal(!showDeleteModal);
  }

  async function onSubmit(e, setIsEditing, setIsLoading, setServerErrors) {
    e.preventDefault();
    const {owner, ...rest} = getValues();

    const transformedFormData = {
      ...rest,
      ...owner && {
        owners: [owner],
      },
    };

    try {
      setIsLoading(true);
      const {data}: any = await updateOrganization(id, transformedFormData, selectedGroup);
      setIsEditing(false);
      setLocalOrgData(data);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      setServerErrors(err.data.errors);
    }
  }

  if (isLoading) {
    return <ContentLayout isLoading/>;
  }

  const {name, owners, slug, id} = localOrgData;
  const owner = owners && owners[0];

  return (
    <ContentLayout errors={errors} backTo="/organizations">
      <DeleteConfirmation
        id={id}
        navigateRoute={'organizations'}
        name={name}
        type="organization"
        toggleModal={handleDeleteToggle}
        visibility={showDeleteModal}
      />

      <div className="marapp-qa-organizationdetails ng-padding-medium-horizontal">
        <LinkWithOrg className="ng-border-remove ng-margin-bottom ng-display-block" to="/organizations">
          <i className="ng-icon ng-icon-directionleft"></i>
          return to organizations home
        </LinkWithOrg>

        <form className="ng-form ng-form-dark ng-flex-column">
          <div className="ng-grid">
            <div className="ng-width-1-1">
              <InlineEditCard
                onSubmit={onSubmit}
                validForm={!formErrors.name}
                render={() => (
                  <>
                    <Input
                      name="name"
                      placeholder="Organization name is required"
                      label="Organization name*"
                      className="marapp-qa-inputname ng-display-block"
                      error={renderErrorFor('name')}
                      defaultValue={name}
                      ref={register({
                        required: 'Organization name is required',
                        validate: {
                          noSpecialCharsRule: noSpecialCharsRule('Organization name can not contain special characters'),
                        },
                      })}/>
                  </>
                )}>
                <h1 className="ng-text-display-m ng-margin-remove">{name}</h1>
              </InlineEditCard>
            </div>
          </div>
          <div className="ng-grid">
            <div className="ng-width-1-2">
              <InlineEditCard
                onSubmit={onSubmit}
                validForm={!formErrors.owner}
                render={() => (
                  <>
                    <Input
                      name="owner"
                      placeholder="required"
                      label="Owner*"
                      className="marapp-qa-inputowner ng-display-block ng-margin-medium-bottom"
                      defaultValue={owner}
                      error={renderErrorFor('owner')}
                      ref={register({
                        required: 'Please enter owner email',
                        validate: {
                          validEmailRule: validEmailRule(),
                        },
                      })}/>
                  </>
                )}>
                <div className="ng-margin-medium-bottom">
                  <p className="ng-text-weight-bold ng-margin-remove">Owner</p>
                  <p className="ng-margin-remove ng-padding-left">{owner}</p>
                </div>
              </InlineEditCard>
            </div>
            <div className="ng-width-1-2">
              <InlineEditCard>
                <div className="ng-margin-medium-bottom">
                  <p className="ng-text-weight-bold ng-margin-remove">ID</p>
                  <p className="ng-margin-remove ng-padding-left">{id}</p>
                </div>
                <div>
                  <p className="ng-text-weight-bold ng-margin-remove">Slug</p>
                  <p className="ng-margin-remove ng-padding-left">{slug}</p>
                  <small className="ng-text-muted">The slug name cannot be edited after creation</small>
                </div>
              </InlineEditCard>
            </div>
          </div>
        </form>
      </div>

      <div>
        {writePermissions && (
          <div className="ng-padding-medium ultradkgray ng-text-right">
            <button className="marapp-qa-actiondelete ng-button ng-button-secondary" onClick={handleDeleteToggle}>
              Delete organization
            </button>
          </div>
        )}
      </div>

    </ContentLayout>
  );
};
