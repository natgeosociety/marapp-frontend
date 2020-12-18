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

export const NODE_ENV = process.env.NODE_ENV;
export const PUBLIC_URL = process.env.PUBLIC_URL;

export const BASE_URL = process.env.REACT_APP_BASE_URL || '/';
export const API_URL = process.env.REACT_APP_API_URL;
export const FULLPAGE_LICENSE = process.env.REACT_APP_FULLPAGE_LICENSE;
export const ADMIN_URL = process.env.REACT_APP_ADMIN_URL;
export const APP_NAME = process.env.REACT_APP_NAME;
export const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN;
export const WEGLOT_API_KEY = process.env.REACT_APP_WEGLOT_API_KEY;
export const COMPANY_URL = process.env.REACT_APP_COMPANY_URL;

export const GTM_TAG = process.env.REACT_APP_GTM_TAG;
export const ENABLE_PUBLIC_ACCESS = yn(process.env.REACT_APP_ENABLE_PUBLIC_ACCESS, {
  default: false,
});

export const SIDEBAR_WIDTH = 375;
export const SIDEBAR_WIDTH_WIDE = 500;

export const REACT_APP_EXTERNAL_IDP_URL = process.env.REACT_APP_EXTERNAL_IDP_URL || '';
