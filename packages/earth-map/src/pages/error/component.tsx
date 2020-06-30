import React from 'react';
import { Button } from '@marapp/earth-components';

import { replace } from 'redux-first-router'
import ErrorTemplate from 'components/error-template';

const ErrorPage = ({ resetStore }) => {
  return (
    <ErrorTemplate
      type="Error"
      message="Sorry, something went wrong.">
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
};

export default ErrorPage;
