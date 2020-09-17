/*
  Copyright 2018-2020 National Geographic Society

  Use of this software does not constitute endorsement by National Geographic
  Society (NGS). The NGS name and NGS logo may not be used for any purpose without
  written permission from NGS.

  Licensed under the Apache License, Version 2.0 (the "License"); you may not use
  this file except in compliance with the License. You may obtain a copy of the
  License at

      https://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed
  under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
  CONDITIONS OF ANY KIND, either express or implied. See the License for the
  specific language governing permissions and limitations under the License.
*/

import React from 'react';

import AsyncPage from './async';
import AuthenticatedPage from './authenticated';
import AuthorizedPage from './authorized';

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
      {page === 'change-email' && (
        // @ts-ignore
        <Page page="change-email" fallbackRoute={fallbackRoute} />
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
