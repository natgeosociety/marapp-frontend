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
import { useEffect, useState } from 'react';

import { formatDate, hasAccess } from 'utils';

import renderHTML from 'react-render-html';

import { LayerProps } from '../model';

import { JsonEditor } from 'components/json-editor';
import { ActionModal } from 'components/action-modal';
import { LinkWithOrg } from 'components/link-with-org';
import { useAuth0 } from 'auth/auth0';
import { AuthzGuards } from 'auth/permissions';

export default function LayerDetails(props: LayerProps) {
  const {
    data: {
      id,
      name,
      description,
      primary,
      published,
      version,
      createdAt,
      updatedAt,
      slug,
      type,
      provider,
      category,
      config,
      references,
    },
  } = props;
  const [layerConfig, setLayerConfig] = useState();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const {getPermissions} = useAuth0();

  const writePermissions = getPermissions(AuthzGuards.writeLayersGuard);

  useEffect(() => {
    setLayerConfig(config);
  }, [config]);

  const publishIcon = published ? 'check' : 'close';
  const primaryIcon = primary ? 'check' : 'close';

  function handleDeleteToggle() {
    setShowDeleteModal(!showDeleteModal);
  }

  return (
    <div className="marapp-qa-layerdetails">
      {showDeleteModal && (
        <ActionModal
          id={id}
          navigateRoute={'layers'}
          type="layer"
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
            <br/>
            <i className={`ng-icon-${publishIcon}`}></i>
          </span>
          <span className="ng-padding-horizontal">
            Primary
            <br/>
            <i className={`ng-icon-${primaryIcon}`}></i>
          </span>
        </div>
      </div>

      <div className="ng-padding-medium ng-background-ultradkgray ng-margin-medium-bottom">
        <h3 className="ng-text-display-s">
          Layer details for {name} version{version}
        </h3>

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

        <p>
          <span className="ng-text-weight-medium">Type: </span>
          {type || '-'}
        </p>

        <p>
          <span className="ng-text-weight-medium">Provider: </span>
          {provider || '-'}
        </p>

        <p>
          <span className="ng-text-weight-medium">Category: </span>
          {!!category && category.map((c, i) => <span key={i}>{c},</span>)}
        </p>

        {!!layerConfig && (
          <div>
            <p>
              <span className="ng-text-weight-medium">Layer config: </span>
            </p>
            <JsonEditor json={layerConfig} readOnly={true}/>
          </div>
        )}
      </div>

      {references && references.length > 0 && (
        <div className="ng-padding-medium ng-background-ultradkgray ng-margin-medium-bottom">
          <span className="ng-text-weight-medium">Included layers: </span>
          <div className="ng-flex ng-flex-wrap">
            {references.map((layer, index) => (
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
            to={`/layers/${id}/edit`}
            className="marapp-qa-actionlink ng-button ng-button-primary ng-margin-medium-right"
          >
            Edit Layer
          </LinkWithOrg>
        )}
        <LinkWithOrg to="/layers" className="marapp-qa-actionback ng-button ng-button-secondary">
          Go back to layers list
        </LinkWithOrg>
      </div>
      {writePermissions && (
        <div className="ng-padding-medium ng-background-ultradkgray ng-text-right">
          <button className="marapp-qa-actiondelete ng-button ng-button-primary" onClick={handleDeleteToggle}>
            Delete layer
          </button>
        </div>
      )}
    </div>
  );
}
