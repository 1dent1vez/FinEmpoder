import { api } from './client';

export type BudgetRow = {
  _id: string;
  category: string;
  type: 'income' | 'expense';
  amount: number;
  date: string;
  notes?: string;
  periodicity: 'one_time'|'weekly'|'biweekly'|'monthly'|'yearly';
  tags?: string[];
  attachments?: string[];
  createdAt: string;
  updatedAt: string;
};

export type BudgetCreate = Omit<BudgetRow,'_id'|'createdAt'|'updatedAt'>;

export const budgetApi = {
  list: (params?: { from?: string; to?: string; type?: string; category?: string }) =>
    api.get<BudgetRow[]>('/budget', { params }).then(r => r.data),
  create: (payload: BudgetCreate) =>
    api.post<BudgetRow>('/budget', payload).then(r => r.data),
  update: (id: string, payload: Partial<BudgetCreate>) =>
    api.patch<BudgetRow>(`/budget/${id}`, payload).then(r => r.data),
  remove: (id: string) =>
    api.delete<void>(`/budget/${id}`).then(r => r.data),
  summary: (params?: { from?: string; to?: string }) =>
    api.get('/budget/summary', { params }).then(r => r.data),
};
