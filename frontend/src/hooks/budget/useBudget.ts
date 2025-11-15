import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { budgetApi, type BudgetCreate } from '../../api/budget.api';
import { useProgress } from '../../store/progress';

export function useBudgetList(filters?: { from?: string; to?: string; type?: string; category?: string }) {
  return useQuery({ queryKey: ['budget', filters], queryFn: () => budgetApi.list(filters) });
}
export function useBudgetCreate() {
  const qc = useQueryClient();
  const progress = useProgress();
  return useMutation({
    mutationFn: (payload: BudgetCreate) => budgetApi.create(payload),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['budget'] }); progress.recordActivity('presupuesto', 5); },
  });
}
export function useBudgetUpdate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<BudgetCreate> }) => budgetApi.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['budget'] }),
  });
}
export function useBudgetDelete() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => budgetApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['budget'] }),
  });
}
export function useBudgetSummary(range?: { from?: string; to?: string }) {
  return useQuery({ queryKey: ['budget-summary', range], queryFn: () => budgetApi.summary(range) });
}
