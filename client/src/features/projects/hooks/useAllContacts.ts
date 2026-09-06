import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/libs';
import type { ApiError } from '@/types';
import type { Contact } from '../../../features/projects/types';

export const allContactsQueryKey = ['all-contacts'] as const;

async function fetchAllContacts() {
  const { data } = await apiClient.get<Contact[]>('/all-contacts/');
  return data;
}

export const useAllContacts = () =>
  useQuery<Contact[], ApiError>({
    queryKey: allContactsQueryKey,
    queryFn: fetchAllContacts,
  });