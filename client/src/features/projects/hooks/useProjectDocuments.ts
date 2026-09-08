import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/libs';
import type { ApiError } from '@/types';
import type { ProjectDocument } from '@/features/projects/types/operations';

async function fetchProjectDocuments(projectId: number) {
  const { data } = await apiClient.get<ProjectDocument[]>(`/projects/${projectId}/documents/`);
  return data;
}

export const useProjectDocuments = (projectId: number) =>
  useQuery<ProjectDocument[], ApiError>({
    queryKey: ['projects', projectId, 'documents'],
    queryFn: () => fetchProjectDocuments(projectId),
    enabled: Number.isInteger(projectId),
  });