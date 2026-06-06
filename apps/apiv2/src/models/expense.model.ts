import mongoose, { Document, Model, Schema, Types } from 'mongoose';

export const EXPENSE_TYPES = ['project', 'company'] as const;

export type ExpenseType = (typeof EXPENSE_TYPES)[number];

export interface IExpense extends Document {
  expenseCode: string;
  type: ExpenseType;
  projectId?: Types.ObjectId;
  title: string;
  description?: string;
  amount: number;
  currency: string;
  expenseDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const expenseSchema = new Schema<IExpense>(
  {
    expenseCode: { type: String, required: true, unique: true, trim: true },
    type: {
      type: String,
      required: true,
      enum: EXPENSE_TYPES,
    },
    projectId: {
      type: Schema.Types.ObjectId,
      ref: 'AdminProject',
    },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, required: true, trim: true, default: 'INR' },
    expenseDate: { type: Date, required: true },
  },
  {
    timestamps: true,
    collection: 'admin_expenses',
  },
);

export const Expense: Model<IExpense> =
  mongoose.models.Expense ?? mongoose.model<IExpense>('Expense', expenseSchema);
