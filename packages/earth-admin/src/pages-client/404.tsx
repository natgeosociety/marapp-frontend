import { navigate } from 'gatsby';
import React from 'react';

import { NotFoundComponent } from '@marapp/earth-shared';

import { GATSBY_APP_NAME } from '@app/config';
import { APP_ABOUT } from '../theme';

const NotFoundPage = () => {
  const returnToHome = () => {
    navigate('/');
  };

  return (
    <NotFoundComponent
      returnToHome={returnToHome}
      aboutLink={APP_ABOUT}
      appName={GATSBY_APP_NAME}
    />
  );
};

export default NotFoundPage;
