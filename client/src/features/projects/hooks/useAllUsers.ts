import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/libs';
import type { ApiError } from '@/types';
import type { UserProfileResponse } from '../../../features/users/types';

export const allUsersQueryKey = ['all-users'] as const;

async function fetchAllUsers() {
  const { data } = await apiClient.get<UserProfileResponse[]>('/all-users/');
  return data;
}

export const useAllUsers = () =>
  useQuery<UserProfileResponse[], ApiError>({
    queryKey: allUsersQueryKey,
    queryFn: fetchAllUsers,
  });