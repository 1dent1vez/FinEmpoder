import { useMemo, useState } from 'react';
import {
  Box,
  Paper,
  Stack,
  Typography,
  TextField,
  Slider,
  LinearProgress,
  Chip
} from '@mui/material';
import LessonShell from '../LessonShell';

export default function L10() {
  const [principal, setPrincipal] = useState(2000);
  const [rate, setRate] = useState(8);
  const [years, setYears] = useState(3);

  const simple = useMemo(() => principal * (1 + (rate / 100) * years), [principal, rate, years]);
  const compound = useMemo(
    () => principal * Math.pow(1 + rate / 100, years),
    [principal, rate, years]
  );
  const extra = compound - simple;

  const ready = principal > 0 && rate > 0 && years > 0;

  return (
    <LessonShell
      id="L10"
      title="Interes simple vs. compuesto"
      completeWhen={ready}
      nextPath="/app/ahorro/lesson/L11"
      overviewPath="/app/ahorro"
    >
      <Box sx={{ p: 1 }}>
        <LinearProgress
          variant="determinate"
          value={ready ? 100 : 70}
          sx={{
            mb: 2,
            height: 8,
            borderRadius: 5,
            bgcolor: '#f0f0f0',
            '& .MuiLinearProgress-bar': { bgcolor: '#3498DB' }
          }}
        />

        <Paper
          sx={{
            p: 2,
            borderRadius: 3,
            bgcolor: '#EAF6FF',
            borderLeft: '6px solid #3498DB',
            mb: 2
          }}
        >
          <Typography variant="body1">
            Ajusta monto, tasa y anos. Observa como crece el compuesto al reinvertir intereses.
          </Typography>
        </Paper>

        <Stack spacing={1.25}>
          <TextField
            label="Aporte inicial (MXN)"
            type="number"
            value={principal}
            onChange={(e) => setPrincipal(Number(e.target.value))}
            inputProps={{ min: 0, step: 100 }}
          />
          <Typography variant="body2" color="text.secondary">
            Tasa anual: {rate}%
          </Typography>
          <Slider value={rate} min={1} max={20} step={0.5} onChange={(_, v) => setRate(v as number)} valueLabelDisplay="auto" />
          <Typography variant="body2" color="text.secondary">
            Plazo (anos): {years}
          </Typography>
          <Slider value={years} min={1} max={10} step={1} onChange={(_, v) => setYears(v as number)} valueLabelDisplay="auto" />
        </Stack>

        <Paper sx={{ p: 2, borderRadius: 3, mt: 2 }}>
          <Typography fontWeight={700}>Resultados</Typography>
          <Stack direction="row" justifyContent="space-between">
            <Typography>Interes simple</Typography>
            <Typography fontWeight={700}>${simple.toFixed(2)}</Typography>
          </Stack>
          <Stack direction="row" justifyContent="space-between">
            <Typography>Interes compuesto</Typography>
            <Typography fontWeight={900} color="primary">
              ${compound.toFixed(2)}
            </Typography>
          </Stack>
          <Chip
            sx={{ mt: 1 }}
            color="success"
            label={`El compuesto gana $${extra.toFixed(2)} adicionales`}
          />
        </Paper>
      </Box>
    </LessonShell>
  );
}
