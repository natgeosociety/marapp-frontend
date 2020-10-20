import { navigate } from 'gatsby';
import React from 'react';

import { NotFoundComponent } from '@marapp/earth-shared';

import { GATSBY_APP_BASE_URL, GATSBY_APP_NAME } from '@app/config';

const NotFoundPage = () => {
  const returnToHome = () => {
    navigate(GATSBY_APP_BASE_URL);
  };

  return (
    <NotFoundComponent
      returnToHome={returnToHome}
      aboutLink={GATSBY_APP_BASE_URL}
      appName={GATSBY_APP_NAME}
    />
  );
};

export default NotFoundPage;
