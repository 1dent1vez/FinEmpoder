import { useMemo, useState } from 'react';
import {
  Box,
  Stack,
  Paper,
  Typography,
  TextField,
  Slider,
  Chip,
  Button,
  LinearProgress
} from '@mui/material';
import LessonShell from '../LessonShell';

export default function L04() {
  const [name, setName] = useState('Fondo de emergencia');
  const [reason, setReason] = useState('Cubrir imprevistos sin deudas');
  const [amount, setAmount] = useState(3000);
  const [months, setMonths] = useState(6);
  const [metric, setMetric] = useState('Ahorrar $500 al mes');

  const monthly = useMemo(() => (months > 0 ? amount / months : 0), [amount, months]);
  const complete = Boolean(name.trim() && reason.trim() && metric.trim() && amount > 0 && months > 0);
  const progress = Math.min(100, Math.round((Number(!!name) + Number(!!reason) + Number(amount > 0) + Number(months > 0) + Number(!!metric)) / 5 * 100));

  return (
    <LessonShell
      id="L04"
      title="Define tu meta (SMART)"
      completeWhen={complete}
      nextPath="/app/ahorro/lesson/L05"
      overviewPath="/app/ahorro"
    >
      <Box sx={{ p: 1 }}>
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            mb: 2,
            height: 8,
            borderRadius: 5,
            bgcolor: '#f0f0f0',
            '& .MuiLinearProgress-bar': { bgcolor: '#2ECC71' }
          }}
        />

        <Paper sx={{ p: 2, borderRadius: 3, bgcolor: '#E8F6E9', borderLeft: '6px solid #2ECC71' }}>
          <Typography variant="body1" sx={{ mb: 1 }}>
            Usa el esquema SMART: especifica la meta, hazla medible, alcanza un monto realista,
            fija un plazo y revisa tu avance.
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {['Especifica', 'Medible', 'Alcanzable', 'Relevante', 'Tiempo definido'].map((t) => (
              <Chip key={t} label={t} size="small" />
            ))}
          </Stack>
        </Paper>

        <Stack spacing={1.25} sx={{ mt: 2 }}>
          <TextField label="Meta especifica" value={name} onChange={(e) => setName(e.target.value)} />
          <TextField
            label="Por que es relevante"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
          <TextField
            label="Monto objetivo (MXN)"
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            inputProps={{ min: 0, step: 100 }}
          />

          <Stack spacing={0.5}>
            <Typography variant="body2" color="text.secondary">
              Plazo (meses): {months}
            </Typography>
            <Slider value={months} min={1} max={12} step={1} onChange={(_, v) => setMonths(v as number)} valueLabelDisplay="auto" />
          </Stack>

          <TextField
            label="Indicador medible"
            value={metric}
            onChange={(e) => setMetric(e.target.value)}
            helperText="Ejemplo: Depositar $500 el dia 10 de cada mes."
          />
        </Stack>

        <Paper sx={{ p: 2, borderRadius: 3, mt: 2 }}>
          <Typography fontWeight={700}>Plan rapido</Typography>
          <Typography variant="body2" color="text.secondary">
            Ahorra aproximadamente ${monthly.toFixed(2)} al mes para llegar a tu meta en {months}{' '}
            meses.
          </Typography>
          <Stack direction="row" spacing={1} sx={{ mt: 1 }} flexWrap="wrap">
            <Chip label="Auto-abono mensual" color="success" variant="outlined" />
            <Chip label="Recordatorio en calendario" variant="outlined" />
          </Stack>
        </Paper>

        <Button
          fullWidth
          variant="contained"
          sx={{ mt: 2, bgcolor: '#2ECC71', '&:hover': { bgcolor: '#27AE60' } }}
          disabled={!complete}
        >
          Meta SMART lista
        </Button>
      </Box>
    </LessonShell>
  );
}
