import { Schema, model, Types } from 'mongoose';

export const BUDGET_CATEGORIES = [
  'Alimentación', 'Transporte', 'Vivienda', 'Educación',
  'Salud', 'Servicios', 'Ocio', 'Ahorro', 'Deuda', 'Otros',
] as const;

export const BUDGET_TYPES = ['income', 'expense'] as const;

export const BUDGET_PERIODICITY = [
  'one_time', 'weekly', 'biweekly', 'monthly', 'yearly',
] as const;

export type BudgetCategory = typeof BUDGET_CATEGORIES[number];
export type BudgetType = typeof BUDGET_TYPES[number];
export type BudgetPeriodicity = typeof BUDGET_PERIODICITY[number];

export interface BudgetDoc {
  userId: Types.ObjectId;
  category: BudgetCategory;
  type: BudgetType;
  amount: number;          // MXN
  date: Date;              // solo fecha (00:00)
  notes?: string;
  periodicity: BudgetPeriodicity;
  tags?: string[];
  attachments?: string[];  // URLs
  createdAt: Date;
  updatedAt: Date;
}

const BudgetSchema = new Schema<BudgetDoc>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    category: { type: String, enum: BUDGET_CATEGORIES, required: true, index: true },
    type: { type: String, enum: BUDGET_TYPES, required: true, index: true },
    amount: { type: Number, min: 0, required: true },
    date: { type: Date, required: true, index: true },
    notes: { type: String },
    periodicity: { type: String, enum: BUDGET_PERIODICITY, required: true, default: 'one_time' },
    tags: [{ type: String }],
    attachments: [{ type: String }],
  },
  { timestamps: true }
);

BudgetSchema.index({ userId: 1, date: -1 });

export const BudgetModel = model<BudgetDoc>('Budget', BudgetSchema);
