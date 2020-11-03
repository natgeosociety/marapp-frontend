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
import { AuthEnv } from './config';
import { Auth0LockConfig } from './model';

const profile = require('./assets/profile.svg') as string;

const AUTH_CONFIG: Auth0LockConfig = JSON.parse(
  decodeURIComponent(escape(window.atob(AuthEnv.atob)))
);

AUTH_CONFIG.extraParams = AUTH_CONFIG.extraParams || {};
const connection = AUTH_CONFIG.connection;
let prompt = AUTH_CONFIG.prompt;
let languageDictionary;
let language;

if (AUTH_CONFIG.dict && AUTH_CONFIG.dict.signin && AUTH_CONFIG.dict.signin.title) {
  languageDictionary = {
    title: AUTH_CONFIG.dict.signin.title,
    signUpTerms: `By signing up, you agree to our <a target="_blank" href=${AuthEnv.terms}>terms of service</a> and
        <a target="_blank" href=${AuthEnv.privacy}>privacy policy.</a>`,
    forgotPasswordAction: 'Forgot password?',
    loginSubmitLabel: 'Sign in',
  };
} else if (typeof AUTH_CONFIG.dict === 'string') {
  language = AUTH_CONFIG.dict;
}
const loginHint = AUTH_CONFIG.extraParams.login_hint;
const colors = AUTH_CONFIG.colors || {};

const lock: Auth0LockStatic = new Auth0Lock(AUTH_CONFIG.clientID, AUTH_CONFIG.auth0Domain, {
  avatar: null,
  auth: {
    redirectUrl: AUTH_CONFIG.callbackURL,
    responseType:
      //@ts-ignore
      (AUTH_CONFIG.internalOptions || {}).response_type ||
      (AUTH_CONFIG.callbackOnLocationHash ? 'token' : 'code'),
    params: AUTH_CONFIG.internalOptions,
  },
  configurationBaseUrl: AUTH_CONFIG.clientConfigurationBaseUrl,
  overrides: {
    __tenant: AUTH_CONFIG.auth0Tenant,
    __token_issuer: AUTH_CONFIG.authorizationServer.issuer,
  },
  assetsUrl: AUTH_CONFIG.assetsUrl,
  allowedConnections: connection ? [connection] : null,
  rememberLastLogin: !prompt,
  language: language,
  languageDictionary: languageDictionary,
  theme: {
    logo: AUTH_CONFIG.icon,
    primaryColor: colors.primary ? colors.primary : 'green',
  },
  initialScreen: AUTH_CONFIG.extraParams.initialScreen,
  prefill: loginHint ? { email: loginHint, username: loginHint } : null,
  closable: false,
  defaultADUsernameFromEmailPrefix: false,
  additionalSignUpFields: [
    {
      name: 'given_name',
      placeholder: 'first name',
      icon: profile,
      //@ts-ignore
      storage: 'root',
      validator: (givenName) => {
        return {
          valid: givenName.trim().length >= 1,
          hint: "First name can't be blank",
        };
      },
    },
    {
      name: 'family_name',
      placeholder: 'last name',
      icon: profile,
      //@ts-ignore
      storage: 'root',
      validator: (familyName) => {
        return {
          valid: familyName.trim().length >= 1,
          hint: "Last name can't be blank",
        };
      },
    },
  ],
});

lock.show();
