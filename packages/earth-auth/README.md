# Earth Auth

Custom screens for Auth0 login/sign-up and password reset flows.

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
| `APP_NAME` | app name |
| `APP_API_URL` | url to backend service |
| `APP_ATOB` | the encoded data from auth0 |

APP_ATOB is specified from auth0. When developing locally, you can specify an atob in the env config, so that you can run the screens locally. 

Due to the file size of the generated html being to high, all external dependencies are linked with script tags in the html head.

In order to develop on the password reset screens, you need to setup some values for the Auth0ChangePassword instace (copy values from auth0).

```javascript
new Auth0ChangePassword({
	container: 'change-password-widget-container', // required
	email: "someone@example.com",                  // DO NOT CHANGE THIS
	csrf_token: "FAKE_MANAGE_CSRF_TOKEN",          // DO NOT CHANGE THIS
	ticket: "FAKE_MANAGE_CSRF_TOKEN",              // DO NOT CHANGE THIS
	password_policy: "good",                       // DO NOT CHANGE THIS
	password_complexity_options: {
		'minLength': 8
	},                                             // DO NOT CHANGE THIS
	theme: {
		icon: '<PLACEHOLDER_PICTURE_URL>',
		primaryColor: '#0099a1'
	},
	dict: {
		passwordPlaceholder: 'enter password',
		passwordConfirmationPlaceholder: 're-enter password',
		successMessage: 'You have successfully changed your password. You may now sign in with your new password.',
		headerText: 'Create new password',
		title: 'Change Password',
	},
});
````
 
