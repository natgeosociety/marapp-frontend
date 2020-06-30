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
