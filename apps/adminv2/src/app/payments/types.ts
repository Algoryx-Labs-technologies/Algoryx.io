export const PAYMENT_STATUSES = [
  {
    id: 'pending',
    label: 'Pending',
    headerClass: 'bg-amber-500',
  },
  {
    id: 'paid',
    label: 'Paid',
    headerClass: 'bg-emerald-600',
  },
  {
    id: 'delayed',
    label: 'Delayed',
    headerClass: 'bg-red-500',
  },
] as const;

export type PaymentStatusId = (typeof PAYMENT_STATUSES)[number]['id'];

export interface PaymentProjectSummary {
  id: string;
  projectCode: string;
  projectName: string;
  clientName: string;
}

export interface Payment {
  id: string;
  paymentCode: string;
  projectId: string;
  project: PaymentProjectSummary;
  amount: number;
  currency: string;
  deadline: string;
  status: PaymentStatusId;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export type StatusFilter = 'all' | PaymentStatusId;

export interface AdminProjectOption {
  id: string;
  projectCode: string;
  projectName: string;
  clientName: string;
}
