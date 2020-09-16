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
  pathPrefix: process.env.GATSBY_APP_BASE_URL,
  siteMetadata: {
    siteName: 'Admin',
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
      resolve: `gatsby-plugin-portal`,
      options: {
        key: 'portal',
        id: 'portal',
      },
    },
    {
      resolve: `gatsby-plugin-root-import`,
      options: {
        root: path.join(__dirname, 'src'),
        pages: path.join(__dirname, 'src/pages'),
        'pages-client': path.join(__dirname, 'src/pages-client'),
        components: path.join(__dirname, 'src/components'),
        images: path.join(__dirname, 'src/images'),
        layouts: path.join(__dirname, 'src/layouts'),
        utils: path.join(__dirname, 'src/utils'),
        auth: path.join(__dirname, 'src/auth'),
        config: path.join(__dirname, 'src/config'),
        services: path.join(__dirname, 'src/services'),
        styles: path.join(__dirname, 'src/styles'),
      },
    },
  ],
};
