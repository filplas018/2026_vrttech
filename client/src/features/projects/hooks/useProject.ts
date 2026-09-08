import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/libs';
import type { ApiError } from '@/types';
import type { Project } from '@/features/projects/types';

async function fetchProject(projectId: number) {
  const { data } = await apiClient.get<Project>(`/projects/${projectId}/`);
  return data;
}

export const useProject = (projectId: number) =>
  useQuery<Project, ApiError>({
    queryKey: ['projects', projectId],
    queryFn: () => fetchProject(projectId),
    enabled: Number.isInteger(projectId),
  });