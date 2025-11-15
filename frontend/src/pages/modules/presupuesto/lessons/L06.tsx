import { useState } from 'react';
import {
  Box, Paper, Stack, Typography, TextField, Button, IconButton, LinearProgress, Chip
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import LessonShell from '../LessonShell';

type Row = { id: string; label: string; amount: number };
const ORANGE = '#F5B041';

const genId = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : 'r' + Date.now() + Math.random().toString(16).slice(2);

export default function L06() {
  const [incomes, setIncomes] = useState<Row[]>([{ id: genId(), label: 'Sueldo/Beca', amount: 0 }]);
  const [expenses, setExpenses] = useState<Row[]>([{ id: genId(), label: 'Renta/Servicios', amount: 0 }]);

  const totalIncome = incomes.reduce((a, r) => a + (Number(r.amount) || 0), 0);
  const totalExpense = expenses.reduce((a, r) => a + (Number(r.amount) || 0), 0);
  const balance = totalIncome - totalExpense;

  const hasIncome = totalIncome > 0;
  const hasExpense = totalExpense > 0;
  const progress = Math.min(100, (Number(hasIncome) + Number(hasExpense)) * 50);
  const status =
    !hasIncome && !hasExpense ? 'incomplete' : balance >= 0 ? 'superavit' : 'deficit';

  // ── FIX ESLint: usa if/else en lugar de ternario con efectos ────────────────
  const setRow = (kind: 'in' | 'ex', id: string, key: 'label' | 'amount', value: string) => {
    if (kind === 'in') {
      const upd = incomes.map((r) =>
        r.id === id ? { ...r, [key]: key === 'amount' ? Number(value) : value } : r,
      );
      setIncomes(upd);
    } else {
      const upd = expenses.map((r) =>
        r.id === id ? { ...r, [key]: key === 'amount' ? Number(value) : value } : r,
      );
      setExpenses(upd);
    }
  };

  const addRow = (kind: 'in' | 'ex') => {
    const row: Row = { id: genId(), label: '', amount: 0 };
    if (kind === 'in') {
      setIncomes((p) => [...p, row]);
    } else {
      setExpenses((p) => [...p, row]);
    }
  };

  const delRow = (kind: 'in' | 'ex', id: string) => {
    if (kind === 'in') {
      setIncomes((p) => p.filter((r) => r.id !== id));
    } else {
      setExpenses((p) => p.filter((r) => r.id !== id));
    }
  };
  // ────────────────────────────────────────────────────────────────────────────

  return (
    <LessonShell
      id="L06"
      title="Cálculo de balance mensual"
      completeWhen={hasIncome && hasExpense}
      nextPath="/app/presupuesto"
      overviewPath="/app/presupuesto"
    >
      <Box sx={{ p: 1 }}>
        <Paper sx={{ p: 2, borderRadius: 3, bgcolor: '#FFF8E1', borderLeft: `6px solid ${ORANGE}`, mb: 2 }}>
          <Typography variant="body1">
            Ingresa tus montos. El balance se calcula en tiempo real para detectar superávit o déficit.
          </Typography>
        </Paper>

        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{ mb: 2, height: 8, borderRadius: 5, bgcolor: '#f0f0f0', '& .MuiLinearProgress-bar': { bgcolor: ORANGE } }}
        />

        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          {/* Ingresos */}
          <Paper sx={{ p: 2, borderRadius: 3, flex: 1 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
              <Typography fontWeight={800}>Ingresos</Typography>
              <Button variant="outlined" onClick={() => addRow('in')}>Agregar</Button>
            </Stack>
            <Stack spacing={1}>
              {incomes.map((r) => (
                <Stack key={r.id} direction="row" spacing={1}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Concepto"
                    value={r.label}
                    onChange={(e) => setRow('in', r.id, 'label', e.target.value)}
                  />
                  <TextField
                    size="small"
                    label="Monto"
                    type="number"
                    inputProps={{ step: '0.01', min: 0 }}
                    value={String(r.amount)}
                    onChange={(e) => setRow('in', r.id, 'amount', e.target.value)}
                    sx={{ width: 140 }}
                  />
                  <IconButton aria-label="eliminar" onClick={() => delRow('in', r.id)}>
                    <DeleteIcon />
                  </IconButton>
                </Stack>
              ))}
            </Stack>
            <Typography sx={{ mt: 1 }} fontWeight={700}>
              Total ingresos: ${totalIncome.toFixed(2)}
            </Typography>
          </Paper>

          {/* Gastos */}
          <Paper sx={{ p: 2, borderRadius: 3, flex: 1 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
              <Typography fontWeight={800}>Gastos</Typography>
              <Button variant="outlined" onClick={() => addRow('ex')}>Agregar</Button>
            </Stack>
            <Stack spacing={1}>
              {expenses.map((r) => (
                <Stack key={r.id} direction="row" spacing={1}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Concepto"
                    value={r.label}
                    onChange={(e) => setRow('ex', r.id, 'label', e.target.value)}
                  />
                  <TextField
                    size="small"
                    label="Monto"
                    type="number"
                    inputProps={{ step: '0.01', min: 0 }}
                    value={String(r.amount)}
                    onChange={(e) => setRow('ex', r.id, 'amount', e.target.value)}
                    sx={{ width: 140 }}
                  />
                  <IconButton aria-label="eliminar" onClick={() => delRow('ex', r.id)}>
                    <DeleteIcon />
                  </IconButton>
                </Stack>
              ))}
            </Stack>
            <Typography sx={{ mt: 1 }} fontWeight={700}>
              Total gastos: ${totalExpense.toFixed(2)}
            </Typography>
          </Paper>
        </Stack>

        {/* Resultado */}
        <Paper sx={{ p: 2, borderRadius: 3, mt: 2 }}>
          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
            <Typography fontWeight={800}>Balance:</Typography>
            <Typography fontWeight={900} color={balance >= 0 ? 'success.main' : 'error.main'}>
              ${balance.toFixed(2)}
            </Typography>
            {status !== 'incomplete' && (
              <Chip
                size="small"
                color={balance >= 0 ? 'success' : 'error'}
                label={balance >= 0 ? 'Superávit' : 'Déficit'}
                sx={{ fontWeight: 700 }}
              />
            )}
          </Stack>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {status === 'incomplete'
              ? 'Agrega al menos un ingreso y un gasto para calcular.'
              : balance >= 0
              ? 'Buen trabajo: tu ingreso cubre tus gastos. Considera destinar un porcentaje al ahorro programado.'
              : 'Hay déficit: identifica categorías recortables o aumenta ingresos variables (comisiones, horas extra).'}
          </Typography>
        </Paper>
      </Box>
    </LessonShell>
  );
}
