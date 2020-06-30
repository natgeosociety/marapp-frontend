import * as React from 'react';
import { useEffect } from 'react';
import { Link } from 'gatsby';
import { JSHINT } from 'jshint';

import { Spinner } from '@marapp/earth-components';
import { isValidOrg } from 'utils';
import { useAuth0 } from 'auth/auth0';

import './styles.scss';

interface IProps {
  org: string;
  children: any
}

const Organization = (props: IProps) => {
  const { org, children } = props;
  const {
    isLoading,
    groups,
    setupUserOrg,
    setIsLoading,
  } = useAuth0();

  // CodeMirror is not working without window.JSHINT
  useEffect(() => {
    // @ts-ignore
    window.JSHINT = JSHINT;
  });

  // Important check for valid ORG and sets it on the context.
  // Happens everytime org changes (runtime/refresh)
  if (org && isValidOrg(groups, org)) {
    setupUserOrg(org);
    setIsLoading(false);
  } else {
    return <OrgSwitcherPage groups={groups} />
  }

  if (isLoading) return <Spinner size="medium" />

  return children;
}

const OrgSwitcherPage = ({ groups }) => (
  <div className="ng-orgswitcher-page">
    <div>
      <h3>Invalid Organization</h3>
      <h6>Please select a valid one:</h6>
      <ul>
        {groups.map(g => (
          <li><Link to={`/${g}`}>{g}</Link></li>
        ))}
      </ul>
    </div>
  </div>
)

export default Organization;