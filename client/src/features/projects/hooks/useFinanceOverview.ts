import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/libs';
import type { ApiError } from '@/types';
import type { FinanceOverview } from '@/features/projects/types/operations';

async function fetchFinanceOverview(projectId: number) {
  const { data } = await apiClient.get<FinanceOverview>(`/projects/${projectId}/finance-overview/`);
  return data;
}

export const useFinanceOverview = (projectId: number) =>
  useQuery<FinanceOverview, ApiError>({
    queryKey: ['projects', projectId, 'finance-overview'],
    queryFn: () => fetchFinanceOverview(projectId),
    enabled: Number.isInteger(projectId),
  });