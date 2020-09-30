import React from 'react';

import { ErrorTemplate } from '@marapp/earth-shared';

import { LinkWithOrg } from '@app/components/link-with-org';

const NotFound = () => {
  return (
    <ErrorTemplate type="404" message="Sorry we couldn't find that page.">
      <ul className="not-found--links--list">
        <li>
          <LinkWithOrg to="/" className="-light -fullwidth c-button marapp-qa-actionreturn">
            Home
          </LinkWithOrg>
        </li>
      </ul>
    </ErrorTemplate>
  );
};

export default NotFound;
