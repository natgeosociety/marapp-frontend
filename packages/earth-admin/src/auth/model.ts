export interface Auth0 {
  isAuthenticated?: boolean;
  isAuthorized?: boolean;
  isLoading?: boolean;
  groups?: string[];
  roles?: { [key: string]: any };
  permissions?: { [key: string]: any };
  selectedGroup?: string;
  logout?(o?: LogoutOptions): void;
  login?(o?: BaseLoginOptions): void;
  getUser?(o?: GetUserOptions): void;
  getToken?(o?: GetTokenWithPopupOptions): void;
  setupUserOrg?(o?: string): void;
  setIsLoading(boolean): void;
  getPermissions?(type: string[]): boolean;
}
