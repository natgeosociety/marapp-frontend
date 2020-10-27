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

import { navigate } from 'gatsby';
import { noop } from 'lodash';
import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';

import {
  ErrorMessages,
  Input,
  lowerNumericDashesRule,
  setupErrors,
  Spinner,
  validEmailRule,
} from '@marapp/earth-shared';

import { Card } from '@marapp/earth-shared';
import { LinkWithOrg } from '@app/components/link-with-org';
import { ContentLayout } from '@app/layouts';
import OrganizationsService from '@app/services/organizations';
import { Auth0Context } from '@app/utils/contexts';

interface IProps {
  path?: string;
  onDataChange?: () => {};
}

export function NewOrganization(props: IProps) {
  const { onDataChange = noop } = props;
  const [serverErrors, setServerErrors] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { selectedGroup } = useContext(Auth0Context);
  const { handleSubmit, register, errors, formState } = useForm({
    mode: 'onChange',
  });
  const { isValid, touched } = formState;
  const renderErrorFor = setupErrors(errors, touched);

  const onSubmit = async (values: any) => {
    try {
      setIsLoading(true);
      const { data } = await OrganizationsService.addOrganization(
        {
          name: values.name,
          slug: values.slug,
          owners: [].concat(values.owners),
        },
        { group: selectedGroup }
      );
      onDataChange();
      await navigate(`/${selectedGroup}/organizations/${data.id}`);
    } catch (error) {
      setIsLoading(false);
      setServerErrors(error.data.errors);
    }
  };

  return (
    <ContentLayout backTo="/organizations">
      <div>
        <div className="ng-flex ng-flex-space-between">
          <h2 className="ng-text-display-m">Add organization</h2>
        </div>

        <form
          className="ng-form ng-form-dark ng-flex-column ng-width-4-5"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Card className="ng-margin-medium-bottom">
            <Input
              name="name"
              placeholder="Organization name"
              label="Organization name*"
              className="marapp-qa-inputname ng-display-block"
              maxLength="64"
              disabled={isLoading}
              error={renderErrorFor('name')}
              ref={register({
                required: 'Organization name is required',
              })}
            />
          </Card>

          <Card className="ng-margin-medium-bottom">
            <Input
              name="slug"
              placeholder="short-org-name-or-initials"
              label="Slug*"
              className="marapp-qa-inputslug ng-display-block"
              disabled={isLoading}
              error={renderErrorFor('slug')}
              ref={register({
                required: 'Slug name is required',
                validate: {
                  lowerNumericDashesRule: lowerNumericDashesRule(),
                },
              })}
            />
          </Card>

          <Card className="ng-margin-medium-bottom">
            <Input
              name="owners"
              placeholder="Owner email address"
              label="Owner email address*"
              className="marapp-qa-inputname ng-display-block"
              maxLength="64"
              disabled={isLoading}
              error={renderErrorFor('owners')}
              ref={register({
                required: 'Please add an owners email',
                validate: {
                  validEmailRule: validEmailRule(),
                },
              })}
            />
          </Card>

          {serverErrors && <ErrorMessages errors={serverErrors} />}

          {isLoading ? (
            <div className="ng-padding-large ng-position-relative">
              <Spinner />
            </div>
          ) : (
            <div className="ng-flex">
              <button
                className="ng-button ng-button-primary ng-margin-medium-right"
                disabled={!isValid}
              >
                Save and view details
              </button>
              <LinkWithOrg className="ng-button ng-button-secondary" to="/organizations">
                return to organizations home
              </LinkWithOrg>
            </div>
          )}
        </form>
      </div>
    </ContentLayout>
  );
}
