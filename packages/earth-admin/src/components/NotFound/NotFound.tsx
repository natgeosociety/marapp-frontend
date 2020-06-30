import React from 'react';
import { Link } from 'gatsby';

import { useAuth0 } from 'auth/auth0';

export const NotFound = (props) => {
  const { groups } = useAuth0();

  return (
    <div className="ng-orgswitcher-page">
      <div>
        <h3>404 - Page not found</h3>
        {groups && (
          <>
            <h6>Please select a valid one:</h6>
            <ul>
              {groups.map(g => (
                <li><Link to={`/${g}`}>{g}</Link></li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  )
}