import * as React from 'react';
import { useState, useContext } from 'react';
import { OrganizationEditProps } from '../model';
import { useForm, Controller } from 'react-hook-form';
import { LinkWithOrg } from 'components/LinkWithOrg';
import { SearchInput } from 'components/search-input';
import { handleOrganizationForm } from 'services/organizations';
import { Auth0Context } from 'utils/contexts';
import { navigate } from 'gatsby';
import { ErrorMessages } from 'components/error-messages';

const INPUT_SIZE_CLASSNAME = 'ng-width-1-1 ng-form-large';

export default function OrganizationEdit(props: OrganizationEditProps) {
  const {
    data: { name, description, id },
    newOrg,
  } = props;

  const { handleSubmit, register, errors, control, getValues, formState } = useForm({
    mode: 'onChange',
  });
  const [serverErrors, setServerErrors] = useState(null);
  const { selectedGroup } = useContext(Auth0Context);

  const onSubmit = async (values: any) => {
    const formData = getValues();

    try {
      await handleOrganizationForm(false, { description: formData.description }, id || formData.id, selectedGroup);
      await navigate(`/${selectedGroup}/organizations`);
    } catch (error) {
      setServerErrors(error.data.errors);
    }
  };

  return (
    <div>
      <div className="ng-flex ng-flex-space-between">
        <h2 className="ng-text-display-m">{newOrg ? 'Add organization' : `Edit Organization - ${name}`}</h2>
      </div>

      <div className="ng-padding-medium ng-background-white">
        <form className="ng-form ng-flex-column ng-width-4-5" onSubmit={handleSubmit(onSubmit)}>
          <div className="ng-margin-medium-bottom ng-grid">
            <div className="ng-width-large-1-2 ng-width-1-1">
              <label className="ng-form-label" htmlFor="name">
                Organization name
              </label>
              <input
                ref={register}
                name="name"
                type="text"
                defaultValue={name}
                placeholder="Organization name"
                className={INPUT_SIZE_CLASSNAME}
                disabled
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
                defaultValue={description}
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
            <LinkWithOrg className="ng-button" to="/organizations">
              Cancel
            </LinkWithOrg>
          </div>
        </form>
      </div>
    </div>
  );
}
