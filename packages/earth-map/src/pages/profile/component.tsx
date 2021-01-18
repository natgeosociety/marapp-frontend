import classnames from 'classnames';
import { capitalize, identity, omit, pickBy } from 'lodash';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import Link from 'redux-first-router-link';

import {
  InlineEditCard,
  Input,
  setupErrors,
  Spinner,
  UserMenu,
  validEmailRule,
  valueChangedRule,
} from '@marapp/earth-shared';

import { Auth0Context } from '../../auth/auth0';
import { GATSBY_APP_EXTERNAL_IDP_URL, PUBLIC_URL } from '../../config';
import ProfileService from '../../services/ProfileService';
import { APP_LOGO } from '../../theme';
import './styles.scss';

interface IProps {
  page: string;
  resetStore?: () => void;
}

enum RESET_PASSWORD_STATE {
  INITIAL,
  SENDING,
  SENT,
  NOTIFICATION_DISMISS,
}

export function ProfileComponent(props: IProps) {
  const { page, resetStore } = props;
  const { t } = useTranslation();

  const { getValues, register, formState, errors: formErrors } = useForm({
    mode: 'all',
  });

  const { userData, logout, login, isAuthenticated, updateToken } = useContext(Auth0Context);
  const [isLoading, setIsLoading] = useState(true);
  const [isUserRolesLoading, setIsUserRolesLoading] = useState(true);
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
  const [hasLeftOrg, setHasLeftOrg] = useState(false); // detect when the user is leaving an org in order to
  // change the map link to a "native" one (classic navigation to reset the whole state)
  const [userRoles, setUserRoles] = useState({});
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

  const fetchUserProfile = useCallback(async () => {
    try {
      const response = await ProfileService.fetchProfile();
      setUserProfile(response.data);
      processUserName(response.data);

      response.data?.pendingEmail && setPendingEmail(response.data.pendingEmail);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchUserGroups = useCallback(async () => {
    try {
      const response = await ProfileService.fetchProfile({ include: 'groups' });
      groupRolesByOrganization(response.data?.groups);
    } finally {
      setIsUserRolesLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserProfile();
    fetchUserGroups();
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
      await updateToken();

      setUserRoles({ ...omit(userRoles, orgsToLeave) });
      setHasLeftOrg(true);

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
    <div
      className={`marapp-qa-user-profile ng-flex ng-flex-column ng-ep-background-gray-9`}
      id="portal"
    >
      <div className="ng-position-fixed ng-width-1">
        <div>
          {
            // TODO: remove this when we find a way to do a full reset (redux and auth0 context) and use redux-first-router link
            hasLeftOrg ? (
              <a href={`${PUBLIC_URL}earth`} className="ng-border-remove">
                <img src={APP_LOGO} className="marapp-qa-logo ng-margin" alt="" />
                <span className="ng-text-display-s ng-text-weight-regular ng-color-ultraltgray">
                  | {t('Return to map view')}
                </span>
              </a>
            ) : (
              <Link
                className="ng-border-remove"
                onClick={resetStore}
                to={{
                  type: 'EARTH',
                }}
              >
                <img src={APP_LOGO} className="marapp-qa-logo ng-margin" alt="" />
                <span className="ng-text-display-s ng-text-weight-regular ng-color-ultraltgray">
                  | {t('Return to map view')}
                </span>
              </Link>
            )
          }
        </div>

        <UserMenu
          selected={page}
          userName={userData.name}
          isAuthenticated={isAuthenticated}
          profileLink={<Link to={{ type: 'PROFILE' }}>{t('Profile')}</Link>}
          onLogin={login}
          onLogout={logout}
          onSignUp={() => login({ initialScreen: 'signUp' })}
        />
      </div>
      <div className="ng-user-profile-container">
        <div className="ng-padding-large">
          <h1 className="ng-margin-medium-bottom ng-text-center ng-text-uppercase ng-ep-text-gray-1 ng-text-display-m user-profile-title">
            {t('Manage your account')}
          </h1>

          <form className="ng-form ng-form-dark">
            <div className="ng-grid">
              {resetPasswordState === RESET_PASSWORD_STATE.SENT && (
                <div className="ng-width-2-3 ng-push-1-6 ng-margin-bottom">
                  <div className="ng-background-success ng-padding-medium ng-flex ng-flex-space-between">
                    <span>
                      {t('An email has been sent to {{email}} with a link to reset your password', {
                        email: userData.email,
                      })}
                      .
                    </span>
                    <button
                      className="marapp-qa-resetpassword-dismiss ng-text-display-l ng-text-weight-thin ng-position-absolute ng-position-top-right ng-margin-right"
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
                  {...(!GATSBY_APP_EXTERNAL_IDP_URL && {
                    render: ({ setIsEditing, setIsLoading, setServerErrors }) => (
                      <>
                        <div className="ng-margin-medium-bottom">
                          <Input
                            name="firstName"
                            placeholder={t('First Name')}
                            label={t('First Name')}
                            defaultValue={userProfile.firstName}
                            error={renderErrorFor('firstName')}
                            ref={register({
                              minLength: 1,
                              maxLength: 40,
                              required: true,
                            })}
                            className="marapp-qa-inputfirstname ng-display-block"
                          />
                        </div>
                        <div className="ng-margin-medium-bottom">
                          <Input
                            name="lastName"
                            placeholder={t('Last Name')}
                            label={t('Last Name')}
                            defaultValue={userProfile.lastName}
                            error={renderErrorFor('lastName')}
                            ref={register({
                              minLength: 1,
                              maxLength: 80,
                              required: true,
                            })}
                            className="marapp-qa-inputlastname ng-display-block"
                          />
                        </div>
                      </>
                    ),
                    validForm: isValid && formState.isDirty,
                    onSubmit: onSubmitName,
                  })}
                >
                  <h3 className="ng-margin-small-bottom ng-color-mdgray ng-text-uppercase ng-text-display-s ng-text-weight-medium user-profile-section-title">
                    {t('Name')}
                  </h3>
                  <p className="marapp-qa-user-name ng-margin-remove">{userName}</p>
                </InlineEditCard>
              </div>
              <div className="ng-width-2-3 ng-push-1-6 ng-margin-top">
                <InlineEditCard
                  {...(!GATSBY_APP_EXTERNAL_IDP_URL && {
                    onSubmit: onEmailChange,
                    validForm: isValid,
                    render: ({ setIsEditing, setIsLoading, setServerErrors }) => (
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
                              required: t('Please enter a valid email') as string,
                              validate: {
                                valueChangedRule: (value) =>
                                  valueChangedRule(value, userData.email),
                                validEmailRule: validEmailRule(),
                              },
                            })}
                          />
                        </div>
                        <div className="ng-margin-medium-bottom">
                          <p>
                            {t(
                              'After saving, we will send an email to your new email address to confirm the change'
                            )}
                            .
                            <br />
                            {t(
                              'Be sure to check your spam folder if you do not receive the email in a few minutes'
                            )}
                            .
                          </p>
                        </div>
                      </>
                    ),
                  })}
                >
                  {!pendingEmail && (
                    <>
                      <h3 className="ng-margin-small-bottom ng-color-mdgray ng-text-uppercase ng-text-display-s ng-text-weight-medium user-profile-section-title">
                        Email
                      </h3>
                      {pendingEmail}
                      <p className="marapp-qa-user-email ng-margin-remove">{userData.email}</p>
                    </>
                  )}
                  {pendingEmail && (
                    <>
                      <h3 className="ng-margin-small-bottom ng-color-mdgray ng-text-uppercase ng-text-display-s ng-text-weight-medium user-profile-section-title">
                        {t('Current email')}
                      </h3>
                      <p className="ng-margin-remove">{userData.email}</p>
                      <br />
                      <h3 className="ng-margin-small-bottom ng-color-mdgray ng-text-uppercase ng-text-display-s ng-text-weight-medium user-profile-section-title">
                        {t('New Email')} ({t('Pending Confirmation')})
                        <button
                          onClick={onCancelEmailChange}
                          type="button"
                          className="marapp-qa-actioncancelupdate ng-button ng-button-link ng-text-transform-remove ng-color-mdgray ng-margin-small-left"
                        >
                          {t('cancel update')}
                        </button>
                      </h3>
                      <p className="marapp-qa-user-pending-email ng-margin-remove">
                        {pendingEmail}
                      </p>
                    </>
                  )}
                </InlineEditCard>
              </div>
              <div className="ng-width-2-3 ng-push-1-6 ng-margin-top">
                <InlineEditCard>
                  <h3 className="ng-margin-small-bottom ng-color-mdgray ng-text-uppercase ng-text-display-s ng-text-weight-medium user-profile-section-title">
                    {t('Password reset')}
                  </h3>
                  <p className="ng-margin-remove">
                    {t(`We'll send you an email to reset your password`)}.
                    <br />
                    {t(
                      `Be sure to check your spam folder if you do not receive the email in a few minutes`
                    )}
                    .
                  </p>
                  <button
                    className="marapp-qa-resetpassword ng-button ng-button-secondary ng-margin-top"
                    disabled={
                      !!GATSBY_APP_EXTERNAL_IDP_URL ||
                      resetPasswordState !== RESET_PASSWORD_STATE.INITIAL
                    }
                    onClick={sendResetEmail}
                  >
                    {resetPasswordState === RESET_PASSWORD_STATE.INITIAL ? (
                      <span>{t('Send reset email')}</span>
                    ) : resetPasswordState === RESET_PASSWORD_STATE.SENDING ? (
                      <div className="ng-flex">
                        <Spinner size="mini" position="relative" />
                        <span>{t('Sending reset email')}</span>
                      </div>
                    ) : (
                      <span>{t('Email sent')}</span>
                    )}
                  </button>
                </InlineEditCard>
              </div>
              <div className="ng-width-2-3 ng-push-1-6 ng-margin-top">
                <InlineEditCard
                  hideEditButton={isUserRolesLoading || !Object.keys(userRoles).length}
                  render={({ setIsEditing, setIsLoading, setServerErrors }) => (
                    <>
                      <h3 className="ng-margin-small-bottom ng-color-mdgray ng-text-uppercase ng-text-display-s ng-text-weight-medium user-profile-section-title">
                        {t('Organizations')}
                      </h3>

                      <div className="ng-grid ng-margin-top">
                        <div className="ng-width-1-2 ng-text-weight-bold">
                          {t('Organization name')}
                        </div>
                        <div className="ng-width-1-4 ng-text-weight-bold">{t('Role')}</div>
                        {Object.keys(userRoles).map((org) => (
                          <>
                            <div className="ng-width-1-2 ng-margin-top">{org}</div>
                            <div className="ng-width-1-4 ng-margin-top">
                              {markedOrgsForLeave[org] ? (
                                <span className="ng-color-mdgray">{t('marked for removal')}</span>
                              ) : (
                                userRoles[org].join(', ')
                              )}
                            </div>
                            <div className="ng-width-1-4 ng-margin-top">
                              <button
                                className={classnames(
                                  markedOrgsForLeave[org]
                                    ? 'marapp-qa-cancelorgaction'
                                    : 'marapp-qa-leaveorg',
                                  'ng-button ng-button-link ng-text-lowercase'
                                )}
                                onClick={(e) => switchMarkOrgForLeave(e, org)}
                              >
                                {markedOrgsForLeave[org] ? t('Cancel') : t('leave organization')}
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
                  <>
                    <div className="ng-flex ng-flex-space-between">
                      <h3 className="ng-margin-small-bottom ng-color-mdgray ng-text-uppercase ng-text-display-s ng-text-weight-medium user-profile-section-title">
                        {t('Organizations')}
                      </h3>

                      {isUserRolesLoading && (
                        <Spinner
                          size="nano"
                          position="relative"
                          className="ng-user-organisations-spinner"
                        />
                      )}
                    </div>

                    <div className="ng-grid ng-margin-top">
                      {isUserRolesLoading ? null : Object.keys(userRoles).length ? (
                        <>
                          <div className="ng-width-1-2 ng-text-weight-bold">
                            {t('Organization name')}
                          </div>
                          <div className="ng-width-1-2 ng-text-weight-bold">{t('Role')}</div>
                        </>
                      ) : (
                        <>
                          <div className="ng-width-1-2">{t('No organisations available')}</div>
                        </>
                      )}

                      {Object.keys(userRoles).map((org) => (
                        <>
                          <div className="ng-width-1-2 ng-margin-top">{org}</div>
                          <div className="ng-width-1-2 ng-margin-top">
                            {userRoles[org].join(', ')}
                          </div>
                        </>
                      ))}
                    </div>
                  </>
                </InlineEditCard>
              </div>
              <div className="ng-width-2-3 ng-push-1-6 ng-margin-top">
                <InlineEditCard
                  render={({ setIsEditing, setIsLoading, setServerErrors }) => (
                    <>
                      <h3 className="ng-margin-small-bottom ng-color-mdgray ng-text-uppercase ng-text-display-s ng-text-weight-medium user-profile-section-title">
                        {t('Account access')}
                      </h3>
                      <p className="ng-margin-remove">
                        {t(
                          'Deleting your account will remove you from all public & private workspaces, and'
                        )}
                        <br />
                        {t('erase all of your settings')}.
                      </p>
                      <p>
                        <label className="ng-padding-bottom ng-flex ng-c-cursor-pointer">
                          <input
                            className="marapp-qa-confirm-delete ng-checkbox-input ng-flex-item-none ng-margin-top-remove"
                            type="checkbox"
                            checked={confirmDeleteAccount}
                            onChange={(e) => setConfirmDeleteAccount(e.target.checked)}
                          />
                          {t(
                            'I understand this will permanently delete my account and that this action can'
                          )}
                          <br />
                          {t('not be undone')}.
                        </label>
                      </p>
                    </>
                  )}
                  hideEditButton={true}
                  submitButtonText={t('DELETE')}
                  submitButtonVariant={'danger'}
                  onCancel={() => {
                    setConfirmDeleteAccount(false);
                  }}
                  onSubmit={deleteAccount}
                  validForm={confirmDeleteAccount}
                >
                  {({ setIsEditing }) => (
                    <>
                      <h3 className="ng-margin-small-bottom ng-color-mdgray ng-text-uppercase ng-text-display-s ng-text-weight-medium user-profile-section-title">
                        {t('Account access')}
                      </h3>
                      <button
                        type="button"
                        className="marapp-qa-deleteaccount ng-button ng-button-secondary ng-margin-top"
                        onClick={() => setIsEditing(true)}
                      >
                        {t('Delete your account')}
                      </button>
                    </>
                  )}
                </InlineEditCard>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
