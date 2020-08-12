/*
  Copyright 2018-2020 National Geographic Society

  Use of this software does not constitute endorsement by National Geographic
  Society (NGS). The NGS name and NGS logo may not be used for any purpose without
  written permission from NGS.

  Licensed under the Apache License, Version 2.0 (the "License"); you may not use
  this file except in compliance with the License. You may obtain a copy of the
  License at

      https://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed
  under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
  CONDITIONS OF ANY KIND, either express or implied. See the License for the
  specific language governing permissions and limitations under the License.
*/

import * as React from 'react';

import renderHTML from 'react-render-html';

import { DashboardProps } from '../model';
import { useState } from 'react';
import { ActionModal, LinkWithOrg } from 'components';
import { useAuth0 } from 'auth/auth0';
import { AuthzGuards } from 'auth/permissions';

export default function DashboardDetails(props: DashboardProps) {
  const {
    data: { id, slug, name, description, published, layers, widgets },
  } = props;
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { getPermissions } = useAuth0();

  const writePermissions = getPermissions(AuthzGuards.writeDashboardsGuard);

  const publishIcon = published ? 'check' : 'close';

  function handleDeleteToggle() {
    setShowDeleteModal(!showDeleteModal);
  }

  return (
    <div>
      {showDeleteModal && (
        <ActionModal
          id={id}
          navigateRoute={'dashboards'}
          name={name}
          toggleModal={handleDeleteToggle}
          visibility={showDeleteModal}
        />
      )}
      <div className="ng-flex ng-flex-space-between">
        <h2 className="ng-text-display-m ng-c-flex-grow-1">{name}</h2>
        <div className="ng-flex ng-align-center ng-flex-center ng-text-center ng-center">
          <span className="ng-padding-horizontal">
            Published
            <br />
            <i className={`ng-icon-${publishIcon}`}></i>
          </span>
        </div>
      </div>

      <div className="ng-padding-medium ng-background-ultradkgray ng-margin-medium-bottom">
        <h3 className="ng-text-display-s">Dashboard details</h3>
        <p>
          <span className="ng-text-weight-medium">Dashboard description:</span>
        </p>
        {description && <div className="ng-border-add ng-padding">{renderHTML(description)}</div>}

        <p>
          <span className="ng-text-weight-medium">Dashboard slug: </span>
          {slug || '-'}
        </p>
      </div>

      {layers && layers.length > 0 && (
        <div className="ng-padding-medium ng-background-ultradkgray ng-margin-medium-bottom">
          <span className="ng-text-weight-medium">Dashboard layers: </span>
          <div className="ng-flex ng-flex-wrap">
            {layers.map((layer) => (
              <LinkWithOrg
                to={`/layers/${layer.id}`}
                key={layer.id}
                className="ng-margin-medium-right"
              >
                {layer.name}
              </LinkWithOrg>
            ))}
          </div>
        </div>
      )}

      {widgets && widgets.length > 0 && (
        <div className="ng-padding-medium ng-background-ultradkgray ng-margin-medium-bottom">
          <span className="ng-text-weight-medium">Dashboard widgets: </span>
          <div className="ng-flex ng-flex-wrap">
            {widgets.map((widget) => (
              <LinkWithOrg
                to={`/widgets/${widget.id}`}
                key={widget.id}
                className="ng-margin-medium-right"
              >
                {widget.name}
              </LinkWithOrg>
            ))}
          </div>
        </div>
      )}

      <div className="ng-padding-medium ng-background-ultradkgray ng-margin-medium-bottom">
        {writePermissions && (
          <LinkWithOrg
            className="ng-button ng-button-primary ng-margin-medium-right"
            to={`/dashboards/${id}/edit`}
          >
            Edit dashboard
          </LinkWithOrg>
        )}
        <LinkWithOrg to="/dashboards" className="ng-button ng-button-secondary">
          Go back to dashboards list
        </LinkWithOrg>
      </div>
      {writePermissions && (
        <div className="ng-padding-medium ng-background-ultradkgray ng-text-right">
          <button className="ng-button ng-button-primary" onClick={handleDeleteToggle}>
            Delete dashboard
          </button>
        </div>
      )}
    </div>
  );
}
