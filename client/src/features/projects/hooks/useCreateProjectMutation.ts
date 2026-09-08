import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/libs';
import type { ApiError } from '@/types';
import type { CreateProjectPayload, Project } from '@/features/projects/types';
import { projectsQueryKey } from './useProjects';

async function createProject(payload: CreateProjectPayload) {
  const { data } = await apiClient.post<Project>('/projects/', payload);
  return data;
}

export const useCreateProjectMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<Project, ApiError, CreateProjectPayload>({
    mutationFn: createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectsQueryKey });
    },
  });
};