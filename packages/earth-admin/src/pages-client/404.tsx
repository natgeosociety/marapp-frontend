import { navigate } from 'gatsby';
import React from 'react';

import { NotFoundComponent } from '@marapp/earth-shared';

import { GATSBY_APP_BASE_URL } from '@app/config';

import { APP_NAME } from '../theme';

const NotFoundPage = () => {
  const returnToHome = () => {
    navigate(GATSBY_APP_BASE_URL);
  };

  return (
    <NotFoundComponent
      returnToHome={returnToHome}
      aboutLink={GATSBY_APP_BASE_URL}
      appName={APP_NAME}
    />
  );
};

export default NotFoundPage;
