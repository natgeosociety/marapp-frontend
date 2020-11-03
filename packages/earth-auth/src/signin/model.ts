export interface Auth0LockConfig {
  icon: string;
  auth0Tenant: any;
  authorizationServer: any;
  auth0Domain: string;
  callbackOnLocationHash: string | any;
  assetsUrl: string;
  internalOptions: Auth0LockAuthParamsOptions;
  clientConfigurationBaseUrl: string;
  clientID: string;
  callbackURL: string;
  extraParams: any;
  connection: string;
  dict: {
    signin: {
      title: string;
    };
  };
  prompt: any;
  colors: any;
}
