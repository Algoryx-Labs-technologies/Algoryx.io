export interface StageCount {
  stage: string;
  label: string;
  count: number;
}

export interface DashboardRecentLead {
  id: string;
  leadCode: string;
  name: string;
  stage: string;
  stageLabel: string;
}

export interface DashboardRecentProject {
  id: string;
  projectCode: string;
  projectName: string;
  clientName: string;
  stage: string;
  stageLabel: string;
}

export interface DashboardRecentTicket {
  id: string;
  subject: string;
  name: string;
  priority: string;
  createdAt: string;
}

export interface DashboardRecentRequirement {
  id: string;
  fullName: string;
  email: string;
  companyOrg?: string;
  createdAt: string;
}

export interface DashboardUpcomingPayment {
  id: string;
  paymentCode: string;
  amount: number;
  currency: string;
  deadline: string;
  status: string;
  projectName: string;
  clientName: string;
}

export interface DashboardSummary {
  finance: {
    totalRevenue: number;
    totalExpenses: number;
    netBalance: number;
    currency: string;
  };
  salesPipeline: {
    total: number;
    active: number;
    byStage: StageCount[];
    recent: DashboardRecentLead[];
  };
  projects: {
    total: number;
    active: number;
    byStage: StageCount[];
    recent: DashboardRecentProject[];
  };
  payments: {
    pending: number;
    delayed: number;
    paid: number;
    upcoming: DashboardUpcomingPayment[];
  };
  support: {
    total: number;
    urgent: number;
    recent: DashboardRecentTicket[];
  };
  requirements: {
    total: number;
    recent: DashboardRecentRequirement[];
  };
  teams: { total: number };
  notes: { total: number };
}
