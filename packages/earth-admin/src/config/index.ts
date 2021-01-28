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

const ADMIN_API_URL: string = process.env.GATSBY_APP_ADMIN_API_URL;
const ADMIN_BASE_URL: string = process.env.GATSBY_APP_ADMIN_BASE_URL || '/';
const ADMIN_AUTH0_DOMAIN: string = process.env.GATSBY_APP_ADMIN_AUTH0_DOMAIN;
const ADMIN_AUTH0_CLIENT_ID: string = process.env.GATSBY_APP_ADMIN_AUTH0_CLIENT_ID;
const ADMIN_AUTH0_AUDIENCE: string = process.env.GATSBY_APP_ADMIN_AUTH0_AUDIENCE;
const ADMIN_MAPBOX_TOKEN: string = process.env.GATSBY_APP_ADMIN_MAPBOX_TOKEN;
const ADMIN_AUTH0_NAMESPACE: string = process.env.GATSBY_APP_ADMIN_AUTH0_NAMESPACE;
const ADMIN_MAP_PATH: string = process.env.GATSBY_APP_ADMIN_MAP_URL;
const ADMIN_NAME: string = process.env.GATSBY_APP_ADMIN_NAME;
const ADMIN_PUBLIC_ORG: string = process.env.GATSBY_APP_ADMIN_PUBLIC_ORG;

export {
  ADMIN_API_URL,
  ADMIN_BASE_URL,
  ADMIN_AUTH0_AUDIENCE,
  ADMIN_AUTH0_CLIENT_ID,
  ADMIN_AUTH0_DOMAIN,
  ADMIN_MAPBOX_TOKEN,
  ADMIN_AUTH0_NAMESPACE,
  ADMIN_MAP_PATH,
  ADMIN_NAME,
  ADMIN_PUBLIC_ORG,
};
