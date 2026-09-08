import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/libs';
import type { ApiError } from '@/types';
import type { Gallery } from '../../../features/projects/types';

export const allGalleriesQueryKey = ['all-galleries'] as const;


async function fetchAllGalleries(projectId: string) {
  const { data } = await apiClient.get<Gallery[]>(`/projects/${projectId}/galleries/`);
  return data;
}

export const useAllGalleries = (projectId: string) =>
  useQuery<Gallery[], ApiError>({
    queryKey: [...allGalleriesQueryKey, projectId],
    queryFn: () => fetchAllGalleries(projectId),
  });