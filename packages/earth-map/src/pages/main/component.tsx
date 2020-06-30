import React from 'react';

import AuthenticatedPage from './authenticated';
import AuthorizedPage from './authorized';
import AsyncPage from './async';

const Main = ({ router }) => {
  const { type, routesMap } = router;
  const { page, authenticated, authorized, fallbackRoute } = routesMap[type];

  const Page =
    authenticated && authorized ? AuthorizedPage : authenticated ? AuthenticatedPage : AsyncPage;

  return (
    <React.Fragment>
      {page === 'home' && (
        // @ts-ignore
        <Page page="home" fallbackRoute={fallbackRoute} />
      )}
      {page === 'earth' && (
        // @ts-ignore
        <Page page="earth" fallbackRoute={fallbackRoute} />
      )}
      {page === 'experience' && (
        // @ts-ignore
        <Page page="experience" fallbackRoute={fallbackRoute} />
      )}
      {page === 'not-found' && (
        // @ts-ignore
        <Page page="not-found" fallbackRoute={fallbackRoute} />
      )}
      {page === 'error' && (
        // @ts-ignore
        <Page page="error" fallbackRoute={fallbackRoute} />
      )}
      {page === 'unauthorized' && (
        // @ts-ignore
        <Page page="unauthorized" fallbackRoute={fallbackRoute} />
      )}
    </React.Fragment>
  );
};

export default Main;
