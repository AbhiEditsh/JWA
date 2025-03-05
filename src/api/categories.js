import useSWR from 'swr';
import { useMemo } from 'react';

import { fetcher } from '../utils/axios';

export function useGetCategoriesList() {
  const URL = `${import.meta.env.VITE_AUTH_API}/api/admin/categories`;

  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher);
  console.log(data);

  const memoizedValue = useMemo(
    () => ({
      categories: data || [],
      categoriesLoading: isLoading,
      categoriesError: error,
      categoriesValidating: isValidating,
      categoriesEmpty: !isLoading && !data?.length,
      mutate
    }),
    [data, error, isLoading, isValidating,mutate]
  );

  return memoizedValue;
}
