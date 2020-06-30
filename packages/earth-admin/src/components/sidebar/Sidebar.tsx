import React from 'react';
import { Auth0Context } from 'utils/contexts';
import './styles.scss';

import { OrgSwitcher } from 'components/org-switcher';

import { APP_LOGO, APP_NAME } from '../../theme';

interface AdminPage {
  key: string;
  url: string;
  guard?: any;
}

import { AuthzGuards } from 'auth/permissions';
import { SidebarItem } from './sidebar-item';
import { LinkWithOrg } from 'components/LinkWithOrg';

const ADMIN_PAGES: AdminPage[] = [
  { key: 'Locations', url: '/locations/', guard: AuthzGuards.accessLocationsGuard },
  { key: 'Widgets', url: '/widgets/', guard: AuthzGuards.accessWidgetsGuard },
  { key: 'Layers', url: '/layers/', guard: AuthzGuards.accessLayersGuard },
  { key: 'Dashboards', url: '/dashboards/', guard: AuthzGuards.accessDashboardsGuard },
  { key: 'Users', url: '/users/', guard: AuthzGuards.accessUsersGuard },
];

export default function Sidebar() {
  return (
    <div className="ng-sidebar ng-flex ng-flex-column ng-flex-space-between ng-flex-top">
      <nav className="ng-padding-medium-vertical">
        <div
          className="ng-padding-medium-horizontal ng-ep-background-dark
        ng-margin-bottom
        ng-flex ng-flex-middle ng-position-relative"
        >
          <img src={APP_LOGO} alt={APP_NAME} className="ng-margin-remove ng-display-block" />
          <span className="ng-margin-small-horizontal ng-color-white">|</span>
          <OrgSwitcher />
        </div>
        <LinkWithOrg
          to="/"
          state={{ refresh: true }}
          className="ng-side-menu-item ng-text-display-s ng-padding-vertical ng-padding-medium-horizontal"
        >
          Home
        </LinkWithOrg>
        {ADMIN_PAGES.map((page, i) => (
          <SidebarItem item={page} key={i} />
        ))}
      </nav>
      <Auth0Context.Consumer>
        {({ logout }) => (
          <div className="ng-padding-medium">
            <button className="ng-button ng-button-blank" onClick={() => logout()}>
              <i className="ng-icon-user ng-icon-large ng-color-ltgray ng-display-block"></i>
              <span className="ng-color-ltgray ng-display-block">LOG OUT</span>
            </button>
          </div>
        )}
      </Auth0Context.Consumer>
    </div>
  );
}
