import { useMemo, useState } from 'react';
import {
  Box,
  Paper,
  Stack,
  Typography,
  TextField,
  MenuItem,
  Button,
  Chip,
  LinearProgress
} from '@mui/material';
import LessonShell from '../LessonShell';

const methods = ['transferencia automatica', 'apartado en app', 'deposito en efectivo'] as const;

export default function L15() {
  const [goal, setGoal] = useState('Laptop para la escuela');
  const [amount, setAmount] = useState(8000);
  const [months, setMonths] = useState(8);
  const [day, setDay] = useState(10);
  const [method, setMethod] = useState<typeof methods[number]>('transferencia automatica');
  const [confirmed, setConfirmed] = useState(false);

  const monthly = useMemo(() => (months > 0 ? amount / months : 0), [amount, months]);
  const complete = confirmed && amount > 0 && months > 0;

  return (
    <LessonShell
      id="L15"
      title="Reto final: tu meta alcanzable"
      completeWhen={complete}
      overviewPath="/app/ahorro"
    >
      <Box sx={{ p: 1 }}>
        <LinearProgress
          variant="determinate"
          value={confirmed ? 100 : 60}
          sx={{
            mb: 2,
            height: 8,
            borderRadius: 5,
            bgcolor: '#f0f0f0',
            '& .MuiLinearProgress-bar': { bgcolor: '#2ECC71' }
          }}
        />

        <Paper
          sx={{
            p: 2,
            borderRadius: 3,
            bgcolor: '#E8F6E9',
            borderLeft: '6px solid #2ECC71',
            mb: 2
          }}
        >
          <Typography variant="body1">
            Cierra el modulo con un plan concreto: meta, monto mensual y automatizacion.
          </Typography>
        </Paper>

        <Stack spacing={1.25}>
          <TextField label="Meta" value={goal} onChange={(e) => setGoal(e.target.value)} />
          <TextField
            label="Monto total (MXN)"
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            inputProps={{ min: 0, step: 100 }}
          />
          <TextField
            label="Meses"
            type="number"
            value={months}
            onChange={(e) => setMonths(Number(e.target.value))}
            inputProps={{ min: 1, max: 18 }}
          />
          <TextField select label="Dia de abono" value={day} onChange={(e) => setDay(Number(e.target.value))}>
            {[1, 5, 10, 15, 20, 25].map((d) => (
              <MenuItem key={d} value={d}>
                Dia {d} de cada mes
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Metodo"
            value={method}
            onChange={(e) => setMethod(e.target.value as typeof methods[number])}
          >
            {methods.map((m) => (
              <MenuItem key={m} value={m}>
                {m}
              </MenuItem>
            ))}
          </TextField>
        </Stack>

        <Paper sx={{ p: 2, borderRadius: 3, mt: 2 }}>
          <Typography fontWeight={700}>Resumen</Typography>
          <Typography variant="body2" color="text.secondary">
            Ahorraras aproximadamente ${monthly.toFixed(2)} cada mes el dia {day} via {method}.
          </Typography>
          <Stack direction="row" spacing={1} sx={{ mt: 1 }} flexWrap="wrap">
            <Chip label="Meta clara" />
            <Chip label="Automatizado" color="success" variant="outlined" />
            <Chip label="Revisar cada mes" />
          </Stack>
        </Paper>

        <Button
          fullWidth
          variant="contained"
          sx={{ mt: 2, bgcolor: '#2ECC71', '&:hover': { bgcolor: '#27AE60' } }}
          onClick={() => setConfirmed(true)}
        >
          Guardar mi plan (simulado)
        </Button>
      </Box>
    </LessonShell>
  );
}
