import * as React from 'react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { navigate } from 'gatsby';

import { OrganizationProps } from './model';
import { useRequest } from 'utils/hooks';
import { useAuth0 } from 'auth/auth0';
import { AuthzGuards } from 'auth/permissions';
import { setupErrors, validEmailRule, noSpecialCharsRule } from 'utils/validations';
import { getOrganization, updateOrganization } from 'services/organizations';
import { ContentLayout } from 'layouts';
import { encodeQueryToURL } from 'utils';
import { ActionModal, LinkWithOrg, InlineEditCard, Input } from 'components';

export function OrganizationDetails(props: any) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { getPermissions, selectedGroup } = useAuth0();
  const writePermissions = getPermissions(AuthzGuards.accessOrganizationsGuard);
  const encodedQuery = encodeQueryToURL(`organizations/${props.page}`, { include: 'owners' });
  const { isLoading, errors, data: orgData } = useRequest(() => getOrganization(encodedQuery), {
    permissions: AuthzGuards.accessOrganizationsGuard,
    query: encodedQuery,
  });
  const { getValues, register, formState, errors: formErrors } = useForm({
    mode: 'onChange',
  });
  const { touched, dirty, isValid, dirtyFields } = formState;
  const renderErrorFor = setupErrors(formErrors, touched);
  console.log(formErrors, touched, dirtyFields)

  function handleDeleteToggle() {
    setShowDeleteModal(!showDeleteModal);
  }

  async function onSubmit(e, setIsEditing, setIsLoading, setServerErrors) {
    e.preventDefault();
    const formData = getValues();
    console.log(formData)
    try {
      setIsLoading(true);
      const response = await updateOrganization(id, formData, selectedGroup);
      console.log(response);
      navigate(`/organizations/${response.data.id}`);
      setIsLoading(false);
    } catch(err) {
      setIsLoading(false);
      setServerErrors(err.data.errors);
    }
  }

  if (isLoading) {
    return <ContentLayout isLoading />
  }

  console.log(orgData)
  const { name, owners, slug, id } = orgData;
  const owner = owners && owners[0];

  return (
    <ContentLayout errors={errors} backTo="/organizations">
      {showDeleteModal && (
        <ActionModal
          id={id}
          navigateRoute={'organizations'}
          name={name}
          type="organization"
          toggleModal={handleDeleteToggle}
          visibility={showDeleteModal}
        />
      )}

      <div className="ng-padding-medium-horizontal">
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
                      className="ng-display-block"
                      error={renderErrorFor('name')}
                      defaultValue={name}
                      ref={register({
                        required: 'Organization name is required',
                        validate: {
                          noSpecialCharsRule: noSpecialCharsRule('Organization name can not contain special characters') }
                      })} />
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
                      className="ng-display-block ng-margin-medium-bottom"
                      defaultValue={owner}
                      error={renderErrorFor('owner')}
                      ref={register({
                        required: 'Please enter owner email',
                        validate: {
                          validEmailRule: validEmailRule()
                        }
                      })} />
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
            <button className="ng-button ng-button-secondary" onClick={handleDeleteToggle}>
              Delete organization
          </button>
          </div>
        )}
      </div>

    </ContentLayout>
  )
};