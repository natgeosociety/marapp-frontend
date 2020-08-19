import * as React from 'react';

import { useAuth0 } from 'auth/auth0';
import { AuthzGuards } from 'auth/permissions';
import { useRequest } from 'utils/hooks';
import { encodeQueryToURL } from 'utils';
import { getPlace } from 'services/places';

import { PlaceEdit } from 'components';
import { ContentLayout } from 'layouts';

const PLACE_DETAIL_QUERY = {
  include: 'metrics,intersections',
  select: 'intersections.id,intersections.name,intersections.type,-metrics.metric',
  sort: 'intersections.name,metrics.slug,-metrics.version',
};

export default  function EditPage(path: any) {
  const { selectedGroup } = useAuth0();
  const encodedQuery = encodeQueryToURL(`locations/${path.page}`, {
    ...PLACE_DETAIL_QUERY,
    ...{ group: selectedGroup },
  });
  const { isLoading, errors, data } = useRequest(() => getPlace(encodedQuery), {
    permissions: AuthzGuards.writePlacesGuard,
    skip: path.newPlace,
  });

  return (

    <ContentLayout errors={errors} backTo="/places" isLoading={isLoading}>
      <PlaceEdit data={data} newPlace={path.newPlace} />
    </ContentLayout>
  );
}