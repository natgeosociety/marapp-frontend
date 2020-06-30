import React from 'react';
import * as ReactDOM from 'react-dom';

import App from './App';
import * as serviceWorker from './serviceWorker';

import { Auth0Provider } from './auth/auth0';
import config from './auth/config';
import { onRedirectCallback, onSuccessHook, onFailureHook } from './auth/hooks';

import 'styles/index.scss';

ReactDOM.render(
  // @ts-ignore
  <Auth0Provider
    domain={config.auth0.domain}
    client_id={config.auth0.clientId}
    redirect_uri={config.auth0.redirectUri}
    audience={config.auth0.audience}
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
