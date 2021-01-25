export const AuthEnv = {
  terms: process.env.APP_TERMS_OF_SERVICE,
  privacy: process.env.APP_PRIVACY_POLICY,
  apiUrl: process.env.APP_API_URL,
  atob: process.env.APP_ATOB ? process.env.APP_ATOB : '@@config@@',
};
