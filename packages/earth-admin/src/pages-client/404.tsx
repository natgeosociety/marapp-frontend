import React from 'react';

import { NotFound } from '@marapp/earth-shared';
import { GATSBY_APP_BASE_URL } from '@app/config';
import { APP_NAME } from '../theme';
import { navigate } from 'gatsby';

const NotFoundPage = () => {
  const returnToHome = () => {
    navigate(GATSBY_APP_BASE_URL);
  };

  return (
    <NotFound returnToHome={returnToHome} aboutLink={GATSBY_APP_BASE_URL} appName={APP_NAME} />
  );
};

export default NotFoundPage;
