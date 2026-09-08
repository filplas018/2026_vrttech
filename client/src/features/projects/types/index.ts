export type ProjectType = 'GEOTERMALNI' | 'VRTANA_STUDNA' | 'OBOJI';
export type ProjectState = 'POPTAVKA' | 'REALIZACE' | 'HYDRO_POSOUZENI' | 'PREDANO';
export type CustomerInterest = 'CEKA_SE' | 'MAM_ZAJEM' | 'NEMAM_ZAJEM';

export interface Project {
  id: number;
  orderNumber: string;
  name: string;
  orderType: ProjectType;
  orderState: ProjectState;
  customerInterest: CustomerInterest;
  totalBudget: string | null;
  warrantyFrom: string | null;
  warrantyTo: string | null;
}

export interface DrillingRig {
  id: number;
  name: string;
  registration: string;
 
}



export interface Contact {
  id: number;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  company: string | null;
  
}
export interface Gallery {
  id: number;
  name: string;
  photos: GalleryPhoto[];
}

export interface GalleryPhoto {
  id: number;
  image: string;
  latitude: string | null;
  longitude: string | null;
  uploadedAt: string;
  gallery: number;
}

export interface CreateProjectPayload {
  orderNumber: string;
  name: string;
  orderType: ProjectType;
  orderState?: ProjectState;
  customerInterest?: CustomerInterest;
  totalBudget?: string;
}

export type UpdateProjectPayload = Partial<
  Pick<
    Project,
    | 'orderNumber'
    | 'name'
    | 'orderType'
    | 'orderState'
    | 'customerInterest'
    | 'totalBudget'
    | 'warrantyFrom'
    | 'warrantyTo'
  >
>;