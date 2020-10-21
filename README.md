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
yarn install && yarn bootstrap
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

## Unit Testing
Our goal with unit testing is to get the most value out of them with the minimum ammount of effort. To achieve this, we should have this things in mind:

* The more our tests resemble the way the software is used, the more confidence they can give us.
* Avoid testing the implementation details. We use [Testing Library](https://testing-library.com/) instead of Enzyme because of this. See this [blog post](https://kentcdodds.com/blog/testing-implementation-details).
* Find the most critical parts of the application and start creating unit tests there

### Testing workflow
For unit testing we use [Jest](https://jestjs.io/en/) and [Testing Library](https://testing-library.com/).

As a developer, you should always have the unit tests running in the background by running  `yarn test` in thre root of the project. This will run only the tests that have changes on them, or contain imports that have changes on them.

There is also `yarn test-coverage` which will run all the available unit tests and provide code coverage statistics.

### FAQ
* What selectors should I use to get DOM nodes in the tests? => [see this](https://testing-library.com/docs/guide-which-query)

## Docs
- [earth-map](packages/earth-map/README.md)
- [earth-admin](packages/earth-admin/README.md)
