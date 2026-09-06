import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/libs';
import { type RegisterPayload } from '@/features/auth/schemas';
import { type ApiError } from '@/types';
import type { RegisterResponse } from '@/features/auth/types';

const register = async (data: RegisterPayload) => {
  const response = await apiClient.post<RegisterResponse>('/users/', {
    email: data.email,
    password: data.password,
    confirm_password: data.confirmPassword,
    first_name: data.firstName,
    last_name: data.lastName,
  });

  return response.data;
};

export const useRegisterMutation = () => {
  return useMutation<RegisterResponse, ApiError, RegisterPayload>({
    mutationFn: register,
  });
};
