import { useState, useMemo } from 'react';
import {
  Box,
  Paper,
  Stack,
  Typography,
  Slider,
  ToggleButtonGroup,
  ToggleButton,
  Chip,
  Button
} from '@mui/material';
import LessonShell from '../LessonShell';

type Strategy = 'porcentaje' | 'monto';

export default function L07() {
  const [avgIncome, setAvgIncome] = useState(6000);
  const [lowIncome, setLowIncome] = useState(4000);
  const [strategy, setStrategy] = useState<Strategy>('porcentaje');
  const [confirmed, setConfirmed] = useState(false);

  const reserveBase = useMemo(() => Math.min(avgIncome, lowIncome) * 0.1, [avgIncome, lowIncome]);
  const suggested = useMemo(() => {
    return strategy === 'porcentaje' ? Math.round(avgIncome * 0.15) : Math.round(reserveBase + 300);
  }, [avgIncome, reserveBase, strategy]);

  const ready = confirmed;

  return (
    <LessonShell
      id="L07"
      title="Ingresos variables: como ahorrar igual"
      completeWhen={ready}
      nextPath="/app/ahorro/lesson/L08"
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
            Define una estrategia para ahorrar aun cuando tu ingreso cambia. Usa un porcentaje fijo
            o un monto base protegido de tus meses mas bajos.
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            <Chip label="Porcentaje fijo" size="small" />
            <Chip label="Monto base" size="small" />
            <Chip label="Prioriza meses buenos" size="small" />
          </Stack>
        </Paper>

        <Stack spacing={1.5}>
          <Typography variant="body2" color="text.secondary">
            Ingreso promedio: ${avgIncome}
          </Typography>
          <Slider
            value={avgIncome}
            min={3000}
            max={12000}
            step={250}
            onChange={(_, v) => setAvgIncome(v as number)}
            valueLabelDisplay="auto"
          />

          <Typography variant="body2" color="text.secondary">
            Mes mas bajo estimado: ${lowIncome}
          </Typography>
          <Slider
            value={lowIncome}
            min={2000}
            max={10000}
            step={250}
            onChange={(_, v) => setLowIncome(v as number)}
            valueLabelDisplay="auto"
          />

          <ToggleButtonGroup
            exclusive
            value={strategy}
            onChange={(_, v) => v && setStrategy(v)}
            sx={{
              '& .MuiToggleButton-root.Mui-selected': { bgcolor: '#3498DB', color: '#fff' }
            }}
          >
            <ToggleButton value="porcentaje">Ahorrar porcentaje</ToggleButton>
            <ToggleButton value="monto">Monto base minimo</ToggleButton>
          </ToggleButtonGroup>

          <Paper sx={{ p: 2, borderRadius: 3 }}>
            <Typography fontWeight={700}>Plan sugerido</Typography>
            <Typography variant="body2" color="text.secondary">
              Reserva base desde tu ingreso mas bajo: ${reserveBase.toFixed(0)}.
            </Typography>
            <Typography fontWeight={800} sx={{ mt: 0.5 }}>
              Deposita ${suggested} cada mes.
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Si el mes es bueno, sube 5% adicional; si es bajo, mantente en este minimo.
            </Typography>
          </Paper>

          <Button
            variant="contained"
            sx={{ bgcolor: '#2ECC71', '&:hover': { bgcolor: '#27AE60' } }}
            onClick={() => setConfirmed(true)}
          >
            Confirmar estrategia
          </Button>
        </Stack>
      </Box>
    </LessonShell>
  );
}
