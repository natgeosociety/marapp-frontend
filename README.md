# marapp-frontend

Marapp frontend applications.

## Setup

Available commands:

| Command                | Description                                             |
| ---------------------- | ------------------------------------------------------- |
| yarn install           | Install dependencies.                                   |
| yarn bootstrap         | Bootstrap the dependencies.                             |
| yarn start             | Start the applications in development mode.             |
| yarn build             | Build the applications for production.                  |
| yarn test              | Run all tests.                                          |
| yarn serverless:deploy | Run this command to build and deploy the applications.  |

NOTE: You can use the `--scope` parameter on the above commands to specify a single application.
```
yarn start --scope @marapp/earth-map
```

Initialize the dependencies and link any cross-dependencies between the modules.

```
yarn bootstrap
```

Bootstrap the packages in the current Lerna repo. Installs all of their dependencies and links any cross-dependencies.

## Running

The required environment variables, for each package module, are described in [.env.sample](.env.sample) within the package directory.

Start all applications.
```
yarn start
```

Start a single application.
```
yarn start --scope @marapp/earth-map
```

Build all applications.
```
yarn build
```

## Deployment

Create & deploy all required services. 

You will need an AWS access key ID and secret pair stored in `~/.aws/credentials`.

Alternatively, you can authenticate via the `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` environment variables.

You will need to have access to the following AWS services:
- CloudFormation

```shell script
yarn serverless:deploy -- --stage <env>
```

## Docs
- [earth-map](packages/earth-map/README.md)
- [earth-admin](packages/earth-admin/README.md)
