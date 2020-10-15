import { Auth0Context } from 'auth/auth0';
import { REACT_APP_EXTERNAL_IDP_URL } from 'config';
import { capitalize, identity, omit, pickBy } from 'lodash';
import React, { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Link from 'redux-first-router-link';
import ProfileService from 'services/ProfileService';
import { APP_LOGO } from 'theme';

import {
  InlineEditCard,
  Input,
  setupErrors,
  Spinner,
  UserMenu,
  validEmailRule,
  valueChangedRule,
} from '@marapp/earth-shared';

interface IProps {
  page: string;
}

enum RESET_PASSWORD_STATE {
  INITIAL,
  SENDING,
  SENT,
  NOTIFICATION_DISMISS,
}

export function ProfileComponent(props: IProps) {
  const { page } = props;

  const { getValues, register, formState, errors: formErrors } = useForm({
    mode: 'onChange',
  });

  const { userData, logout, login, isAuthenticated } = useContext(Auth0Context);
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState('');
  const [pendingEmail, setPendingEmail] = useState(null);
  const [serverErrors, setServerErrors] = useState();
  const [userProfile, setUserProfile] = useState({
    firstName: '',
    lastName: '',
    name: '',
    groups: [],
  });
  const [resetPasswordState, setResetPasswordState] = useState(RESET_PASSWORD_STATE.INITIAL);
  const [markedOrgsForLeave, setMarkedOrgsForLeave] = useState({});
  const [userRoles, setUserRoles] = useState({});
  const [isDeletingAccountOpen, setIsDeleteingAccountOpen] = useState(false);
  const [confirmDeleteAccount, setConfirmDeleteAccount] = useState(false);

  const { touched, isValid } = formState;
  const renderErrorFor = setupErrors(formErrors, touched);

  const processUserName = ({ firstName, lastName, name }) => {
    setUserName(firstName && lastName ? `${firstName} ${lastName}` : name);
  };

  const groupRolesByOrganization = (groups) => {
    const result = groups.reduce((acc, c) => {
      const groupTokens = c.name.split('-');

      const groupRole = capitalize(groupTokens.pop());
      const groupName = groupTokens.join('-');

      acc[groupName] = acc[groupName] || [];
      acc[groupName].push(groupRole);

      return acc;
    }, {});

    setUserRoles(result);
  };

  useEffect(() => {
    (async () => {
      const response = await ProfileService.fetchProfile({ include: 'groups' });

      setUserProfile(response.data);
      processUserName(response.data);
      groupRolesByOrganization(response.data?.groups);

      response.data?.pendingEmail && setPendingEmail(response.data.pendingEmail);

      setIsLoading(false);
    })();
  }, []);

  async function onSubmitName(e?, setIsEditing?, setIsLoading?, setServerErrors?) {
    e.preventDefault();

    const formData = getValues();
    try {
      setIsLoading && setIsLoading(true);

      const response = await ProfileService.updateProfile(formData);
      setUserProfile(response.data);
      processUserName(response.data);

      setIsEditing && setIsEditing(false);
      setIsLoading && setIsLoading(false);
    } catch (error) {
      setIsLoading && setIsLoading(false);
      setServerErrors && setServerErrors(error.data?.errors);
    }
  }

  async function sendResetEmail(e) {
    e.preventDefault();

    setResetPasswordState(RESET_PASSWORD_STATE.SENDING);

    await ProfileService.resetPassword();

    setResetPasswordState(RESET_PASSWORD_STATE.SENT);
  }

  function switchMarkOrgForLeave(e, org) {
    e.preventDefault();

    setMarkedOrgsForLeave(
      pickBy({ ...markedOrgsForLeave, [org]: !markedOrgsForLeave[org] }, identity)
    );
  }

  async function onSubmitOrgLeave(e?, setIsEditing?, setIsLoading?, setServerErrors?) {
    e.preventDefault();

    const orgsToLeave = Object.keys(markedOrgsForLeave);

    setIsLoading && setIsLoading(true);

    try {
      await ProfileService.leaveOrganizations(orgsToLeave);

      setUserRoles({ ...omit(userRoles, orgsToLeave) });

      setIsEditing && setIsEditing(false);
      setIsLoading && setIsLoading(false);
    } catch (error) {
      setIsLoading && setIsLoading(false);
      setServerErrors && setServerErrors(error.data?.errors);
    }
  }

  async function onEmailChange(e?, setIsEditing?, setIsLoading?, setServerErrors?) {
    e.preventDefault();
    const formData = getValues();

    try {
      setIsLoading && setIsLoading(true);
      const response = await ProfileService.changeEmail(formData);
      setPendingEmail(response.data?.pendingEmail);
      setIsEditing && setIsEditing(false);
      setIsLoading && setIsLoading(false);
    } catch (error) {
      setIsLoading && setIsLoading(false);
      setServerErrors && setServerErrors(error.data?.errors);
    }
  }

  async function onCancelEmailChange(e) {
    e.preventDefault();

    try {
      const response = await ProfileService.cancelEmailChange();
      setUserProfile(response.data);
      setPendingEmail(null);
    } catch (error) {
      setServerErrors && setServerErrors(error.data?.errors);
    }
  }

  function openDeleteAccount(e) {
    e.preventDefault();

    setIsDeleteingAccountOpen(true);
  }

  async function deleteAccount(e?, setIsEditing?, setIsLoading?, setServerErrors?) {
    e.preventDefault();

    setIsLoading && setIsLoading(true);

    try {
      await ProfileService.deleteAccount();

      setIsEditing && setIsEditing(false);
      setIsLoading && setIsLoading(false);

      await logout();
    } catch (error) {
      setIsLoading && setIsLoading(false);
      setServerErrors && setServerErrors(error.data?.errors);
    }
  }

  return isLoading ? (
    <Spinner size="large" />
  ) : (
    <div className={`l-page ng-flex marapp-qa-user-profile ng-ep-background-gray-9`} id="portal">
      <div>
        <Link
          className="ng-border-remove"
          to={{
            type: 'EARTH',
          }}
        >
          <img src={APP_LOGO} className="ng-margin" alt="" />
        </Link>
      </div>

      <UserMenu
        selected={page}
        isAuthenticated={isAuthenticated}
        profileLink={<Link to={{ type: 'PROFILE' }}>Profile</Link>}
        onLogin={login}
        onLogout={logout}
        onSignUp={() => login({ initialScreen: 'signUp' })}
      />

      <div className="ng-user-profile-container">
        <div className="ng-padding-large">
          <h1 className="ng-margin-medium-bottom ng-text-center ng-text-uppercase ng-ep-text-gray-1 ng-text-display-m user-profile-title">
            Manage your account
          </h1>
          <form className="ng-form ng-form-dark">
            <div className="ng-grid">
              {resetPasswordState === RESET_PASSWORD_STATE.SENT && (
                <div className="ng-width-2-3 ng-push-1-6 ng-margin-bottom">
                  <div className="ng-background-success ng-padding-medium ng-flex ng-flex-space-between">
                    <span>
                      An email has been sent to {userData.email} with a link to reset your password.
                    </span>
                    <button
                      className="ng-text-display-l ng-text-weight-thin ng-position-absolute ng-position-top-right ng-margin-right marapp-qa-resetpassword-dismiss"
                      onClick={() =>
                        setResetPasswordState(RESET_PASSWORD_STATE.NOTIFICATION_DISMISS)
                      }
                    >
                      &times;
                    </button>
                  </div>
                </div>
              )}
              <div className="ng-width-2-3 ng-push-1-6">
                <InlineEditCard
                  {...(!REACT_APP_EXTERNAL_IDP_URL && {
                    render: ({ setIsEditing, setIsLoading, setServerErrors }) => (
                      <>
                        <div className="ng-margin-medium-bottom">
                          <Input
                            name="firstName"
                            placeholder="First Name"
                            label="First Name"
                            defaultValue={userProfile.firstName}
                            error={renderErrorFor('firstName')}
                            ref={register({
                              minLength: 1,
                              maxLength: 40,
                              required: true,
                            })}
                            className="ng-display-block marapp-qa-inputfirstname"
                          />
                        </div>
                        <div className="ng-margin-medium-bottom">
                          <Input
                            name="lastName"
                            placeholder="Last Name"
                            label="Last Name"
                            defaultValue={userProfile.lastName}
                            error={renderErrorFor('lastName')}
                            ref={register({
                              minLength: 1,
                              maxLength: 80,
                              required: true,
                            })}
                            className="ng-display-block marapp-qa-inputlastname"
                          />
                        </div>
                      </>
                    ),
                    validForm: isValid && formState.dirty,
                    onSubmit: onSubmitName,
                  })}
                >
                  <h3 className="ng-margin-small-bottom ng-color-mdgray ng-text-uppercase ng-text-display-s ng-text-weight-medium user-profile-section-title">
                    Name
                  </h3>
                  <p className="ng-margin-remove">{userName}</p>
                </InlineEditCard>
              </div>
              <div className="ng-width-2-3 ng-push-1-6 ng-margin-top">
                <InlineEditCard
                  onSubmit={onEmailChange}
                  validForm={isValid}
                  render={({ setIsEditing, setIsLoading, setServerErrors }) => (
                    <>
                      <div className="ng-margin-medium-bottom">
                        <Input
                          name="email"
                          placeholder="Email"
                          label="Email*"
                          className="marapp-qa-inputemail ng-display-block ng-margin-medium-bottom"
                          defaultValue={userData.email}
                          error={renderErrorFor('email')}
                          ref={register({
                            required: 'Please enter a valid email',
                            validate: {
                              valueChangedRule: (value) => valueChangedRule(value, userData.email),
                              validEmailRule: validEmailRule(),
                            },
                          })}
                        />
                      </div>
                      <div className="ng-margin-medium-bottom">
                        <p>
                          After saving, we will send an email to your new email address to confirm
                          the change.
                          <br />
                          Be sure to check your spam folder if you do not receive the email in a few
                          minutes.
                        </p>
                      </div>
                    </>
                  )}
                >
                  {!pendingEmail && (
                    <>
                      <h3 className="ng-margin-small-bottom ng-color-mdgray ng-text-uppercase ng-text-display-s ng-text-weight-medium user-profile-section-title">
                        Email
                      </h3>
                      {pendingEmail}
                      <p className="ng-margin-remove">{userData.email}</p>
                    </>
                  )}
                  {pendingEmail && (
                    <>
                      <h3 className="ng-margin-small-bottom ng-color-mdgray ng-text-uppercase ng-text-display-s ng-text-weight-medium user-profile-section-title">
                        Current email
                      </h3>
                      <p className="ng-margin-remove">{userData.email}</p>
                      <br />
                      <h3 className="ng-margin-small-bottom ng-color-mdgray ng-text-uppercase ng-text-display-s ng-text-weight-medium user-profile-section-title">
                        New Email (Pending Confirmation)
                        <button
                          onClick={onCancelEmailChange}
                          type="button"
                          className="marapp-qa-actioncancelupdate ng-button ng-button-link ng-text-transform-remove ng-color-mdgray ng-margin-small-left"
                        >
                          cancel update
                        </button>
                      </h3>
                      <p className="ng-margin-remove">{pendingEmail}</p>
                    </>
                  )}
                </InlineEditCard>
              </div>
              <div className="ng-width-2-3 ng-push-1-6 ng-margin-top">
                <InlineEditCard>
                  <h3 className="ng-margin-small-bottom ng-color-mdgray ng-text-uppercase ng-text-display-s ng-text-weight-medium user-profile-section-title">
                    Password reset
                  </h3>
                  <p className="ng-margin-remove">
                    We'll send you an email to reset your password.
                    <br />
                    Be sure to check your spam folder if you do not receive the email in a few
                    minutes.
                  </p>
                  <button
                    className="ng-button ng-button-secondary ng-margin-top marapp-qa-resetpassword"
                    disabled={
                      !!REACT_APP_EXTERNAL_IDP_URL ||
                      resetPasswordState !== RESET_PASSWORD_STATE.INITIAL
                    }
                    onClick={sendResetEmail}
                  >
                    {resetPasswordState === RESET_PASSWORD_STATE.INITIAL ? (
                      <span>Send reset email</span>
                    ) : resetPasswordState === RESET_PASSWORD_STATE.SENDING ? (
                      <div className="ng-flex">
                        <Spinner size="mini" position="relative" />
                        <span>Sending reset email</span>
                      </div>
                    ) : (
                      <span>Email sent</span>
                    )}
                  </button>
                </InlineEditCard>
              </div>
              <div className="ng-width-2-3 ng-push-1-6 ng-margin-top">
                {Object.keys(userRoles).length > 0 && (
                  <InlineEditCard
                    render={({ setIsEditing, setIsLoading, setServerErrors }) => (
                      <>
                        <h3 className="ng-margin-small-bottom ng-color-mdgray ng-text-uppercase ng-text-display-s ng-text-weight-medium user-profile-section-title">
                          Organizations
                        </h3>
                        <div className="ng-grid ng-margin-top">
                          <div className="ng-width-1-2 ng-text-weight-bold">Organization name</div>
                          <div className="ng-width-1-4 ng-text-weight-bold">Role</div>
                          {Object.keys(userRoles).map((org) => (
                            <>
                              <div className="ng-width-1-2 ng-margin-top">{org}</div>
                              <div className="ng-width-1-4 ng-margin-top">
                                {markedOrgsForLeave[org] ? (
                                  <span className="ng-color-mdgray"> marked for removal</span>
                                ) : (
                                  userRoles[org].join(', ')
                                )}
                              </div>
                              <div className="ng-width-1-4 ng-margin-top">
                                <button
                                  className="ng-button ng-button-link ng-text-lowercase"
                                  disabled={userRoles[org].includes('Owner')}
                                  onClick={(e) => switchMarkOrgForLeave(e, org)}
                                >
                                  {markedOrgsForLeave[org] ? 'cancel' : 'leave organization'}
                                </button>
                              </div>
                            </>
                          ))}
                        </div>
                      </>
                    )}
                    validForm={Object.keys(markedOrgsForLeave).length > 0}
                    onSubmit={onSubmitOrgLeave}
                    onCancel={() => setMarkedOrgsForLeave({})}
                  >
                    <h3 className="ng-margin-small-bottom ng-color-mdgray ng-text-uppercase ng-text-display-s ng-text-weight-medium user-profile-section-title">
                      Organizations
                    </h3>
                    <div className="ng-grid ng-margin-top">
                      <div className="ng-width-1-2 ng-text-weight-bold">Organization name</div>
                      <div className="ng-width-1-2 ng-text-weight-bold">Role</div>
                      {Object.keys(userRoles).map((org) => (
                        <>
                          <div className="ng-width-1-2 ng-margin-top">{org}</div>
                          <div className="ng-width-1-2 ng-margin-top">
                            {userRoles[org].join(', ')}
                          </div>
                        </>
                      ))}
                    </div>
                  </InlineEditCard>
                )}
              </div>
              <div className="ng-width-2-3 ng-push-1-6 ng-margin-top">
                <InlineEditCard
                  render={({ setIsEditing, setIsLoading, setServerErrors }) => (
                    <>
                      <h3 className="ng-margin-small-bottom ng-color-mdgray ng-text-uppercase ng-text-display-s ng-text-weight-medium user-profile-section-title">
                        Account access
                      </h3>
                      <p className="ng-margin-remove">
                        Deleting your account will remove you from all public &amp; private
                        workspaces, and
                        <br />
                        erase all of your settings.
                      </p>
                      <p>
                        <label className="ng-padding-bottom ng-flex ng-c-cursor-pointer">
                          <input
                            className="ng-checkbox-input ng-flex-item-none ng-margin-top-remove"
                            type="checkbox"
                            checked={confirmDeleteAccount}
                            onChange={(e) => setConfirmDeleteAccount(e.target.checked)}
                          />
                          I understand this will permanently delete my account and that this action
                          can
                          <br />
                          not be undone.
                        </label>
                      </p>
                    </>
                  )}
                  submitButtonText={'DELETE'}
                  submitButtonVariant={'danger'}
                  manualOpen={isDeletingAccountOpen}
                  onCancel={() => setIsDeleteingAccountOpen(false)}
                  onSubmit={deleteAccount}
                  validForm={confirmDeleteAccount}
                >
                  <h3 className="ng-margin-small-bottom ng-color-mdgray ng-text-uppercase ng-text-display-s ng-text-weight-medium user-profile-section-title">
                    Account access
                  </h3>
                  <button
                    className="ng-button ng-button-secondary ng-margin-top marapp-qa-deleteaccount"
                    onClick={openDeleteAccount}
                  >
                    Delete your account
                  </button>
                </InlineEditCard>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
