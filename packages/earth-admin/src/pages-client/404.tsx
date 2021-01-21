import { navigate } from 'gatsby';
import React from 'react';

import { NotFoundComponent } from '@marapp/earth-shared';

import { ADMIN_NAME } from '@app/config';

import { APP_ABOUT } from '../theme';

const NotFoundPage = () => {
  const returnToHome = () => {
    navigate('/');
  };

  return (
    <NotFoundComponent returnToHome={returnToHome} aboutLink={APP_ABOUT} appName={ADMIN_NAME} />
  );
};

export default NotFoundPage;
