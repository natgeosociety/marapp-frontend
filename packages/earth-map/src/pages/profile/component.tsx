import { Auth0Context } from 'auth/auth0';
import React, { useContext, useEffect, useState } from 'react';
import Link from 'redux-first-router-link';
import { fetchProfile, updateProfile, resetPassword } from 'services/users';
import { APP_LOGO } from 'theme';
import { REACT_APP_EXTERNAL_IDP_URL } from 'config';

import { useForm } from 'react-hook-form';
import {
  InlineEditCard,
  Spinner,
  UserMenu,
  Input,
  setupErrors,
  validEmailRule,
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
  const [userProfile, setUserProfile] = useState({ firstName: '', lastName: '', name: '' });
  const [resetPasswordState, setResetPasswordState] = useState(RESET_PASSWORD_STATE.INITIAL);

  const { touched, isValid } = formState;
  const renderErrorFor = setupErrors(formErrors, touched);

  const userRoles = Object.keys(userData.roles);

  const processUserName = ({ firstName, lastName, name }) => {
    setUserName(firstName && lastName ? `${firstName} ${lastName}` : name);
  };

  useEffect(() => {
    (async () => {
      const profile: any = await fetchProfile();
      setUserProfile(profile.data);
      processUserName(profile.data);

      setIsLoading(false);
    })();
  }, []);

  async function onSubmitName(e?, setIsEditing?, setIsLoading?, setServerErrors?) {
    e.preventDefault();

    const formData = getValues();

    try {
      setIsLoading && setIsLoading(true);

      const result: any = await updateProfile(formData);
      setUserProfile(result.data);
      processUserName(result.data);

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

    await resetPassword();

    setResetPasswordState(RESET_PASSWORD_STATE.SENT);
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
                      className="ng-text-display-l ng-text-weight-thin ng-position-absolute ng-position-top-right ng-margin-right marapp-qa-resetpassword"
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
                    validForm: isValid,
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
                // render={({ setIsEditing, setIsLoading, setServerErrors }) => (
                //   <>
                //     <div className="ng-margin-medium-bottom">
                //       <Input
                //         name="email"
                //         placeholder="Email"
                //         label="Email*"
                //         className="marapp-qa-inputemail ng-display-block ng-margin-medium-bottom"
                //         defaultValue={userData.email}
                //         error={renderErrorFor('email')}
                //         ref={register({
                //           required: 'Please enter a valid email',
                //           validate: {
                //             validEmailRule: validEmailRule(),
                //           },
                //         })}
                //       />
                //     </div>
                //     <div className="ng-margin-medium-bottom">
                //       <p>
                //         After saving, we will send an email to your new email address to confirm
                //         the change.
                //         <br />
                //         Be sure to check your spam folder if you do not receive the email in a few
                //         minutes.
                //       </p>
                //     </div>
                //   </>
                // )}
                >
                  <h3 className="ng-margin-small-bottom ng-color-mdgray ng-text-uppercase ng-text-display-s ng-text-weight-medium user-profile-section-title">
                    Email
                  </h3>
                  <p className="ng-margin-remove">{userData.email}</p>
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
                    className="ng-button ng-button-secondary ng-margin-top"
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
                {userRoles.length > 0 && (
                  <InlineEditCard
                  // render={({setIsEditing, setIsLoading, setServerErrors}) => (
                  //   <>
                  //     <div className="ng-margin-medium-bottom">
                  //       <p className="ng-text-weight-bold ng-margin-remove ng-color-mdgray ng-text-uppercase">Organizations</p>
                  //       <div className="ng-grid ng-margin-top">
                  //         <div className="ng-width-1-2 ng-text-weight-bold">Organization name</div>
                  //         <div className="ng-width-1-2 ng-text-weight-bold">Role</div>
                  //         {userRoles.map(org => (
                  //           <>
                  //             <div className="ng-width-1-2 ng-margin-top">{org}</div>
                  //             <div className="ng-width-1-2 ng-margin-top">{userData.roles[org].join(', ')}</div>
                  //           </>
                  //         ))}
                  //       </div>
                  //     </div>
                  //   </>
                  // )}>
                  >
                    <h3 className="ng-margin-small-bottom ng-color-mdgray ng-text-uppercase ng-text-display-s ng-text-weight-medium user-profile-section-title">
                      Organizations
                    </h3>
                    <div className="ng-grid ng-margin-top">
                      <div className="ng-width-1-2 ng-text-weight-bold">Organization name</div>
                      <div className="ng-width-1-2 ng-text-weight-bold">Role</div>
                      {userRoles.map((org) => (
                        <>
                          <div className="ng-width-1-2 ng-margin-top">{org}</div>
                          <div className="ng-width-1-2 ng-margin-top">
                            {userData.roles[org].join(', ')}
                          </div>
                        </>
                      ))}
                    </div>
                  </InlineEditCard>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
