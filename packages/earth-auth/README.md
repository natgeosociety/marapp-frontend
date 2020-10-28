# Earth Auth

Custom screens for auth0

## Setup

Available commands:

| Command                   | Description                    |
| ------------------------- | ------------------------------ |
| yarn start                | Start development server.      |
| yarn build                | Compile TypeScript resources.  |

## Running

Create a local `.env` and `.env.local` file based on [.env.sample](.env.sample), add the required configuration for the environment. 

The following environment variables are required by the application.

| **Key** | **Description** |
| ------------- |:----------------|
| `NODE_ENV` | Node.js environment (e.g. `development`, `production`) |
| `APP_TERMS_OF_SERVICE` | the link for terms of service |
| `APP_PRIVACY_POLICY` | the link for privacy policy |
| `APP_ATOB` | the encoded data from auth0 |

APP_ATOB is specified from auth0. When developing locally, you can specify an atob in the env config, so that you can run the screens locally. 

