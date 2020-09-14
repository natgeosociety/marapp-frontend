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
import * as ReactDOM from 'react-dom';
import TagManager from 'react-gtm-module';

import 'styles/index.scss';
import 'core-js/stable';

import App from './App';
import * as serviceWorker from './serviceWorker';
import { Auth0Provider } from './auth/auth0';
import auth0 from './config/auth0';
import { GTM_TAG } from './config';
import { onRedirectCallback, onSuccessHook, onFailureHook } from './auth/hooks';

if (GTM_TAG) {
  const tagManagerArgs = { gtmId: GTM_TAG };
  TagManager.initialize(tagManagerArgs);
}

ReactDOM.render(
  // @ts-ignore
  <Auth0Provider
    domain={auth0.config.domain}
    client_id={auth0.config.clientId}
    redirect_uri={auth0.config.redirectUri}
    audience={auth0.config.audience}
    onRedirectCallback={onRedirectCallback}
    onSuccessHook={onSuccessHook}
    onFailureHook={onFailureHook}
  >
    <App />
  </Auth0Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
