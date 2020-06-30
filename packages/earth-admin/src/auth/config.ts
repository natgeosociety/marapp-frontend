import urljoin from 'url-join';
import {
  GATSBY_APP_AUTH0_DOMAIN,
  GATSBY_APP_BASE_URL,
  GATSBY_APP_AUTH0_CLIENT_ID,
  GATSBY_APP_AUTH0_AUDIENCE,
} from 'config';

const auth0 = {
  domain: GATSBY_APP_AUTH0_DOMAIN,
  clientId: GATSBY_APP_AUTH0_CLIENT_ID,
  // @ts-ignore
  redirectUri: urljoin(window.location.origin, GATSBY_APP_BASE_URL),
  audience: GATSBY_APP_AUTH0_AUDIENCE,
};

export default { auth0 };
