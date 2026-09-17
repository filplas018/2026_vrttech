export type WorkflowStatus = 'NEZAHAJENO' | 'PROBIHA' | 'SPLNENO';

export interface WellWorkflowStep {
  id: number;
  project: number;
  stepNumber: number;
  status: WorkflowStatus;
  hydrogeologist: number | null;
  completedAt: string | null;
}

export interface FinanceOverview {
  orderId: number;
  summary: Record<string, string | number | null>;
  invoices: Array<Record<string, unknown>>;
  inspectionProtocols: Array<Record<string, unknown>>;
  retentions: Array<Record<string, unknown>>;
}

export interface ProjectDocument {
  id: number;
  order: number;
  fileName: string;
  file: string;
  documentType: string;
  uploadedAt: string;
}