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

const path = require('path');

const GATSBY_ACTIVE_ENV = process.env.GATSBY_ACTIVE_ENV || '.env';

require('dotenv').config({ path: GATSBY_ACTIVE_ENV });

module.exports = {
  pathPrefix: process.env.GATSBY_APP_MAP_BASE_URL,
  siteMetadata: {
    siteName: 'Map',
  },
  plugins: [
    'gatsby-plugin-typescript',
    'gatsby-plugin-sass',
    {
      resolve: 'gatsby-plugin-create-client-paths',
      options: {
        prefixes: ['/*'],
      },
    },
    {
      resolve: 'gatsby-plugin-portal',
      options: {
        key: 'portal',
        id: 'portal',
      },
    },
    {
      resolve: 'gatsby-plugin-root-import',
      options: {
        '@app/auth': path.join(__dirname, 'src/auth'),
        '@app/components': path.join(__dirname, 'src/components'),
        '@app/config': path.join(__dirname, 'src/config'),
        '@app/constants': path.join(__dirname, 'src/constants'),
        '@app/fonts': path.join(__dirname, 'src/fonts'),
        '@app/images': path.join(__dirname, 'src/images'),
        '@app/modules': path.join(__dirname, 'src/modules'),
        '@app/pages': path.join(__dirname, 'src/pages'),
        '@app/pages-client': path.join(__dirname, 'src/pages-client'),
        '@app/sagas': path.join(__dirname, 'src/sagas'),
        '@app/services': path.join(__dirname, 'src/services'),
        '@app/store': path.join(__dirname, 'src/store'),
        '@app/utils': path.join(__dirname, 'src/utils'),
        styles: path.join(__dirname, 'src/styles'),
      },
    },
  ],
};
