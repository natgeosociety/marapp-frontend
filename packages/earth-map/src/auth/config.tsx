// @ts-ignore
import * as urljoin from 'url-join';

const auth0 = {
  domain: process.env.REACT_APP_AUTH0_DOMAIN,
  clientId: process.env.REACT_APP_AUTH0_CLIENT_ID,
  redirectUri: urljoin(window.location.origin, process.env.REACT_APP_BASE_URL || ''),
  audience: process.env.REACT_APP_AUTH0_AUDIENCE,
  namespace: process.env.REACT_APP_AUTH0_NAMESPACE
};

export default { auth0 };
