import { useMemo, useState } from 'react';
import {
  Box, Paper, Stack, Typography, Slider, Switch, FormControlLabel,
  TextField, LinearProgress, Chip
} from '@mui/material';
import LessonShell from '../LessonShell';
import { lessonProgressRepository } from '../../../../db/lessonProgress.repository';
import { useEffect} from 'react';


type Expense = {
  id: string;
  name: string;
  amount: number;     // gasto actual
  cutPct: number;     // % de recorte elegido
  postpone: boolean;  // posponer (poner 0)
};

const ORANGE = '#F5B041';

const genId = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : 'x' + Date.now() + Math.random().toString(16).slice(2);

export default function L07() {
  // Gasto base de ejemplo (más adelante lo podremos hidratar del backend)
  const base: Expense[] = useMemo(
    () => [
      { id: genId(), name: 'Comida fuera', amount: 900, cutPct: 0, postpone: false },
      { id: genId(), name: 'Streaming', amount: 250, cutPct: 0, postpone: false },
      { id: genId(), name: 'Transporte', amount: 700, cutPct: 0, postpone: false },
      { id: genId(), name: 'Ocio', amount: 500, cutPct: 0, postpone: false },
      { id: genId(), name: 'Ropa', amount: 300, cutPct: 0, postpone: false },
    ],
    []
  );

  const [rows, setRows] = useState<Expense[]>(base);
  const [target, setTarget] = useState<number>(500); // meta de ahorro mensual

  // Cálculos
  const currentTotal = rows.reduce((a, r) => a + r.amount, 0);
  const simulatedTotal = rows.reduce((a, r) => {
    const cut = r.postpone ? r.amount : r.amount * (1 - r.cutPct / 100);
    return a + cut;
  }, 0);
  const saved = currentTotal - simulatedTotal;

  const decisions = rows.filter(r => r.postpone || r.cutPct > 0).length;
  const hasDecisions = decisions >= 1;
  const hitTarget = saved >= Math.max(0, target);
  const complete = hasDecisions && hitTarget;
useEffect(() => {
  if (!complete) return;
  lessonProgressRepository
    .setCompleted('presupuesto', 'L07')
    .catch(err => console.error(err));
}, [complete]);
  const progress =
    Math.min(100, Math.round((saved / Math.max(1, target)) * 100));

  const onChangeCut = (id: string, pct: number) => {
    setRows(prev => prev.map(r => (r.id === id ? { ...r, cutPct: pct, postpone: pct === 100 ? true : r.postpone } : r)));
  };

  const onTogglePostpone = (id: string, v: boolean) => {
    setRows(prev => prev.map(r => (r.id === id ? { ...r, postpone: v, cutPct: v ? 100 : r.cutPct } : r)));
  };

  return (
    <LessonShell
      id="L07"
      title="Ajuste del presupuesto: decide cómo recortar o priorizar"
      completeWhen={complete}
      nextPath="/app/presupuesto"         // encadenar a la siguiente cuando exista
      overviewPath="/app/presupuesto"
    >
      <Box sx={{ p: 1 }}>
        <Paper sx={{ p: 2, borderRadius: 3, bgcolor: '#FFF8E1', borderLeft: `6px solid ${ORANGE}`, mb: 2 }}>
          <Typography variant="body1" sx={{ mb: 1 }}>
            Define una meta de ahorro y simula decisiones: recortes porcentuales o posponer gastos.
            La lección se completa cuando alcanzas la meta con al menos una decisión aplicada.
          </Typography>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems="center">
            <TextField
              label="Meta de ahorro mensual"
              type="number"
              value={String(target)}
              onChange={(e) => setTarget(Number(e.target.value))}
              inputProps={{ min: 0, step: '50' }}
              size="small"
            />
            <Chip label={`Gasto actual: $${currentTotal.toFixed(2)}`} />
            <Chip label={`Ahorro simulado: $${saved.toFixed(2)}`} color={hitTarget ? 'success' : 'default'} />
          </Stack>
        </Paper>

        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{ mb: 2, height: 8, borderRadius: 5, bgcolor: '#f0f0f0', '& .MuiLinearProgress-bar': { bgcolor: ORANGE } }}
        />

        <Stack spacing={1.25}>
          {rows.map((r) => {
            const after = r.postpone ? 0 : r.amount * (1 - r.cutPct / 100);
            const savedRow = r.amount - after;
            return (
              <Paper key={r.id} sx={{ p: 2, borderRadius: 3 }}>
                <Stack spacing={0.75}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography fontWeight={800}>{r.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Actual: ${r.amount.toFixed(2)} · Simulado: ${after.toFixed(2)} · Ahorro: ${savedRow.toFixed(2)}
                    </Typography>
                  </Stack>

                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems="center">
                    <Slider
                      value={r.postpone ? 100 : r.cutPct}
                      onChange={(_, v) => onChangeCut(r.id, Number(v))}
                      step={5}
                      min={0}
                      max={100}
                      valueLabelDisplay="auto"
                      disabled={r.postpone}
                      sx={{ flex: 1 }}
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={r.postpone}
                          onChange={(_, v) => onTogglePostpone(r.id, v)}
                        />
                      }
                      label="Posponer este gasto"
                    />
                  </Stack>
                </Stack>
              </Paper>
            );
          })}
        </Stack>

        <Paper sx={{ p: 2, borderRadius: 3, mt: 2 }}>
          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
            <Chip label={`Decisiones aplicadas: ${decisions}`} />
            <Chip label={`Ahorro logrado: $${saved.toFixed(2)}`} color={hitTarget ? 'success' : 'default'} />
            <Chip label={`Meta: $${target.toFixed(2)}`} />
          </Stack>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {complete
              ? 'Meta alcanzada. Continúa para consolidar tu presupuesto.'
              : 'Ajusta los deslizadores o pospone gastos hasta alcanzar tu meta.'}
          </Typography>
        </Paper>
      </Box>
    </LessonShell>
  );
}
