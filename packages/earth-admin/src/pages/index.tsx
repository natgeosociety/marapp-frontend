import * as React from 'react';
import { Router } from '@reach/router';

import { GATSBY_APP_BASE_URL } from 'config';
import Layout from 'layouts';
import LocationsPage from 'pages-client/locations';
import DashboardsPage from 'pages-client/dashboards';
import LayersPage from 'pages-client/layers';
import WidgetsPage from 'pages-client/widgets';
import UsersPage from 'pages-client/users';
import Organization from 'pages-client/organization';
import Homepage from 'pages-client/homepage';
import UnauthorizedPage from 'pages-client/unauthorized';
import { ProtectedRoute } from 'components/ProtectedRoute';
import { APP_NAME } from '../theme';

/**
 * All admin pages are client side pages only because the /:org makes them dinamic
 */
export default function IndexPage() {
  return (
    <Router basepath={GATSBY_APP_BASE_URL}>
      <ProtectedRoute path="/" component={Homepage} />
      <ProtectedRoute path="/:org" component={Organization}>
        <OrgIndex path="/" />
        <LocationsPage path="/locations/*" />
        <DashboardsPage path="/dashboards/*" />
        <LayersPage path="/layers/*" />
        <WidgetsPage path="/widgets/*" />
        <UsersPage path="/users/*" />
      </ProtectedRoute>
      <UnauthorizedPage path="/unauthorized" />
    </Router>
  );
}

/**
 * Renders no children
 */
const OrgIndex = (props) => (
  <Layout permission={true}>
    <div className="ng-background-white ng-padding-large">
      <h2 className="ng-text-edit-m">Welcome to the {APP_NAME} Admin!</h2>
      <h6>{props.org}</h6>
    </div>
  </Layout>
);
