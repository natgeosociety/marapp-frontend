# Earth Admin

Marapp Earth-Admin, Gatsby.js powered administration dashboard for content management.

## Setup

Available commands:

| Command                   | Description                    |
| ------------------------- | ------------------------------ |
| yarn install              | Install dependencies.          |
| yarn start                | Start development server.      |
| yarn build                | Compile TypeScript resources.  |

## Running

Create a local `.env` and `.env.local` file based on [.env.sample](.env.sample), add the required configuration for the environment.

The following environment variables are required by the application.

| **Key** | **Description** |
| ------------- |:----------------|
| `NODE_ENV` | Node.js environment (e.g. `development`, `production`) |
| `GATSBY_APP_ADMIN_NAME` | The name of the app (e.g. `marapp`) |
| `GATSBY_APP_ADMIN_PUBLIC_ORG` | The name of the public organization (e.g. `MARAPP`) |
| `GATSBY_APP_ADMIN_BASE_URL` | https://reach.tech/router/api/Router - `basepath` |
| `GATSBY_APP_ADMIN_API_URL` | https://www.gatsbyjs.org/docs/environment-variables/#client-side-javascript - API URL |
| `GATSBY_APP_ADMIN_MAPBOX_TOKEN` | https://docs.mapbox.com/help/glossary/access-token - Mapbox access token |
| `GATSBY_APP_ADMIN_AUTH0_DOMAIN` | https://auth0.com/docs/custom-domains - Auth0 domain |
| `GATSBY_APP_ADMIN_AUTH0_CLIENT_ID`| https://auth0.com/docs/flows/concepts/client-credentials - Auth0 Client ID |
| `GATSBY_APP_ADMIN_AUTH0_AUDIENCE` | https://auth0.com/docs/tokens/guides/get-access-tokens - Auth0 audience |
| `GATSBY_APP_ADMIN_AUTH0_NAMESPACE` | https://auth0.com/docs/tokens/guides/create-namespaced-custom-claims - Auth0 namespace |
| `GATSBY_TELEMETRY_DISABLED` |  https://www.gatsbyjs.org/docs/telemetry/ |

The required environment variables are also described in [.env.sample](.env.sample).

### Troubleshooting
If you get errors while trying to install the private packages, try setting a timeout
```yarn install --network-timeout 100000```

## Theming

#### Styling the theme
App styling is done using the `config.scss` file, that exposes a set of variables.

```scss
$marapp-primary-font: 'Primary font';
$marapp-secondary-font: 'Secondary font';
$marapp-icon-font: 'icon-font';

$marapp-color-success: #hex;
$marapp-color-error: #hex;

$marapp-primary-color: #hex;
$marapp-secondary-color: #hex;

$marapp-gray-0: #hex;

$marapp-gray-1: #hex;
$marapp-gray-2: #hex;
$marapp-gray-3: #hex;
$marapp-gray-4: #hex;
$marapp-gray-5: #hex;
$marapp-gray-6: #hex;
$marapp-gray-7: #hex;
$marapp-gray-8: #hex;
$marapp-gray-9: #hex;

$marapp-gray-100: #hex;
```
##### Fonts
Font files should be added in `src/fonts` (woff & woff2 files). Then you must declare a font-face inside `src/styles/fonts`.
Those fonts will then be declared as `$marapp-primary-font` and `$marapp-secondary-font`.

##### Primary color
This is the theme color. Some examples of usage: buttons, radio buttons, selected dropdown items.

##### The grays
In order to customize the look and feel of the app, we provide a set of variables that are used inside the scss files.
These can be overwritten by changing the variable value.

Some examples of usage of grays are:

- marapp-gray-0: dropdown link item color, list text color
- marapp-gray-1: app menu item color, page background
- marapp-gray-2: not used
- marapp-gray-3: not used
- marapp-gray-4: not used
- marapp-gray-5: dropdown items
- marapp-gray-6: selected dropdown intem background
- marapp-gray-7: list background
- marapp-gray-8: sidebar background
- marapp-gray-9:  not used
- marapp-gray-100: text color, heading color

#### Javascript variables

Theme Variables that are used trough out the application are stored in `theme.ts` in the src folder.
They enable developers to set up the app name, logo and basemaps, with the use of constants
(`APP_NAME`, `APP_LOGO` and `APP_BASEMAPS`);

#### Generating icons

Marapp uses a default icon font. If you want to customize the icons used, you need to add the icon set svgs in
`@marap/earth-shared` in the folder `src/icon-font/icons `and run the command `yarn build-icons`. This generates a compiled folder in icon-font/ with a icon-font.scss
stylesheet. Include that scss file in `index.scss` file and the app will use your custom icons
(`@import "~@marapp/earth-shared/src/icon-font/compiled/icon-font";`).
