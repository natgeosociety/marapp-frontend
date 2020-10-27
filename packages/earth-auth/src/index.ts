import Auth0Lock from 'auth0-lock';
import './styles.scss';

const TERMS_OF_SERVICE = 'http://google.com';

// var config = JSON.parse(decodeURIComponent(escape(window.atob('@@config@@'))));
const config = JSON.parse(
  decodeURIComponent(
    escape(
      window.atob(
        'eyJpY29uIjoiaHR0cHM6Ly93d3cubmV3LnVuYmlvZGl2ZXJzaXR5bGFiLm9yZy93cC1jb250ZW50L3VwbG9hZHMvMjAyMC8wNy9VTkJMX0ZVTExfV0VCU0lURS5wbmciLCJhc3NldHNVcmwiOiIiLCJhdXRoMERvbWFpbiI6InVuYmwtZGV2LmV1LmF1dGgwLmNvbSIsImF1dGgwVGVuYW50IjoidW5ibC1kZXYiLCJjbGllbnRDb25maWd1cmF0aW9uQmFzZVVybCI6Imh0dHBzOi8vY2RuLmV1LmF1dGgwLmNvbS8iLCJjYWxsYmFja09uTG9jYXRpb25IYXNoIjpmYWxzZSwiY2FsbGJhY2tVUkwiOiJodHRwczovL2QybnhiaWNmMHMxcnUyLmNsb3VkZnJvbnQubmV0LyIsImNkbiI6Imh0dHBzOi8vY2RuLmF1dGgwLmNvbS8iLCJjbGllbnRJRCI6InoxcVBWb3E3ZThrOW9pNnpOUndURmRiRXhSSlg0NE12IiwiZGljdCI6eyJzaWduaW4iOnsidGl0bGUiOiJVTiBCaW9kaXZlcnNpdHkgTGFiIChEZXYpIn19LCJleHRyYVBhcmFtcyI6eyJ0ZW5hbnQiOiJ1bmJsLWRldiIsIl9pbnRzdGF0ZSI6ImRlcHJlY2F0ZWQifSwiaW50ZXJuYWxPcHRpb25zIjp7InRlbmFudCI6InVuYmwtZGV2IiwiX2ludHN0YXRlIjoiZGVwcmVjYXRlZCJ9LCJ3aWRnZXRVcmwiOiJodHRwczovL2Nkbi5hdXRoMC5jb20vdzIvYXV0aDAtd2lkZ2V0LTUuMS5taW4uanMiLCJpc1RoaXJkUGFydHlDbGllbnQiOmZhbHNlLCJhdXRob3JpemF0aW9uU2VydmVyIjp7InVybCI6Imh0dHBzOi8vdW5ibC1kZXYuZXUuYXV0aDAuY29tIiwiaXNzdWVyIjoiaHR0cHM6Ly91bmJsLWRldi5ldS5hdXRoMC5jb20vIn0sImNvbG9ycyI6eyJwYWdlX2JhY2tncm91bmQiOiIjMDAwMDAwIiwicHJpbWFyeSI6IiMwMDk5YTEifX0='
      )
    )
  )
);
const PRIVACY_POLICY = 'http://google.com';

config.extraParams = config.extraParams || {};
const connection = config.connection;
let prompt = config.prompt;
let languageDictionary;
let language;

if (config.dict && config.dict.signin && config.dict.signin.title) {
  languageDictionary = {
    title: config.dict.signin.title,
    signUpTerms: `By signing up, you agree to our <a target="_blank" href=${TERMS_OF_SERVICE}>terms of service</a> and
        <a target="_blank" href=${PRIVACY_POLICY}>privacy policy.</a>`,
    forgotPasswordAction: 'Forgot password?',
    loginSubmitLabel: 'Sign in',
  };
} else if (typeof config.dict === 'string') {
  language = config.dict;
}
const loginHint = config.extraParams.login_hint;
const colors = config.colors || {};

// Available Lock configuration options: https://auth0.com/docs/libraries/lock/v11/configuration
const lock = new Auth0Lock(config.clientID, config.auth0Domain, {
  avatar: null,
  auth: {
    redirectUrl: config.callbackURL,
    responseType:
      (config.internalOptions || {}).response_type ||
      (config.callbackOnLocationHash ? 'token' : 'code'),
    params: config.internalOptions,
  },
  configurationBaseUrl: config.clientConfigurationBaseUrl,
  overrides: {
    __tenant: config.auth0Tenant,
    __token_issuer: config.authorizationServer.issuer,
  },
  assetsUrl: config.assetsUrl,
  allowedConnections: connection ? [connection] : null,
  rememberLastLogin: !prompt,
  language: language,
  languageDictionary: languageDictionary,
  theme: {
    logo: config.icon,
    primaryColor: colors.primary ? colors.primary : 'green',
  },
  initialScreen: config.extraParams.initialScreen,
  prefill: loginHint ? { email: loginHint, username: loginHint } : null,
  closable: false,
  defaultADUsernameFromEmailPrefix: false,
  additionalSignUpFields: [
    {
      name: 'given_name',
      placeholder: 'first name',
      icon:
        "data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3C!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.1//EN' 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3E%3Csvg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' version='1.1' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath d='M12,4C14.21,4 16,5.79 16,8C16,10.21 14.21,12 12,12C9.79,12 8,10.21 8,8C8,5.79 9.79,4 12,4M12,6C10.9,6 10,6.9 10,8C10,9.1 10.9,10 12,10C13.1,10 14,9.1 14,8C14,6.9 13.1,6 12,6M12,13C14.67,13 20,14.33 20,17V20H4V17C4,14.33 9.33,13 12,13M12,14.9C9.03,14.9 5.9,16.36 5.9,17V18.1H18.1V17C18.1,16.36 14.97,14.9 12,14.9Z'/%3E%3C/svg%3E%0A",
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
        "data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3C!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.1//EN' 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3E%3Csvg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' version='1.1' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath d='M12,4C14.21,4 16,5.79 16,8C16,10.21 14.21,12 12,12C9.79,12 8,10.21 8,8C8,5.79 9.79,4 12,4M12,6C10.9,6 10,6.9 10,8C10,9.1 10.9,10 12,10C13.1,10 14,9.1 14,8C14,6.9 13.1,6 12,6M12,13C14.67,13 20,14.33 20,17V20H4V17C4,14.33 9.33,13 12,13M12,14.9C9.03,14.9 5.9,16.36 5.9,17V18.1H18.1V17C18.1,16.36 14.97,14.9 12,14.9Z'/%3E%3C/svg%3E%0A",
      storage: 'root',
      validator: (familyName) => {
        return {
          valid: familyName.trim().length >= 1,
          hint: "Last name can't be blank",
        };
      },
    },
    // {
    //   name: 'nickname',
    //   placeholder: 'Enter your nickname (optional)',
    //   storage: 'root',
    //   validator: (nickname) => {
    //     if (!nickname) {
    //       return true; // optional
    //     }
    //     return {
    //       valid: nickname.trim().length >= 1,
    //       hint: "Nickname can't be blank",
    //     };
    //   },
    // },
  ],
});

lock.show();
