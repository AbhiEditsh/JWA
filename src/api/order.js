import useSWR from 'swr';
import { useMemo } from 'react';

import { fetcher } from '../utils/axios';

export function useGetOrder() {
  const URL = `${import.meta.env.VITE_AUTH_API}/api/admin/orders`;
  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher);
  console.log('🤗', data);

  const memoizedValue = useMemo(
    () => ({
      order: data?.products || [],
      orderLoading: isLoading,
      orderError: error,
      orderValidating: isValidating,
      // orderEmpty: !isLoading && !data.products?.length,
      mutate,
    }),
    [data, isLoading, error, isValidating, mutate]
  );

  return memoizedValue;
}
