//podle modelu Order (order asi = projekt)

export type ProjectType = 'GEOTERMALNI' | 'VRTANA_STUDNA' | 'OBOJI';

export type ProjectStatus = 'POPTAVKA' | 'REALIZACE' | 'HYDRO_POSOUZENI' | 'PREDANO';

export type CustomerInterest = 'CEKA_SE' | 'MAM_ZAJEM' | 'NEMAM_ZAJEM';

export interface ProjectResponse {
  id: number;
  orderNumber: string;
  name: string;
  orderType: ProjectType;
  orderState: ProjectStatus;
  customerInterest: CustomerInterest;
  totalBudget: string;
  warrantyFrom: string | null;
  warrantyTo: string | null;
}