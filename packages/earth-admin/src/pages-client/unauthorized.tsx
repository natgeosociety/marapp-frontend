import * as React from 'react';
import { Auth0Context } from 'utils/contexts';

export default function UnauthorizedPage(props) {
  return (
    <div className="ng-background-ltgray ng-padding-large ng-height-viewport ng-flex ng-flex-center ng-text-center">
      <div className="ng-flex ng-flex-middle">
        <div>
          <h1>403</h1>
          <h2 className="ng-text-edit-m">You don’t have permission to access this page.</h2>
          <Auth0Context.Consumer>
            {({ logout }) => (
              <div className="ng-padding-medium">
                <button onClick={() => logout()} className="ng-button ng-button-primary">
                  <span className="ng-display-block">LOG OUT</span>
                </button>
              </div>
            )}
          </Auth0Context.Consumer>
        </div>
      </div>
    </div>
  );
}
