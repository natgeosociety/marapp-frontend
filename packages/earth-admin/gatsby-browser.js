import React from 'react';
import { Auth0Provider } from './src/auth/auth0';
import config from './src/auth/config';
import { onRedirectCallback, onSuccessHook, onFailureHook } from './src/auth/hooks';


export const wrapRootElement = ({ element }) =>
  <Auth0Provider domain={`${config.auth0.domain}`}
    client_id={`${config.auth0.clientId}`}
    redirect_uri={`${config.auth0.redirectUri}`}
    audience={config.auth0.audience}
    onRedirectCallback={onRedirectCallback}
    onSuccessHook={onSuccessHook}
    onFailureHook={onFailureHook}>
    {element}
  </Auth0Provider>;
