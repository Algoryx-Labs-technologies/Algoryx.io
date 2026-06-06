import mongoose, { Document, Model, Schema, Types } from 'mongoose';

export const PAYMENT_STATUSES = ['pending', 'delayed', 'paid'] as const;

export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

export interface IAdminPayment extends Document {
  paymentCode: string;
  projectId: Types.ObjectId;
  amount: number;
  currency: string;
  deadline: Date;
  status: PaymentStatus;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const adminPaymentSchema = new Schema<IAdminPayment>(
  {
    paymentCode: { type: String, required: true, unique: true, trim: true },
    projectId: {
      type: Schema.Types.ObjectId,
      ref: 'AdminProject',
      required: true,
    },
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, required: true, trim: true, default: 'INR' },
    deadline: { type: Date, required: true },
    status: {
      type: String,
      required: true,
      enum: PAYMENT_STATUSES,
      default: 'pending',
    },
    description: { type: String, trim: true },
  },
  {
    timestamps: true,
    collection: 'admin_payments',
  },
);

export const AdminPayment: Model<IAdminPayment> =
  mongoose.models.AdminPayment ??
  mongoose.model<IAdminPayment>('AdminPayment', adminPaymentSchema);
