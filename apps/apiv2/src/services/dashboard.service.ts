import {
  ADMIN_PROJECT_STAGES,
  AdminProject,
  AdminProjectStage,
} from '@/models/admin-project.model';
import { Expense } from '@/models/expense.model';
import { LandingRequirement } from '@/models/landing-requirement.model';
import { Note } from '@/models/note.model';
import { AdminPayment } from '@/models/payment.model';
import {
  SALES_LEAD_STAGES,
  SalesLead,
  SalesLeadStage,
} from '@/models/sales-lead.model';
import { SupportTicket } from '@/models/support-ticket.model';
import { TeamMember } from '@/models/team.model';
import { listPayments } from '@/services/payment.service';

const SALES_STAGE_LABELS: Record<SalesLeadStage, string> = {
  discovery: 'Discovery',
  deal_closed: 'Deal Closed',
  in_progress: 'In Progress',
  completed: 'Completed',
};

const PROJECT_STAGE_LABELS: Record<AdminProjectStage, string> = {
  not_started: 'Not Started',
  in_progress: 'In Progress',
  completed: 'Completed',
  delivered: 'Delivered',
};

export interface StageCount {
  stage: string;
  label: string;
  count: number;
}

export interface DashboardRecentLead {
  id: string;
  leadCode: string;
  name: string;
  stage: SalesLeadStage;
  stageLabel: string;
}

export interface DashboardRecentProject {
  id: string;
  projectCode: string;
  projectName: string;
  clientName: string;
  stage: AdminProjectStage;
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

const countByStage = async (
  model: typeof SalesLead | typeof AdminProject,
  stages: readonly string[],
  labels: Record<string, string>,
): Promise<StageCount[]> => {
  const results = await model.aggregate<{ _id: string; count: number }>([
    { $group: { _id: '$stage', count: { $sum: 1 } } },
  ]);

  const countMap = new Map(results.map((row) => [row._id, row.count]));

  return stages.map((stage) => ({
    stage,
    label: labels[stage] ?? stage,
    count: countMap.get(stage) ?? 0,
  }));
};

export const getDashboardSummary = async (): Promise<DashboardSummary> => {
  const [
    paidPaymentsAgg,
    totalExpensesAgg,
    salesByStage,
    projectsByStage,
    paymentPending,
    paymentDelayed,
    paymentPaid,
    supportTotal,
    supportUrgent,
    requirementsTotal,
    teamsTotal,
    notesTotal,
    recentLeads,
    recentProjects,
    recentTickets,
    recentRequirements,
    upcomingPayments,
  ] = await Promise.all([
    AdminPayment.aggregate([
      { $match: { status: 'paid' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]),
    Expense.aggregate([{ $group: { _id: null, total: { $sum: '$amount' } } }]),
    countByStage(SalesLead, SALES_LEAD_STAGES, SALES_STAGE_LABELS),
    countByStage(AdminProject, ADMIN_PROJECT_STAGES, PROJECT_STAGE_LABELS),
    AdminPayment.countDocuments({ status: 'pending' }),
    AdminPayment.countDocuments({ status: 'delayed' }),
    AdminPayment.countDocuments({ status: 'paid' }),
    SupportTicket.countDocuments(),
    SupportTicket.countDocuments({ priority: 'urgent' }),
    LandingRequirement.countDocuments(),
    TeamMember.countDocuments(),
    Note.countDocuments(),
    SalesLead.find().sort({ updatedAt: -1 }).limit(4).lean(),
    AdminProject.find().sort({ updatedAt: -1 }).limit(4).lean(),
    SupportTicket.find().sort({ createdAt: -1 }).limit(4).lean(),
    LandingRequirement.find().sort({ createdAt: -1 }).limit(4).lean(),
    listPayments({ status: 'pending' }).then((pending) =>
      listPayments({ status: 'delayed' }).then((delayed) => {
        const combined = [...pending, ...delayed];
        return combined
          .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
          .slice(0, 5)
          .map((payment) => ({
            id: payment.id,
            paymentCode: payment.paymentCode,
            amount: payment.amount,
            currency: payment.currency,
            deadline: payment.deadline,
            status: payment.status,
            projectName: payment.project.projectName,
            clientName: payment.project.clientName,
          }));
      }),
    ),
  ]);

  const totalRevenue = paidPaymentsAgg[0]?.total ?? 0;
  const totalExpenses = totalExpensesAgg[0]?.total ?? 0;
  const salesTotal = salesByStage.reduce((sum, row) => sum + row.count, 0);
  const salesCompleted =
    salesByStage.find((row) => row.stage === 'completed')?.count ?? 0;
  const projectsTotal = projectsByStage.reduce((sum, row) => sum + row.count, 0);
  const projectsActive = projectsByStage
    .filter((row) => row.stage !== 'delivered')
    .reduce((sum, row) => sum + row.count, 0);

  return {
    finance: {
      totalRevenue,
      totalExpenses,
      netBalance: totalRevenue - totalExpenses,
      currency: 'INR',
    },
    salesPipeline: {
      total: salesTotal,
      active: salesTotal - salesCompleted,
      byStage: salesByStage,
      recent: recentLeads.map((lead) => ({
        id: String(lead._id),
        leadCode: lead.leadCode,
        name: lead.name,
        stage: lead.stage,
        stageLabel: SALES_STAGE_LABELS[lead.stage],
      })),
    },
    projects: {
      total: projectsTotal,
      active: projectsActive,
      byStage: projectsByStage,
      recent: recentProjects.map((project) => ({
        id: String(project._id),
        projectCode: project.projectCode,
        projectName: project.projectName,
        clientName: project.clientName,
        stage: project.stage,
        stageLabel: PROJECT_STAGE_LABELS[project.stage],
      })),
    },
    payments: {
      pending: paymentPending,
      delayed: paymentDelayed,
      paid: paymentPaid,
      upcoming: upcomingPayments,
    },
    support: {
      total: supportTotal,
      urgent: supportUrgent,
      recent: recentTickets.map((ticket) => ({
        id: String(ticket._id),
        subject: ticket.subject,
        name: ticket.name,
        priority: ticket.priority,
        createdAt: ticket.createdAt.toISOString(),
      })),
    },
    requirements: {
      total: requirementsTotal,
      recent: recentRequirements.map((req) => ({
        id: String(req._id),
        fullName: req.fullName,
        email: req.email,
        companyOrg: req.companyOrg,
        createdAt: req.createdAt.toISOString(),
      })),
    },
    teams: { total: teamsTotal },
    notes: { total: notesTotal },
  };
};
