import * as React from 'react';
import { useState, useContext } from 'react';
import { navigate } from 'gatsby';
import { useForm } from 'react-hook-form';

import { AuthzGuards } from 'auth/permissions';
import { encodeQueryToURL } from 'utils';
import { Auth0Context } from 'utils/contexts';
import { addOrganization } from 'services/organizations';
import { useRequest } from 'utils/hooks';
import { ContentLayout } from 'layouts';
import { LinkWithOrg, ErrorMessages } from 'components';

const INPUT_SIZE_CLASSNAME = 'ng-width-1-1 ng-form-large';

export function NewOrganization(props) {
  const { handleSubmit, register, errors, control, getValues, formState } = useForm({
    mode: 'onChange',
  });
  const [serverErrors, setServerErrors] = useState(null);
  const { selectedGroup } = useContext(Auth0Context);

  const onSubmit = async (values: any) => {
    const formData = getValues();

    try {
      await addOrganization({
        name: formData.name,
        description: formData.description,
        owners: [].concat(formData.owners)
      }, selectedGroup);
      await navigate(`/${selectedGroup}/organizations`);
    } catch (error) {
      setServerErrors(error.data.errors);
    }
  };

  return (
    <ContentLayout backTo="/organizations">
      <div>
        <div className="ng-flex ng-flex-space-between">
          <h2 className="ng-text-display-m">Add organization</h2>
        </div>

        <div className="ng-padding-medium ng-background-ultradkgray">
          <form className="ng-form ng-form-dark ng-flex-column ng-width-4-5" onSubmit={handleSubmit(onSubmit)}>
            <div className="ng-margin-medium-bottom ng-grid">
              <div className="ng-width-large-1-2 ng-width-1-1">
                <label className="ng-form-label" htmlFor="name">
                  Organization name
              </label>
                <input
                  ref={register({
                    required: true,
                  })}
                  name="name"
                  type="text"
                  defaultValue={name}
                  placeholder="Organization name"
                  className={INPUT_SIZE_CLASSNAME}
                />
              </div>
              <div className="ng-width-large-1-2 ng-width-1-1">
                <label className="ng-form-label" htmlFor="owners">
                  Organization owner
              </label>
                <input
                  ref={register({
                    required: true,
                  })}
                  name="owners"
                  type="text"
                  // defaultValue={owners ? owners[0] : ''}
                  placeholder="Organization owner"
                  className={INPUT_SIZE_CLASSNAME}
                />
              </div>
              <div className="ng-width-large-1-2 ng-width-1-1">
                <label htmlFor="email">Organization description*</label>
                <input
                  ref={register({
                    required: true,
                  })}
                  name="description"
                  type="text"
                  // defaultValue={description}
                  placeholder="Organization description"
                  className={INPUT_SIZE_CLASSNAME}
                />
              </div>
            </div>

            {serverErrors && <ErrorMessages errors={serverErrors} />}

            <div className="ng-flex">
              <button
                className="ng-button ng-button-primary ng-margin-medium-right"
                disabled={!formState.isValid}
              >
                Save
            </button>
              <LinkWithOrg className="ng-button ng-button-secondary" to="/organizations">
                Cancel
            </LinkWithOrg>
            </div>
          </form>
        </div>
      </div>
    </ContentLayout>
  )
}