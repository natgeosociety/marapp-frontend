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

const GATSBY_API_URL: string = process.env.GATSBY_API_URL;
const BASE_URL: string = process.env.GATSBY_APP_BASE_URL || '/';
const GATSBY_APP_AUTH0_DOMAIN: string = process.env.GATSBY_APP_AUTH0_DOMAIN;
const GATSBY_APP_AUTH0_CLIENT_ID: string = process.env.GATSBY_APP_AUTH0_CLIENT_ID;
const GATSBY_APP_BASE_URL: string = process.env.GATSBY_APP_BASE_URL;
const GATSBY_APP_AUTH0_AUDIENCE: string = process.env.GATSBY_APP_AUTH0_AUDIENCE;
const GATSBY_APP_MAPBOX_TOKEN: string = process.env.GATSBY_APP_MAPBOX_TOKEN;
const GATSBY_APP_AUTH0_NAMESPACE: string = process.env.GATSBY_APP_AUTH0_NAMESPACE;
const MAP_PATH: string = process.env.GATSBY_APP_MAP_URL;
const GATSBY_APP_NAME: string = process.env.GATSBY_APP_NAME;
const PUBLIC_ORG: string = process.env.GATSBY_APP_PUBLIC_ORG;

export {
  GATSBY_API_URL,
  BASE_URL,
  GATSBY_APP_AUTH0_AUDIENCE,
  GATSBY_APP_AUTH0_CLIENT_ID,
  GATSBY_APP_AUTH0_DOMAIN,
  GATSBY_APP_BASE_URL,
  GATSBY_APP_MAPBOX_TOKEN,
  GATSBY_APP_AUTH0_NAMESPACE,
  MAP_PATH,
  GATSBY_APP_NAME,
  PUBLIC_ORG,
};
