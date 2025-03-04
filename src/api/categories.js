import useSWR from 'swr';
import { useMemo } from 'react';

import { fetcher } from '../utils/axios';


export function useGetCategoriesList() {
  const URL = `${import.meta.env.VITE_AUTH_API}/api/admin/categories`;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);
  const memoizedValue = useMemo(
    () => ({
      categories: data || [],
      categoriesLoading: isLoading,
      categoriesError: error,
      categoriesValidating: isValidating,
      categoriesEmpty: !isLoading && !data?.length,             
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}
