export const PIPELINE_STAGES = [
  {
    id: 'discovery',
    label: 'Discovery',
    headerClass: 'bg-slate-500',
  },
  {
    id: 'deal_closed',
    label: 'Deal Closed',
    headerClass: 'bg-amber-500',
  },
  {
    id: 'in_progress',
    label: 'In Progress',
    headerClass: 'bg-emerald-600',
  },
  {
    id: 'completed',
    label: 'Completed',
    headerClass: 'bg-blue-700',
  },
] as const;

export type PipelineStageId = (typeof PIPELINE_STAGES)[number]['id'];

export interface SalesLead {
  id: string;
  leadCode: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  notes?: string;
  stage: PipelineStageId;
  createdAt: string;
  updatedAt: string;
}

export type StageFilter = 'all' | PipelineStageId;
