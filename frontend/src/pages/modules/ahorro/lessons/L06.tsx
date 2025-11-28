import { useMemo, useState } from 'react';
import {
  Box,
  Paper,
  Stack,
  Typography,
  TextField,
  Chip,
  LinearProgress,
  Slider
} from '@mui/material';
import LessonShell from '../LessonShell';

export default function L06() {
  const [essentials, setEssentials] = useState(4000);
  const [extras, setExtras] = useState(1200);
  const [monthlyDeposit, setMonthlyDeposit] = useState(1500);

  const monthlyTotal = useMemo(() => essentials + extras, [essentials, extras]);
  const targets = useMemo(
    () => ({
      one: monthlyTotal * 1,
      three: monthlyTotal * 3,
      six: monthlyTotal * 6
    }),
    [monthlyTotal]
  );

  const monthsToGoal = useMemo(() => {
    if (monthlyDeposit <= 0) return { one: Infinity, three: Infinity, six: Infinity };
    return {
      one: Math.ceil(targets.one / monthlyDeposit),
      three: Math.ceil(targets.three / monthlyDeposit),
      six: Math.ceil(targets.six / monthlyDeposit)
    };
  }, [monthlyDeposit, targets]);

  const ready = monthlyTotal > 0 && monthlyDeposit > 0;

  return (
    <LessonShell
      id="L06"
      title="Plan 1-3-6 (fondo de emergencia)"
      completeWhen={ready}
      nextPath="/app/ahorro/lesson/L07"
      overviewPath="/app/ahorro"
    >
      <Box sx={{ p: 1 }}>
        <Paper
          sx={{
            p: 2,
            borderRadius: 3,
            bgcolor: '#EAF6FF',
            borderLeft: '6px solid #3498DB',
            mb: 2
          }}
        >
          <Typography variant="body1" sx={{ mb: 1 }}>
            Calcula cuanto necesitas ahorrar para cubrir 1, 3 y 6 meses de gastos. Ajusta tu aporte
            mensual para ver en cuantos meses llegas.
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            <Chip label="1 mes = apagar incendios" size="small" />
            <Chip label="3 meses = transicion segura" size="small" />
            <Chip label="6 meses = blindaje total" size="small" />
          </Stack>
        </Paper>

        <Stack spacing={1.25}>
          <TextField
            label="Gasto mensual esencial (renta, servicios, comida)"
            type="number"
            value={essentials}
            onChange={(e) => setEssentials(Number(e.target.value))}
            inputProps={{ min: 0, step: 100 }}
          />
          <TextField
            label="Gasto mensual variable (transporte, ocio)"
            type="number"
            value={extras}
            onChange={(e) => setExtras(Number(e.target.value))}
            inputProps={{ min: 0, step: 100 }}
          />

          <TextField
            label="Deposito mensual para el fondo"
            type="number"
            value={monthlyDeposit}
            onChange={(e) => setMonthlyDeposit(Number(e.target.value))}
            inputProps={{ min: 0, step: 50 }}
          />
          <Slider
            value={monthlyDeposit}
            min={500}
            max={8000}
            step={100}
            onChange={(_, v) => setMonthlyDeposit(v as number)}
            valueLabelDisplay="auto"
          />
        </Stack>

        <Paper sx={{ p: 2, borderRadius: 3, mt: 2 }}>
          <Typography fontWeight={700}>Fondos objetivo</Typography>
          <Stack spacing={1}>
            <Row label="1 mes" amount={targets.one} months={monthsToGoal.one} />
            <Row label="3 meses" amount={targets.three} months={monthsToGoal.three} />
            <Row label="6 meses" amount={targets.six} months={monthsToGoal.six} />
          </Stack>
          <LinearProgress
            variant="determinate"
            value={Math.min(100, Math.round((monthlyDeposit / monthlyTotal) * 100))}
            sx={{
              mt: 2,
              height: 8,
              borderRadius: 5,
              bgcolor: '#f0f0f0',
              '& .MuiLinearProgress-bar': { bgcolor: '#2ECC71' }
            }}
          />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Con tu deposito mensual actual cubres aproximadamente{' '}
            {Math.min(100, Math.round((monthlyDeposit / monthlyTotal) * 100))}% de un mes de gastos.
          </Typography>
        </Paper>
      </Box>
    </LessonShell>
  );
}

function Row({ label, amount, months }: { label: string; amount: number; months: number }) {
  const feasible = months !== Infinity && months <= 18;
  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center">
      <Typography>{label}</Typography>
      <Stack direction="row" spacing={1} alignItems="center">
        <Typography fontWeight={800}>${amount.toFixed(2)}</Typography>
        <Chip
          size="small"
          color={feasible ? 'success' : 'warning'}
          label={months === Infinity ? 'Ajusta deposito' : `${months} meses`}
        />
      </Stack>
    </Stack>
  );
}
