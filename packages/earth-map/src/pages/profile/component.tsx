import React, { useContext } from 'react';

import { Auth0Context } from 'auth/auth0';
import { UserMenuComponent } from 'components/user-menu';

import { InlineEditCard } from '@marapp/earth-shared';
// import { Input } from '@app/components/input';

import Link from 'redux-first-router-link';
import { APP_LOGO } from 'theme';

export function ProfileComponent(props: any) {
  const { userData } = useContext(Auth0Context);

  return (
    <div className={`l-page ng-flex marapp-qa-user-profile ng-ep-background-gray-9`}>
      <Link
        className="ng-border-remove"
        to={{
          type: 'EARTH',
        }}
      >
        <img src={APP_LOGO} className="ng-display-block ng-margin" />
      </Link>
      <UserMenuComponent />
      <div className="ng-user-profile-container">
        <div className="ng-padding-large">
          <h1 className="ng-text-display-m ng-margin-medium-bottom ng-text-center ng-ep-text-gray-1">
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
                  <div className="ng-margin-medium-bottom">
                    <p className="ng-text-weight-bold ng-margin-remove ng-color-mdgray ng-text-uppercase">
                      Name
                    </p>
                    <p className="ng-margin-remove">{userData.name}</p>
                  </div>
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
                  <div className="ng-margin-medium-bottom">
                    <p className="ng-text-weight-bold ng-margin-remove ng-color-mdgray ng-text-uppercase">
                      Email
                    </p>
                    <p className="ng-margin-remove">{userData.email}</p>
                  </div>
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
                  <div className="ng-margin-medium-bottom">
                    <p className="ng-text-weight-bold ng-margin-remove ng-color-mdgray ng-text-uppercase">
                      Password reset
                    </p>
                    <p className="ng-margin-remove">
                      We'll send you an email to reset your password.
                      <br />
                      Be sure to check your spam folder if you do not receive the email in a few
                      minutes.
                    </p>
                    <button className="ng-button ng-button-secondary ng-margin-top" disabled>
                      Send reset email
                    </button>
                  </div>
                </InlineEditCard>
              </div>
              <div className="ng-width-2-3 ng-push-1-6 ng-margin-top">
                <InlineEditCard
                // render={({setIsEditing, setIsLoading, setServerErrors}) => (
                //   <>
                //     <div className="ng-margin-medium-bottom">
                //       <p className="ng-text-weight-bold ng-margin-remove ng-color-mdgray ng-text-uppercase">Organizations</p>
                //       <div className="ng-grid ng-margin-top">
                //         <div className="ng-width-1-2 ng-text-weight-bold">Organization name</div>
                //         <div className="ng-width-1-2 ng-text-weight-bold">Role</div>
                //         {Object.keys(userData.roles).map(org => (
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
                  <div className="ng-margin-medium-bottom">
                    <p className="ng-text-weight-bold ng-margin-remove ng-color-mdgray ng-text-uppercase">
                      Organizations
                    </p>
                    <div className="ng-grid ng-margin-top">
                      <div className="ng-width-1-2 ng-text-weight-bold">Organization name</div>
                      <div className="ng-width-1-2 ng-text-weight-bold">Role</div>
                      {Object.keys(userData.roles).map((org) => (
                        <>
                          <div className="ng-width-1-2 ng-margin-top">{org}</div>
                          <div className="ng-width-1-2 ng-margin-top">
                            {userData.roles[org].join(', ')}
                          </div>
                        </>
                      ))}
                    </div>
                  </div>
                </InlineEditCard>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
