import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/libs';
import type { ApiError } from '@/types';
import type { WellWorkflowStep } from '@/features/projects/types/operations';

async function fetchWellWorkflow(projectId: number) {
  const { data } = await apiClient.get<WellWorkflowStep[]>(`/projects/${projectId}/well-workflow/`);
  return data;
}

export const useWellWorkflow = (projectId: number) =>
  useQuery<WellWorkflowStep[], ApiError>({
    queryKey: ['projects', projectId, 'well-workflow'],
    queryFn: () => fetchWellWorkflow(projectId),
    enabled: Number.isInteger(projectId),
  });