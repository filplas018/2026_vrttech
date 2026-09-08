import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/libs';
import type { ApiError } from '@/types';
import type { Project } from '@/features/projects/types';

export const projectsQueryKey = ['projects'] as const;

interface ProjectFilters {
  search?: string;
  orderType?: string;
}

async function fetchProjects(filters?: ProjectFilters) {
  const params = new URLSearchParams();
  
  if (filters?.search) {
    params.append('name__icontains', filters.search);
    //params.append('order_number__icontains', filters.search);
  }
  
  if (filters?.orderType) {
    params.append('order_type', filters.orderType);
  }

  const { data } = await apiClient.get<Project[]>(`/projects/?${params.toString()}`);
  return data;
}

export const useProjects = (filters?: ProjectFilters) =>
  useQuery<Project[], ApiError>({

    queryKey: [projectsQueryKey[0], filters],
    queryFn: () => fetchProjects(filters),
  });