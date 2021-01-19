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

import queryStringEncode from 'query-string-encode';
import React from 'react';
import { BaseAPIService, metaDeserializer } from 'services/base/APIBase';
import useSWR from 'swr';

export { FeaturedPlacesComponent as default } from './component';

// export default function WithData(props) {
//   const { group } = props;

//   const cacheKey = `/locations?${queryStringEncode({
//     select: 'slug,name,id,organization,type',
//     page: { size: 100 },
//     filter: 'featured==true',
//     sort: 'name',
//     group: group.toString(),
//   })}`;

//   const { data } = useSWR(cacheKey, (url) =>
//     BaseAPIService.requestSWR(url, undefined, metaDeserializer)
//   );

//   const componentProps = {
//     ...props,
//     data: data?.data,
//     meta: data?.meta,
//   };

//   return <FeaturedPlacesComponent {...componentProps} />;
// }
