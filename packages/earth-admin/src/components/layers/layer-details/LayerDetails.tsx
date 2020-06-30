import * as React from 'react';
import { useEffect, useState } from 'react';

import { formatDate, hasAccess } from 'utils';

import renderHTML from 'react-render-html';

import { LayerProps } from '../model';

import { JsonEditor } from 'components/json-editor';
import { ActionModal } from 'components/action-modal';
import { LinkWithOrg } from 'components/LinkWithOrg';
import { useAuth0 } from 'auth/auth0';
import { AuthzGuards } from 'auth/permissions';

export default function LayerDetails(props: LayerProps) {
  const {
    data: {
      id,
      name,
      description,
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

  const { getPermissions } = useAuth0();

  const writePermissions = getPermissions(AuthzGuards.writeLayersGuard);

  useEffect(() => {
    setLayerConfig(config);
  }, [config]);

  const publishIcon = published ? 'check' : 'close';

  function handleDeleteToggle() {
    setShowDeleteModal(!showDeleteModal);
  }

  return (
    <div>
      {showDeleteModal && (
        <ActionModal
          id={id}
          navigateRoute={'layers'}
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

      <div className="ng-padding-medium ng-background-white ng-margin-medium-bottom">
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
            <JsonEditor json={layerConfig} readOnly={true} />
          </div>
        )}
      </div>

      {references && references.length > 0 && (
        <div className="ng-padding-medium ng-background-white ng-margin-medium-bottom">
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

      <div className="ng-padding-medium ng-background-white ng-margin-medium-bottom">
        {writePermissions && (
          <LinkWithOrg
            to={`/layers/${id}/edit`}
            className="ng-button ng-button-primary ng-margin-medium-right"
          >
            Edit Layer
          </LinkWithOrg>
        )}
        <LinkWithOrg to="/layers" className="ng-button">
          Go back to layers list
        </LinkWithOrg>
      </div>
      {writePermissions && (
        <div className="ng-padding-medium ng-background-white ng-text-right">
          <button className="ng-button ng-button-primary" onClick={handleDeleteToggle}>
            Delete layer
          </button>
        </div>
      )}
    </div>
  );
}
