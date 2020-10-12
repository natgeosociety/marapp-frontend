import { Auth0Context } from 'auth/auth0';
import React, { useContext, useEffect, useState } from 'react';
import Link from 'redux-first-router-link';
import { changeEmailConfirmation, fetchProfile } from 'services/users';
import { APP_LOGO } from 'theme';

import { useForm } from 'react-hook-form';
import {
  InlineEditCard,
  Spinner,
  UserMenu,
  Input,
  setupErrors,
  validEmailRule,
} from '@marapp/earth-shared';
import auth0 from 'config/auth0';
import { Auth0Client } from '@auth0/auth0-spa-js';
import { handleLayerForm } from '@marapp/earth-admin/src/services';

interface IProps {
  page: string;
}

export function ProfileComponent(props: IProps) {
  const { page } = props;

  const { getValues, register, formState, errors: formErrors } = useForm({
    mode: 'onChange',
  });

  const { userData, logout, login, isAuthenticated, getToken } = useContext(Auth0Context);
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState('');
  const [serverErrors, setServerErrors] = useState();
  console.log(userData);

  const { touched, isValid } = formState;
  const renderErrorFor = setupErrors(formErrors, touched);

  const userRoles = Object.keys(userData.roles);

  useEffect(() => {
    (async () => {
      const profile: any = await fetchProfile();

      console.log(profile);

      setUserName(
        profile.firstName && profile.lastName
          ? `${profile.firstName} ${profile.lastName}`
          : profile.name
      );

      setIsLoading(false);
    })();
  }, []);

  const handleEmailChange = async (e) => {
    e.preventDefault();

    try {
      await changeEmailConfirmation({ email: 'corina.cioloca@gmail.com' });
      // console.log(response, 'hehe');
    } catch (error) {
      console.log(error);
      setServerErrors && setServerErrors(error.errors[0]);
    }

    // if (response && response?.success) {
    //   alert('Email change successful. Please login using the new credentials.');
    //   // Auth0 sessions are reset when a user’s email or password changes;
    //   // force a re-login if email change request successful;
    //   //return login({appState: {targetUrl: '/'}}); // TODO: redirect to profile after successful change;
    // } else {
    //   alert('Could not change email address.');
    // }
  };

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
              <div className="ng-width-2-3 ng-push-1-6">
                <InlineEditCard
                // render={({setIsEditing, setIsLoading, setServerErrors}) => (
                //   <>
                //     <div className="ng-margin-medium-bottom">
                //       <Input
                //         name="firstName"
                //         placeholder="First Name"
                //         label="First Name"
                //         defaultValue={''}
                //         className="ng-display-block marapp-qa-inputfirstname"
                //       />
                //     </div>
                //     <div className="ng-margin-medium-bottom">
                //       <Input
                //         name="lastName"
                //         placeholder="Last Name"
                //         label="Last Name"
                //         defaultValue={''}
                //         className="ng-display-block marapp-qa-inputlastname"
                //       />
                //     </div>
                //   </>
                // )}>
                >
                  <h3 className="ng-margin-small-bottom ng-color-mdgray ng-text-uppercase ng-text-display-s ng-text-weight-medium user-profile-section-title">
                    Name
                  </h3>
                  <p className="ng-margin-remove">{userName}</p>
                </InlineEditCard>
              </div>
              <div className="ng-width-2-3 ng-push-1-6 ng-margin-top">
                <InlineEditCard
                  onSubmit={handleEmailChange}
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
                  <h3 className="ng-margin-small-bottom ng-color-mdgray ng-text-uppercase ng-text-display-s ng-text-weight-medium user-profile-section-title">
                    Email
                  </h3>
                  <p className="ng-margin-remove">{userData.email}</p>
                </InlineEditCard>
              </div>
              <div className="ng-width-2-3 ng-push-1-6 ng-margin-top">
                <InlineEditCard
                // render={({setIsEditing, setIsLoading, setServerErrors}) => (
                //   <>
                //     <div className="ng-margin-medium-bottom">
                //       <Input
                //         name="email"
                //         placeholder="Email"
                //         label="Email"
                //         defaultValue={''}
                //         className="ng-display-block marapp-qa-inputemail"
                //       />
                //     </div>
                //   </>
                // )}>
                >
                  <h3 className="ng-margin-small-bottom ng-color-mdgray ng-text-uppercase ng-text-display-s ng-text-weight-medium user-profile-section-title">
                    Password reset
                  </h3>
                  <p className="ng-margin-remove">
                    We'll send you an email to reset your password.
                    <br />
                    Be sure to check your spam folder if you do not receive the email in a few
                    minutes.
                  </p>
                  <button className="ng-button ng-button-secondary ng-margin-top" disabled={true}>
                    Send reset email
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
