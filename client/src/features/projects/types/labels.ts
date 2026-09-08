import type { CustomerInterest, ProjectState, ProjectType } from './index';

export const projectTypeLabels: Record<ProjectType, string> = {
  GEOTERMALNI: 'Geotermální vrt',
  VRTANA_STUDNA: 'Vrtaná studna',
  OBOJI: 'Obojí',
};

export const projectStateLabels: Record<ProjectState, string> = {
  POPTAVKA: 'Poptávka',
  REALIZACE: 'Realizace',
  HYDRO_POSOUZENI: 'Hydro posouzení',
  PREDANO: 'Předáno',
};

export const customerInterestLabels: Record<CustomerInterest, string> = {
  CEKA_SE: 'Čeká se na rozhodnutí',
  MAM_ZAJEM: 'Mám zájem',
  NEMAM_ZAJEM: 'Nemám zájem',
};