import { AuthzGuards } from 'auth/permissions';

export const ADMIN_PAGES: AdminPage[] = [
  { key: 'Locations', url: '/locations/', guard: AuthzGuards.accessLocationsGuard },
  { key: 'Widgets', url: '/widgets/', guard: AuthzGuards.accessWidgetsGuard },
  { key: 'Layers', url: '/layers/', guard: AuthzGuards.accessLayersGuard },
  { key: 'Dashboards', url: '/dashboards/', guard: AuthzGuards.accessDashboardsGuard },
  { key: 'Users', url: '/users/', guard: AuthzGuards.accessUsersGuard },
  { key: 'Organizations', url: '/organizations/', guard: AuthzGuards.accessOrganizationsGuard },
];

interface AdminPage {
  key: string;
  url: string;
  guard?: any;
}
