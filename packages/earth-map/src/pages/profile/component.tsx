import { Auth0Context } from 'auth/auth0';
import React, { useContext, useEffect, useState } from 'react';
import Link from 'redux-first-router-link';
import { fetchProfile } from 'services/users';
import { APP_LOGO } from 'theme';

import { InlineEditCard, Spinner, UserMenu } from '@marapp/earth-shared';

interface IProps {
  page: string;
}

export function ProfileComponent(props: IProps) {
  const { page } = props;
  const { userData, logout, login, isAuthenticated } = useContext(Auth0Context);
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState('');

  const userRoles = Object.keys(userData.roles);

  useEffect(() => {
    (async () => {
      const profile: any = await fetchProfile();

      setUserName(
        profile.firstName && profile.lastName
          ? `${profile.firstName} ${profile.lastName}`
          : profile.name
      );

      setIsLoading(false);
    })();
  }, []);

  return isLoading ? (
    <Spinner size="large" />
  ) : (
    <div className={`l-page ng-flex marapp-qa-user-profile ng-ep-background-gray-9`}>
      <Link
        className="ng-border-remove"
        to={{
          type: 'EARTH',
        }}
      >
        <img src={APP_LOGO} className="ng-display-block ng-margin" />
      </Link>

      <UserMenu
        selected={page}
        isAuthenticated={isAuthenticated}
        onLogin={login}
        onLogout={logout}
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
                //     <div className="ng-margin-medium-bottom">
                //       <p>
                //         After saving, we will send an email to your new email address to confirm the change.
                //         <br/>
                //         Be sure to check your spam folder if you do not receive the email in a few minutes.
                //       </p>
                //     </div>
                //   </>
                // )}>
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
