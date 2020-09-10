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
import { useState } from 'react';
import renderHTML from 'react-render-html';

import { formatDate } from 'utils';

import { WidgetProps } from '../model';
import { ActionModal } from 'components/action-modal';
import { JsonEditor } from 'components/json-editor';
import { LinkWithOrg } from 'components/link-with-org';
import { useAuth0 } from 'auth/auth0';
import { AuthzGuards } from 'auth/permissions';

export default function WidgetDetails(props: WidgetProps) {
  const {
    data: {id, name, createdAt, updatedAt, published, description, slug, config, metrics, layers},
  } = props;
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const {getPermissions} = useAuth0();

  const writePermissions = getPermissions(AuthzGuards.writeDashboardsGuard);

  const publishIcon = published ? 'check' : 'close';

  function handleDeleteToggle() {
    setShowDeleteModal(!showDeleteModal);
  }

  return (
    <div className="marapp-qa-widgetdetails">
      {showDeleteModal && (
        <ActionModal
          id={id}
          navigateRoute={'widgets'}
          name={name}
          type="widget"
          toggleModal={handleDeleteToggle}
          visibility={showDeleteModal}
        />
      )}
      <div className="ng-flex ng-flex-space-between">
        <h2 className="ng-text-display-m ng-c-flex-grow-1">{name}</h2>
        <div className="ng-flex ng-align-center ng-flex-center ng-text-center ng-center">
          <span className="ng-padding-horizontal">
            Published
            <br/>
            <i className={`ng-icon-${publishIcon}`}></i>
          </span>
        </div>
      </div>

      <div className="ng-padding-medium ng-background-ultradkgray ng-margin-medium-bottom">
        <h3 className="ng-text-display-s">Widget details</h3>

        <p>
          <span className="ng-text-weight-medium">Created at: </span>
          {formatDate(createdAt)}
        </p>

        <p>
          <span className="ng-text-weight-medium">Last updated at: </span>
          {formatDate(updatedAt)}
        </p>

        <p>
          <span className="ng-text-weight-medium">Description:</span>
        </p>
        {description && <div className="ng-border-add ng-padding">{renderHTML(description)}</div>}

        <p>
          <span className="ng-text-weight-medium">Slug: </span>
          {slug || '-'}
        </p>

        {!!config && <JsonEditor json={config} readOnly={true}/>}

        <p>
          <span className="ng-text-weight-medium">Metric slug: </span>
          {(!!metrics && metrics.length > 0 && metrics[0]) || '-'}
        </p>
      </div>

      {layers && layers.length > 0 && (
        <div className="ng-padding-medium ng-background-ultradkgray ng-margin-medium-bottom">
          <span className="ng-text-weight-medium">Layers: </span>
          <div className="ng-flex ng-flex-wrap">
            {layers.map((layer, index) => (
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

      <div className="ng-padding-medium ng-background-ultradkgray ng-margin-medium-bottom">
        {writePermissions && (
          <LinkWithOrg
            to={`/widgets/${id}/edit`}
            className="marapp-qa-actionedit ng-button ng-button-primary ng-margin-medium-right"
          >
            Edit widget
          </LinkWithOrg>
        )}
        <LinkWithOrg className="marapp-qa-actionback ng-button ng-button-secondary" to="/widgets">
          Go back to widgets list
        </LinkWithOrg>
      </div>
      {writePermissions && (
        <div className="ng-padding-medium ng-background-ultradkgray ng-text-right">
          <button className="marapp-qa-actiondelete ng-button ng-button-primary" onClick={handleDeleteToggle}>
            Delete widget
          </button>
        </div>
      )}
    </div>
  );
}
