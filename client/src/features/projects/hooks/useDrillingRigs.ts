import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/libs';
import type { ApiError } from '@/types';
import type { DrillingRig } from '../../../features/projects/types';

export const drillingRigsQueryKey = ['all-drilling-rigs'] as const;

async function fetchAllDrillingRigs() {
  const { data } = await apiClient.get<DrillingRig[]>('/drilling-rigs/');
  return data;
}

export const useAllDrillingRigs = () =>
  useQuery<DrillingRig[], ApiError>({
    queryKey: drillingRigsQueryKey,
    queryFn: fetchAllDrillingRigs,
  });