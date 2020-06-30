import React from 'react';
import { replace } from 'redux-first-router'
import { Button } from '@marapp/earth-components';

import ErrorTemplate from 'components/error-template';

const NotFound = ({ resetStore }) => {
  return (
    <ErrorTemplate
      type="404"
      message="Sorry we couldn't find that page.">
      <ul className="not-found--links--list">
        <li>
          <Button onClick={() => {
            resetStore();
            replace('/');
          }} className="-light -fullwidth">
            Home
          </Button>
        </li>
      </ul>
    </ErrorTemplate>
  )
}

export default NotFound;
