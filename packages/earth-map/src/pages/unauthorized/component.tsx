import React from 'react';
import { Button } from '@marapp/earth-components';

import { useAuth0 } from 'auth/auth0';
import ErrorTemplate from 'components/error-template';

const Unauthorized = () => {
  const { logout } = useAuth0();

  return (
    <ErrorTemplate
      type="403"
      message="You don’t have permission to access this page.">
      <ul className="not-found--links--list">
        <li>
          <Button
            onClick={() => {
              logout();
            }}
            className="-light -fullwidth">
            Log out
          </Button>
        </li>
      </ul>
    </ErrorTemplate>
  );
}

export default Unauthorized;
