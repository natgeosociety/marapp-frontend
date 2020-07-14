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

import { useState, useEffect } from 'react';

import { ScopesEnum } from 'auth/permissions';
import { useAuth0 } from 'auth/auth0';

interface IError {
  details: string;
  message: string;
}

interface IUseRequestReturn {
  isLoading: boolean;
  errors: IError[];
  data: any;
}

interface IUseRequestOptions {
  permissions: ScopesEnum[][];
  query?: string;
  skip?: boolean;
}

export function useRequest(
  resource: () => Promise<any>,
  options: IUseRequestOptions
): IUseRequestReturn {
  const { permissions, skip, query } = options;
  const [isLoading, setIsLoading] = useState(!skip);
  const [errors, setErrors] = useState<IError[]>([]);
  const [data, setData] = useState({});
  const { getPermissions } = useAuth0();

  useEffect(() => {
    const hasPermissions = getPermissions(permissions);
    async function fetchResource() {
      try {
        const res = await resource();
        setData(res.data);
        setIsLoading(false);
      } catch ({ data }) {
        setErrors(data.errors);
        setIsLoading(false);
      }
    }

    if (!hasPermissions) {
      setErrors([
        {
          message: `Unauthorized`,
          details: `Unauthorized`,
        },
      ]);
      return;
    }
    if (skip) {
      return;
    }

    fetchResource();
  }, [query]);

  return {
    isLoading,
    errors,
    data,
  };
}
