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

import Auth0Lock from 'auth0-lock';
import './styles.scss';

const ENV_CONFIG = {
  terms: process.env.APP_TERMS_OF_SERVICE,
  privacy: process.env.APP_PRIVACY_POLICY,
  atob: process.env.APP_ATOB,
};

const atob = ENV_CONFIG.atob ? ENV_CONFIG.atob : '@@config@@';

const AUTH_CONFIG = JSON.parse(decodeURIComponent(escape(window.atob(atob))));

AUTH_CONFIG.extraParams = AUTH_CONFIG.extraParams || {};
const connection = AUTH_CONFIG.connection;
let prompt = AUTH_CONFIG.prompt;
let languageDictionary;
let language;

if (AUTH_CONFIG.dict && AUTH_CONFIG.dict.signin && AUTH_CONFIG.dict.signin.title) {
  languageDictionary = {
    title: AUTH_CONFIG.dict.signin.title,
    signUpTerms: `By signing up, you agree to our <a target="_blank" href=${ENV_CONFIG.terms}>terms of service</a> and
        <a target="_blank" href=${ENV_CONFIG.privacy}>privacy policy.</a>`,
    forgotPasswordAction: 'Forgot password?',
    loginSubmitLabel: 'Sign in',
  };
} else if (typeof AUTH_CONFIG.dict === 'string') {
  language = AUTH_CONFIG.dict;
}
const loginHint = AUTH_CONFIG.extraParams.login_hint;
const colors = AUTH_CONFIG.colors || {};

const lock = new Auth0Lock(AUTH_CONFIG.clientID, AUTH_CONFIG.auth0Domain, {
  avatar: null,
  auth: {
    redirectUrl: AUTH_CONFIG.callbackURL,
    responseType:
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
      icon:
        "data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3C!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.1//EN' 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3E%3Csvg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' version='1.1' width='17' height='17' viewBox='0 0 24 24'%3E%3Cpath fill='%23ADB5BD' d='M12,4C14.21,4 16,5.79 16,8C16,10.21 14.21,12 12,12C9.79,12 8,10.21 8,8C8,5.79 9.79,4 12,4M12,6C10.9,6 10,6.9 10,8C10,9.1 10.9,10 12,10C13.1,10 14,9.1 14,8C14,6.9 13.1,6 12,6M12,13C14.67,13 20,14.33 20,17V20H4V17C4,14.33 9.33,13 12,13M12,14.9C9.03,14.9 5.9,16.36 5.9,17V18.1H18.1V17C18.1,16.36 14.97,14.9 12,14.9Z'/%3E%3C/svg%3E%0A",
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
      icon:
        "data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3C!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.1//EN' 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3E%3Csvg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' version='1.1' width='17' height='17' viewBox='0 0 24 24'%3E%3Cpath fill='%23ADB5BD' d='M12,4C14.21,4 16,5.79 16,8C16,10.21 14.21,12 12,12C9.79,12 8,10.21 8,8C8,5.79 9.79,4 12,4M12,6C10.9,6 10,6.9 10,8C10,9.1 10.9,10 12,10C13.1,10 14,9.1 14,8C14,6.9 13.1,6 12,6M12,13C14.67,13 20,14.33 20,17V20H4V17C4,14.33 9.33,13 12,13M12,14.9C9.03,14.9 5.9,16.36 5.9,17V18.1H18.1V17C18.1,16.36 14.97,14.9 12,14.9Z'/%3E%3C/svg%3E%0A",
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
