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

import 'core-js/stable';
import React from 'react';
import TagManager from 'react-gtm-module';
import 'styles/index.scss';

import { Auth0Provider } from './src/auth/auth0';
import { onRedirectCallback, onSuccessHook, onFailureHook } from './src/auth/hooks';
import auth0 from './src/config/auth0';

import { GTM_TAG } from './src/config';

if (GTM_TAG) {
  const tagManagerArgs = { gtmId: GTM_TAG };
  TagManager.initialize(tagManagerArgs);
}

export const wrapRootElement = ({ element }) => (
  <Auth0Provider
    domain={auth0.config.domain}
    client_id={auth0.config.clientId}
    redirect_uri={auth0.config.redirectUri}
    audience={auth0.config.audience}
    onRedirectCallback={onRedirectCallback}
    onSuccessHook={onSuccessHook}
    onFailureHook={onFailureHook}
    useRefreshTokens={true}
    cacheLocation={'memory'}
  >
    {element}
  </Auth0Provider>
);
