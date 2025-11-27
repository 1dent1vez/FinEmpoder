import { useMemo, useState } from 'react';
import {
  Box, Stack, Paper, Typography, ToggleButton, ToggleButtonGroup,
  TextField, MenuItem, Button, Chip, Divider, LinearProgress
} from '@mui/material';
import LessonShell from '../LessonShell';
import { useEffect } from 'react';

type Kind = 'income' | 'expense';
type Mode = 'digital' | 'manual';

type Entry = {
  id: string;
  kind: Kind;
  amount: number;
  category: string;
  note?: string;
};
import { lessonProgressRepository } from '../../../../db/lessonProgress.repository';


const ORANGE = '#F5B041';
const ORANGE_DK = '#F39C12';

// Fallback seguro si crypto.randomUUID no existe
const genId = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : 'e' + Date.now() + Math.random().toString(16).slice(2);

export default function L04() {
  const [mode, setMode] = useState<Mode>('digital');
  const [kind, setKind] = useState<Kind>('income');
  const [amount, setAmount] = useState<string>('');        // usa string para evitar NaN al escribir
  const [category, setCategory] = useState<string>('');
  const [note, setNote] = useState<string>('');
  const [items, setItems] = useState<Entry[]>([]);

  const incomeCats = useMemo(() => ['Sueldo', 'Beca', 'Venta', 'Otro'], []);
  const expenseCats = useMemo(() => ['Comida', 'Transporte', 'Servicios', 'Ocio', 'Otro'], []);

  const parsedAmount = Number(amount);
  const canAdd = !!parsedAmount && parsedAmount > 0 && !!category;

  const handleAdd = (e?: React.MouseEvent<HTMLButtonElement>) => {
    // evita cualquier submit/recarga accidental
    if (e) e.preventDefault();

    if (!canAdd) return;
    setItems(prev => [
      ...prev,
      {
        id: genId(),
        kind,
        amount: parsedAmount,
        category,
        note: note.trim() || undefined,
      },
    ]);
    // limpia campos sin recargar ni navegar
    setAmount('');
    setCategory('');
    setNote('');
  };

  const totalIncome = items.filter(i => i.kind === 'income').reduce((a, b) => a + b.amount, 0);
  const totalExpense = items.filter(i => i.kind === 'expense').reduce((a, b) => a + b.amount, 0);
  const balance = totalIncome - totalExpense;

  // Condición de finalización: al menos 1 ingreso y 1 gasto registrados
  const hasIncome = totalIncome > 0;
  const hasExpense = totalExpense > 0;
  const complete = hasIncome && hasExpense;

  const answeredCount = Number(hasIncome) + Number(hasExpense);
  const progressVal = Math.min(100, answeredCount * 50);
useEffect(() => {
  if (!complete) return;
  lessonProgressRepository
    .setCompleted('presupuesto', 'L04')
    .catch(err => console.error(err));
}, [complete]);
  return (
    <LessonShell
      id="L04"
      title="Cómo registrar ingresos y gastos"
      completeWhen={complete}
      nextPath="/app/presupuesto"       // siguiente aún no definido
      overviewPath="/app/presupuesto"
    >
      <Box sx={{ p: 1 }}>
        <Paper
          sx={{ p: 2, borderRadius: 3, bgcolor: '#FFF8E1', borderLeft: `6px solid ${ORANGE}`, mb: 2 }}
        >
          <Typography variant="body1" sx={{ mb: 1 }}>
            Practica el registro digital o manual. Agrega al menos un ingreso y un gasto.
          </Typography>
          <ToggleButtonGroup
            exclusive
            value={mode}
            onChange={(_, v) => v && setMode(v)}
            size="small"
            sx={{
              '& .MuiToggleButton-root.Mui-selected': { bgcolor: ORANGE, color: '#fff' },
              '& .MuiToggleButton-root': { textTransform: 'none', borderColor: ORANGE }
            }}
          >
            <ToggleButton value="digital">Registro digital</ToggleButton>
            <ToggleButton value="manual">Registro manual</ToggleButton>
          </ToggleButtonGroup>
        </Paper>

        <LinearProgress
          variant="determinate"
          value={progressVal}
          sx={{ mb: 2, height: 8, borderRadius: 5, bgcolor: '#f0f0f0', '& .MuiLinearProgress-bar': { bgcolor: ORANGE } }}
        />

        {/* Formulario de captura (no es <form> para evitar submits) */}
        <Paper sx={{ p: 2, borderRadius: 3, mb: 2 }}>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
            <Chip
              label={kind === 'income' ? 'Ingreso' : 'Gasto'}
              color={kind === 'income' ? 'success' : 'error'}
              variant="outlined"
              onClick={() => setKind(kind === 'income' ? 'expense' : 'income')}
            />
            <Typography variant="body2" color="text.secondary">
              Toca la etiqueta para alternar entre Ingreso/Gasto
            </Typography>
          </Stack>

          <Stack spacing={1.25}>
            <TextField
              label="Monto"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              inputProps={{ step: '0.01', min: 0 }}
            />

            <TextField
              select
              label="Categoría"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {(kind === 'income' ? incomeCats : expenseCats).map((c) => (
                <MenuItem key={c} value={c}>{c}</MenuItem>
              ))}
            </TextField>

            {mode === 'manual' && (
              <TextField
                label="Descripción breve (opcional)"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            )}

            <Button
              type="button"
              variant="contained"
              onClick={handleAdd}
              disabled={!canAdd}
              sx={{ bgcolor: ORANGE, '&:hover': { bgcolor: ORANGE_DK } }}
            >
              Agregar registro
            </Button>
          </Stack>
        </Paper>

        {/* Lista + resumen */}
        <Paper sx={{ p: 2, borderRadius: 3 }}>
          <Stack spacing={1}>
            {items.length === 0 && (
              <Typography variant="body2" color="text.secondary">
                Aún no hay movimientos. Agrega un ingreso y un gasto para completar la lección.
              </Typography>
            )}

            {items.map((it) => (
              <Stack key={it.id} direction="row" justifyContent="space-between">
                <Typography fontWeight={700}>
                  {it.kind === 'income' ? '+' : '-'}${it.amount.toFixed(2)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {it.category}{it.note ? ` — ${it.note}` : ''}
                </Typography>
              </Stack>
            ))}

            <Divider sx={{ my: 1 }} />

            <Stack direction="row" justifyContent="space-between">
              <Typography>Ingresos</Typography>
              <Typography fontWeight={700}>${totalIncome.toFixed(2)}</Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <Typography>Gastos</Typography>
              <Typography fontWeight={700}>${totalExpense.toFixed(2)}</Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <Typography>Balance</Typography>
              <Typography fontWeight={900} color={balance >= 0 ? 'success.main' : 'error.main'}>
                ${balance.toFixed(2)}
              </Typography>
            </Stack>
          </Stack>
        </Paper>
      </Box>
    </LessonShell>
  );
}
