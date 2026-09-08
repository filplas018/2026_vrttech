export type WorkflowStatus = 'NEZAHAJENO' | 'PROBIHA' | 'SPLNENO';

export interface WellWorkflowStep {
  id: number;
  project: number;
  step_number: number;
  status: WorkflowStatus;
  hydrogeologist: number | null;
  completed_at: string | null;
}

export interface FinanceOverview {
  order_id: number;
  summary: Record<string, string | number | null>;
  invoices: Array<Record<string, unknown>>;
  inspection_protocols: Array<Record<string, unknown>>;
  retentions: Array<Record<string, unknown>>;
}

export interface ProjectDocument {
  id: number;
  order: number;
  file_name: string;
  file: string;
  document_type: string;
  uploaded_at: string;
}