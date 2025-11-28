import { useMemo, useState } from 'react';
import {
  Box,
  Paper,
  Stack,
  Typography,
  TextField,
  Slider,
  Chip,
  LinearProgress
} from '@mui/material';
import LessonShell from '../LessonShell';

export default function L05() {
  const [income, setIncome] = useState(5000);
  const [needsPct, setNeedsPct] = useState(50);
  const [wantsPct, setWantsPct] = useState(30);

  const savingsPct = useMemo(() => Math.max(0, 100 - needsPct - wantsPct), [needsPct, wantsPct]);
  const needs = useMemo(() => (income * needsPct) / 100, [income, needsPct]);
  const wants = useMemo(() => (income * wantsPct) / 100, [income, wantsPct]);
  const savings = useMemo(() => (income * savingsPct) / 100, [income, savingsPct]);

  const ready = income > 0 && savingsPct >= 20;

  return (
    <LessonShell
      id="L05"
      title="Metodo 50-30-20 aplicado al ahorro"
      completeWhen={ready}
      nextPath="/app/ahorro/lesson/L06"
      overviewPath="/app/ahorro"
    >
      <Box sx={{ p: 1 }}>
        <Paper
          sx={{
            p: 2,
            borderRadius: 3,
            bgcolor: '#FFF4E0',
            borderLeft: '6px solid #F5B041',
            mb: 2
          }}
        >
          <Typography variant="body1" sx={{ mb: 1 }}>
            Ajusta porcentajes para asegurar al menos 20% al ahorro. El resto se reparte en
            necesidades y gustos.
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            <Chip label="50% Necesidades" size="small" />
            <Chip label="30% Gustos" size="small" />
            <Chip label="20% Ahorro" size="small" color="success" />
          </Stack>
        </Paper>

        <Stack spacing={1.5}>
          <TextField
            label="Ingreso mensual (MXN)"
            type="number"
            value={income}
            onChange={(e) => setIncome(Number(e.target.value))}
            inputProps={{ min: 0, step: 100 }}
          />

          <Slider
            value={needsPct}
            min={30}
            max={70}
            step={1}
            onChange={(_, v) => setNeedsPct(v as number)}
            valueLabelDisplay="auto"
          />
          <Typography variant="body2" color="text.secondary">
            Necesidades: {needsPct}% | Gustos: {wantsPct}% | Ahorro: {savingsPct}%
          </Typography>
          <Slider
            value={wantsPct}
            min={10}
            max={50}
            step={1}
            onChange={(_, v) => setWantsPct(v as number)}
            valueLabelDisplay="auto"
          />

          <LinearProgress
            variant="determinate"
            value={savingsPct}
            sx={{
              height: 8,
              borderRadius: 5,
              bgcolor: '#f0f0f0',
              '& .MuiLinearProgress-bar': { bgcolor: savingsPct >= 20 ? '#2ECC71' : '#E74C3C' }
            }}
          />
          <Typography variant="body2" color="text.secondary">
            Destinas {savingsPct}% al ahorro: {savingsPct >= 20 ? 'meta cumplida.' : 'sube un poco mas.'}
          </Typography>

          <Paper sx={{ p: 2, borderRadius: 3 }}>
            <Typography fontWeight={700}>Distribucion</Typography>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2">Necesidades</Typography>
              <Typography fontWeight={700}>${needs.toFixed(2)}</Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2">Gustos</Typography>
              <Typography fontWeight={700}>${wants.toFixed(2)}</Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2">Ahorro/meta</Typography>
              <Typography fontWeight={900} color="success.main">
                ${savings.toFixed(2)}
              </Typography>
            </Stack>
          </Paper>
        </Stack>
      </Box>
    </LessonShell>
  );
}
