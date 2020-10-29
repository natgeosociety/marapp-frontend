export const AuthEnv = {
  terms: process.env.APP_TERMS_OF_SERVICE,
  privacy: process.env.APP_PRIVACY_POLICY,
  atob: process.env.APP_ATOB ? process.env.APP_ATOB : '@@config@@',
};
