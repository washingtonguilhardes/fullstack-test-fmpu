'use client';

import { AxiosError } from 'axios';
import { useCallback, useMemo } from 'react';

import { useRouter } from 'next/navigation';

import { UserProfileEntity } from '@driveapp/contracts/entities/users/user.entity';
import { IHTTPClientErrorResponse } from '@driveapp/contracts/utils/http-clients';

import { parseErrorResponse } from '@/lib/http/parse-error-response';
import { restClient } from '@/lib/http/rest.client';
import { useQuery } from '@tanstack/react-query';

export function useAuth() {
  const router = useRouter();
  const {
    data: user,
    isLoading: loading,
    error: errorResponse,
    refetch
  } = useQuery({
    refetchInterval: 1000 * 60 * 5,
    queryKey: ['auth'],
    queryFn: () =>
      restClient.get<UserProfileEntity>('/account/whoami').then(res => res.data)
  });

  const error = useMemo(() => {
    if (errorResponse) {
      return parseErrorResponse(errorResponse as AxiosError<IHTTPClientErrorResponse>)
        .message;
    }
  }, [errorResponse]);

  const checkAuth = useCallback(async () => {
    try {
      await refetch();
    } catch (error) {
      router.push(`/login?redirect=${window.location.pathname}`);
    }
  }, [refetch]);

  const logout = useCallback(async () => {
    await restClient.post('/account/logout');
    checkAuth();
  }, [checkAuth]);

  return {
    user,
    loading,
    error,
    sync: refetch,
    checkAuth,
    logout,
    isAuthenticated: !!user
  };
}
