import useSWR from 'swr';
import { useMemo } from 'react';

import { fetcher } from '../utils/axios';

export function useGetProducts() {
  const URL = `${import.meta.env.VITE_AUTH_API}/api/product`;
  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher);
  const memoizedValue = useMemo(
    () => ({
      products: data?.products|| [],
      productsLoading: isLoading,
      productsError: error,
      productsValidating: isValidating,
      productsEmpty: !isLoading && !data.products,
      mutate,
    }),
    [data, isLoading, error, isValidating, mutate]
  );

  return memoizedValue;
}
export function useGetCategoriesList(id) {
  const URL = `${import.meta.env.VITE_AUTH_API}/api/admin/categories`;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);
  const memoizedValue = useMemo(
    () => ({
      categories: data || [],
      categoriesLoading: isLoading,
      categoriesError: error,
      categoriesValidating: isValidating,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}
