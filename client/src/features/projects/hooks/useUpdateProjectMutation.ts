import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/libs';
import type { ApiError } from '@/types';
import type { Project, UpdateProjectPayload } from '@/features/projects/types';
import { projectsQueryKey } from './useProjects';

interface UpdateProjectVariables {
  projectId: number;
  payload: UpdateProjectPayload;
}

async function updateProject({ projectId, payload }: UpdateProjectVariables) {
  const { data } = await apiClient.patch<Project>(`/projects/${projectId}/`, payload);
  return data;
}

export const useUpdateProjectMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<Project, ApiError, UpdateProjectVariables>({
    mutationFn: updateProject,
    onSuccess: (project) => {
      queryClient.setQueryData(['projects', project.id], project);
      queryClient.invalidateQueries({ queryKey: projectsQueryKey });
    },
  });
};