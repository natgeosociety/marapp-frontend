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

import yn from 'yn';

const NODE_ENV: string = process.env.NODE_ENV;
const PUBLIC_URL: string = process.env.PUBLIC_URL;

const MAP_BASE_URL: string = process.env.GATSBY_APP_MAP_BASE_URL || '/';
const MAP_API_URL: string = process.env.GATSBY_APP_MAP_API_URL;
const MAP_FULLPAGE_LICENSE: string = process.env.GATSBY_APP_MAP_FULLPAGE_LICENSE;
const MAP_ADMIN_URL: string = process.env.GATSBY_APP_MAP_ADMIN_URL;
const MAP_APP_NAME: string = process.env.GATSBY_APP_MAP_NAME;
const MAP_MAPBOX_TOKEN: string = process.env.GATSBY_APP_MAP_MAPBOX_TOKEN;
const MAP_WEGLOT_API_KEY: string = process.env.GATSBY_APP_MAP_WEGLOT_API_KEY;
const MAP_COMPANY_URL: string = process.env.GATSBY_APP_MAP_COMPANY_URL;
const MAP_EXTERNAL_IDP_URL: string = process.env.GATSBY_APP_MAP_EXTERNAL_IDP_URL || '';
const MAP_GTM_TAG: string = process.env.GATSBY_APP_MAP_GTM_TAG;
const MAP_ENABLE_PUBLIC_ACCESS: boolean = yn(process.env.GATSBY_APP_MAP_ENABLE_PUBLIC_ACCESS, {
  default: false,
});

const MAP_SIDEBAR_WIDTH = 375;
const MAP_SIDEBAR_WIDTH_WIDE = 500;

export {
  NODE_ENV,
  PUBLIC_URL,
  MAP_BASE_URL,
  MAP_API_URL,
  MAP_FULLPAGE_LICENSE,
  MAP_ADMIN_URL,
  MAP_APP_NAME,
  MAP_MAPBOX_TOKEN,
  MAP_WEGLOT_API_KEY,
  MAP_COMPANY_URL,
  MAP_EXTERNAL_IDP_URL,
  MAP_GTM_TAG,
  MAP_ENABLE_PUBLIC_ACCESS,
  MAP_SIDEBAR_WIDTH,
  MAP_SIDEBAR_WIDTH_WIDE,
};
