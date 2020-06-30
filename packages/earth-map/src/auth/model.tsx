export interface Auth0 {
  domain?: any;
  isAuthenticated?: boolean;
  isAuthorized?: boolean;
  isLoading?: boolean;
  email?: string;
  userData?: User;
  // TODO: rename this to selectedGroups
  selectedGroup?: string[];
  groups?: string[];
  roles?: { [key: string]: any };
  permissions?: { [key: string]: any };
  logout?(o?): void;
  login?(o?): void;
  getUser?(o?): void;
  getToken?(o?): void;
  setupUserOrg?(org: string): void;
}

export interface User {
  name?: string;
  picture?: string;
  allGroups?: string[];
}
