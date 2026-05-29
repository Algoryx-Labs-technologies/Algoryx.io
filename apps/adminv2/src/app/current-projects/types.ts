export const PROJECT_STAGES = [
  {
    id: 'not_started',
    label: 'Not Started',
    headerClass: 'bg-slate-500',
  },
  {
    id: 'in_progress',
    label: 'In Progress',
    headerClass: 'bg-blue-600',
  },
  {
    id: 'completed',
    label: 'Completed',
    headerClass: 'bg-emerald-600',
  },
  {
    id: 'delivered',
    label: 'Delivered',
    headerClass: 'bg-indigo-700',
  },
] as const;

export type ProjectStageId = (typeof PROJECT_STAGES)[number]['id'];

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface AssignedTeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface AdminProject {
  id: string;
  projectCode: string;
  projectName: string;
  clientName: string;
  clientEmail?: string;
  description?: string;
  budget?: string;
  deadline?: string;
  stage: ProjectStageId;
  assignedTeam: AssignedTeamMember[];
  createdAt: string;
  updatedAt: string;
}

export type StageFilter = 'all' | ProjectStageId;
