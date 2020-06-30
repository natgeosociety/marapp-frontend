const path = require('path');

const GATSBY_ACTIVE_ENV = process.env.GATSBY_ACTIVE_ENV || '.env'

require('dotenv').config({ path: GATSBY_ACTIVE_ENV });

module.exports = {
  pathPrefix: process.env.GATSBY_APP_BASE_URL,
  siteMetadata: {
    siteName: 'Admin'
  },
  plugins: [
    'gatsby-plugin-typescript',
    'gatsby-plugin-sass',
    {
      resolve: 'gatsby-plugin-create-client-paths',
      options: {
        prefixes: ['/*']
      }
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
        styles: path.join(__dirname, 'src/styles')
      }
    }
  ]
};
