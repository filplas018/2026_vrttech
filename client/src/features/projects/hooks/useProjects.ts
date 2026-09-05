
import { useQuery } from '@tanstack/react-query';
import type { ProjectResponse } from '@/features/projects/types';
import type { ApiError } from '@/types';

//fake data
const MOCK_PROJECTS: ProjectResponse[] = [
  {
    id: 1,
    orderNumber: 'Z2026-001',
    name: 'Geotermální vrt - Novák',
    orderType: 'GEOTERMALNI',
    orderState: 'REALIZACE',
    customerInterest: 'MAM_ZAJEM',
    totalBudget: '450000.00',
    warrantyFrom: null,
    warrantyTo: null,
  },
  {
    id: 2,
    orderNumber: 'Z2026-002',
    name: 'Vrtaná studna - Dvořák',
    orderType: 'VRTANA_STUDNA',
    orderState: 'POPTAVKA',
    customerInterest: 'CEKA_SE',
    totalBudget: '180000.00',
    warrantyFrom: null,
    warrantyTo: null,
  },
  {
    id: 3,
    orderNumber: 'Z2026-003',
    name: 'Geotermální vrt i studna - Svoboda',
    orderType: 'OBOJI',
    orderState: 'PREDANO',
    customerInterest: 'MAM_ZAJEM',
    totalBudget: '620000.00',
    warrantyFrom: '2026-01-15',
    warrantyTo: '2028-01-15',
  },
];

async function fetchProjects(): Promise<ProjectResponse[]> {
  // asi pro real data
  // const { data } = await apiClient.get('/projects/');
  // return data;

  // Dočasné umělé zpoždění, ať se dá reálně otestovat loading stav
  await new Promise((resolve) => setTimeout(resolve, 300));
  return MOCK_PROJECTS;
}

export const useProjects = () => {
  return useQuery<ProjectResponse[], ApiError>({
    queryKey: ['projects'],
    queryFn: fetchProjects,
  });
};