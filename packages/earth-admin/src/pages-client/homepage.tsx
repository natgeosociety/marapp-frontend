import * as React from 'react';
import { useEffect } from 'react';
import { navigate } from 'gatsby';

import { useAuth0 } from 'auth/auth0';

/**
 * Just redirect to the default selectedGroup. (set in auth0.tsx)
 */
const Homepage = () => {
  const { selectedGroup } = useAuth0();
  useEffect(() => {
    selectedGroup && navigate(`/${selectedGroup}`, { replace: true });
  }, [selectedGroup]);
  return <div>This is homepage - should be redirected to /:org</div>
}

export default Homepage;