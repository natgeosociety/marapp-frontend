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

import { noop } from 'lodash';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import Creatable from 'react-select/creatable';
import useSWR from 'swr';

import {
  AuthzGuards,
  InlineEditCard,
  Input,
  setupErrors,
  validEmail,
  validEmailRule,
} from '@marapp/earth-shared';

import { useAuth0 } from '@app/auth/auth0';
import { LinkWithOrg } from '@app/components/link-with-org';
import { DeleteConfirmation } from '@app/components/modals/delete-confirmation';
import { ContentLayout } from '@app/layouts';
import { CUSTOM_STYLES, SELECT_THEME } from '@app/theme';
import { generateCacheKey } from '@app/services';
import OrganizationsService from '@app/services/organizations';

import { OrganizationDetailsProps } from './model';

export function OrganizationDetails(props: OrganizationDetailsProps) {
  const { page, onDataChange = noop } = props;
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [localOrgData, setLocalOrgData] = useState({});
  const [ownersFeedback, setOwnersFeedback] = useState([]);
  const { getPermissions, selectedGroup } = useAuth0();
  const writePermissions = getPermissions(AuthzGuards.accessOrganizationsGuard);

  const query = { include: 'owners' };
  const cacheKey = generateCacheKey(`organizations/${page}`, query);

  const { data, error, mutate } = useSWR(cacheKey, () =>
    OrganizationsService.getOrganization(page, query).then((res: any) => res.data)
  );

  useEffect(() => {
    data && setLocalOrgData(data);
  }, [data]);

  const {
    getValues,
    register,
    formState,
    errors: formErrors,
    control,
    setValue,
    watch,
    reset,
  } = useForm({
    mode: 'onChange',
  });

  const { touched } = formState;
  const renderErrorFor = setupErrors(formErrors, touched);

  function handleDeleteToggle() {
    setShowDeleteModal(!showDeleteModal);
  }

  async function onSubmit(e, setIsEditing, setIsLoading, setServerErrors) {
    e.preventDefault();
    const { owners, ...rest } = getValues();

    const parsed = {
      ...rest,
      ...(owners && {
        owners: owners.map((item) => item.value),
      }),
    };

    try {
      setServerErrors([]);
      setOwnersFeedback([]);
      setIsLoading && setIsLoading(true);
      await OrganizationsService.updateOrganization(id, parsed, { group: selectedGroup });
      mutate();
      setIsLoading && setIsLoading(false);
      setIsEditing && setIsEditing(false);
      onDataChange();
    } catch (err) {
      const errors = err.data?.errors;

      setIsLoading && setIsLoading(false);
      processOwnersFeedback(errors || [], false);
      setServerErrors(errors || err.data);
    }
  }

  const { name, owners, slug, id }: any = {
    ...localOrgData,
    owners: (localOrgData as any).owners || [],
  };

  const customStylesOwners = {
    ...CUSTOM_STYLES,
    multiValueLabel: (provided, state) => {
      return {
        ...provided,
        color: state.data.hasError ? 'red' : 'var(--marapp-gray-9)',
        borderRadius: '50px',
        display: 'flex',
      };
    },
    multiValueRemove: (provided, state) => ({
      ...provided,
      color: state.data.hasError ? 'red' : 'var(--marapp-gray-9)',
    }),
    control: (provided, state) => {
      return {
        ...provided,
        minHeight: '55px',
      };
    },
    menu: () => ({
      display: 'none',
    }),
    dropdownIndicator: () => ({
      display: 'none',
    }),
    indicatorSeparator: () => ({
      display: 'none',
    }),
  };

  const ownersWatcher = watch('owners');

  const appendEmailToOwnersList = (email: string): void => {
    setValue('owners', [
      ...ownersWatcher,
      {
        label: email,
        value: email,
      },
    ]);
  };

  const processOwnersFeedback = (data, isSccess) => {
    const feedback = [];

    const feedbackOwners = data.map((item) => {
      const hasError = !!item.error;

      feedback.push({
        hasError,
        title: item.email,
        detail: item.error,
      });

      return {
        label: item.email,
        value: item.email,
        hasError,
      };
    });

    setValue('owners', feedbackOwners);
    setOwnersFeedback(feedback);
  };

  return (
    <ContentLayout
      backTo="/organizations"
      isLoading={!data && !error}
      errorPage="organization"
      errors={error?.data?.errors}
      className="marapp-qa-organizationdetail"
    >
      <DeleteConfirmation
        id={id}
        navigateRoute={'organizations'}
        name={name}
        type="organization"
        toggleModal={handleDeleteToggle}
        onDelete={onDataChange}
        visibility={showDeleteModal}
      />

      <div className="marapp-qa-organizationdetails ng-padding-medium-horizontal">
        <LinkWithOrg
          className="ng-border-remove ng-margin-bottom ng-display-block"
          to="/organizations"
        >
          <i className="ng-icon ng-icon-directionleft" />
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
                      })}
                    />
                  </>
                )}
              >
                <h1 className="ng-text-display-m ng-margin-remove">{name}</h1>
              </InlineEditCard>
            </div>
          </div>
          <div className="ng-grid">
            <div className="ng-width-1-2">
              <InlineEditCard
                onSubmit={onSubmit}
                onCancel={() => [reset(), setOwnersFeedback([])]}
                validForm={!formErrors.owners && formState.dirty && ownersWatcher?.length > 0}
                render={() => (
                  <>
                    <p className="ng-text-weight-bold ng-margin-remove">Owner(s)*</p>
                    <Controller
                      name="owners"
                      type="owners"
                      className="marapp-qa-owners"
                      defaultValue={owners.map((owner) => ({ label: owner, value: owner }))}
                      control={control}
                      selectedGroup={selectedGroup}
                      as={Creatable}
                      formatCreateLabel={(value) => `${value}`}
                      isValidNewOption={(value) => validEmail(value)}
                      isMulti={true}
                      placeholder="Emails"
                      onKeyDown={(e) => {
                        const value = e.target.value;

                        if (e.key === 'Enter') {
                          if (
                            value === '' ||
                            (ownersWatcher && ownersWatcher.find((x) => x.value === value))
                          ) {
                            e.preventDefault();
                          }
                        } else if (e.key === ' ' && validEmail(value)) {
                          appendEmailToOwnersList(value);
                        }
                      }}
                      onBlur={([e]) => {
                        e.preventDefault();

                        const value = e.target.value;

                        if (value && validEmail(value)) {
                          appendEmailToOwnersList(value);
                        }
                      }}
                      styles={customStylesOwners}
                      theme={(theme) => ({
                        ...theme,
                        ...SELECT_THEME,
                      })}
                      rules={{ required: true }}
                      error={renderErrorFor('owners')}
                      ref={register({
                        required: 'Please add an owner email',
                        validate: {
                          validEmailRule: validEmailRule(),
                        },
                      })}
                    />
                    <div className="ng-width-1-1 ng-margin-top">
                      {ownersFeedback.map(
                        (item) =>
                          item.hasError && (
                            <p className="ng-margin-remove">
                              The email, {item.title} is unavailable. Details: {item.detail}
                            </p>
                          )
                      )}
                    </div>
                  </>
                )}
              >
                <div className="ng-margin-medium-bottom">
                  <p className="ng-text-weight-bold ng-margin-remove">Owner(s)</p>
                  {owners.map((owner) => (
                    <p className="ng-margin-remove ng-padding-left">{owner}</p>
                  ))}
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
                  <small className="ng-text-muted">
                    The slug name cannot be edited after creation
                  </small>
                </div>
              </InlineEditCard>
            </div>
          </div>
        </form>
      </div>

      <div>
        {writePermissions && (
          <div className="ng-padding-medium ultradkgray ng-text-right">
            <button
              className="marapp-qa-actiondelete ng-button ng-button-secondary"
              onClick={handleDeleteToggle}
            >
              Delete organization
            </button>
          </div>
        )}
      </div>
    </ContentLayout>
  );
}
