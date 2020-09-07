import * as React from 'react';
import { useState, useContext } from 'react';
import { navigate } from 'gatsby';
import { useForm } from 'react-hook-form';
import { Spinner } from '@marapp/earth-components';

import { AuthzGuards } from 'auth/permissions';
import { encodeQueryToURL } from 'utils';
import { Auth0Context } from 'utils/contexts';
import { addOrganization } from 'services/organizations';
import { setupErrors, noSpecialCharsRule, upperNumericDashesRule, validEmailRule } from 'utils/validations';
import { useRequest } from 'utils/hooks';
import { ContentLayout } from 'layouts';
import { LinkWithOrg, ErrorMessages, Input } from 'components';
import { Card } from 'components/card'

export function NewOrganization(props) {
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
      const { data }: any = await addOrganization({
        name: values.name,
        slug: values.slug,
        owners: [].concat(values.owners)
      }, selectedGroup);
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

        <form className="ng-form ng-form-dark ng-flex-column ng-width-4-5" onSubmit={handleSubmit(onSubmit)}>
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
                validate: {
                  noSpecialCharsRule: noSpecialCharsRule('Organization name can not contain special characters')
                }
              })} />
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
                  upperNumericDashesRule: upperNumericDashesRule()
                }
              })} />
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
                  validEmailRule: validEmailRule()
                }
              })} />
          </Card>

          {serverErrors && <ErrorMessages errors={serverErrors} />}

          {isLoading
            ? <div className="ng-padding-large ng-position-relative"><Spinner /></div>
            : (
              <div className="ng-flex">
                <button
                  className="ng-button ng-button-primary ng-margin-medium-right"
                  disabled={!isValid}
                >
                  Save and view details
            </button>
                <LinkWithOrg className="ng-button ng-button-secondary" to="/organizations">
                  Return to dashboard
            </LinkWithOrg>
              </div>
            )
          }
        </form>
      </div>
    </ContentLayout>
  )
}