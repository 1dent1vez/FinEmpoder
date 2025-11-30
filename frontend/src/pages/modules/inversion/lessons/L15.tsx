import { useEffect, useMemo, useState } from 'react';
import { Box, Paper, Stack, Typography, Slider, Button, Alert, Chip } from '@mui/material';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import LessonShell from '../LessonShell';
import { lessonProgressRepository } from '../../../../db/lessonProgress.repository';

type Mix = { deuda: number; variable: number; liquidez: number };

function clampMix(d: number, v: number): Mix {
  const deuda = Math.max(0, Math.min(100, d));
  const variable = Math.max(0, Math.min(100 - deuda, v));
  const liquidez = Math.max(0, 100 - (deuda + variable));
  return { deuda, variable, liquidez };
}

export default function L15() {
  const [mix, setMix] = useState<Mix>(() => clampMix(40, 40));
  const [confirmado, setConfirmado] = useState(false);

  const requisitos =
    mix.deuda >= 30 &&
    mix.deuda <= 60 &&
    mix.variable >= 30 &&
    mix.variable <= 50 &&
    mix.liquidez >= 10;

  const potencial = useMemo(() => {
    const rDeuda = 6;
    const rVar = 12;
    const rLiq = 3;
    return (mix.deuda * rDeuda + mix.variable * rVar + mix.liquidez * rLiq) / 100;
  }, [mix]);

  const completado = requisitos && confirmado;

  useEffect(() => {
    if (!completado) return;
    lessonProgressRepository
      .setCompleted('inversion', 'L15')
      .catch((err) => console.error('Error guardando progreso offline L15', err));
  }, [completado]);

  const confirmar = () => {
    if (requisitos) setConfirmado(true);
  };

  return (
    <LessonShell
      id="L15"
      title="Reto final: tu primera inversión simulada"
      completeWhen={completado}
      overviewPath="/app/inversion"
    >
      <Box sx={{ p: 1 }}>
        <Paper
          sx={{
            p: 2,
            mb: 2,
            borderRadius: 3,
            bgcolor: '#FFF8E1',
            borderLeft: '6px solid #F5B041'
          }}
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <SportsEsportsIcon color="warning" />
            <Typography fontWeight={800}>Simulador gamificado</Typography>
          </Stack>
          <Typography variant="body2" color="text.secondary">
            Distribuye $10,000 simulados en deuda, renta variable y liquidez. Cumple el reto:
            diversificación balanceada y liquidez mínima.
          </Typography>
        </Paper>

        <Stack spacing={1.5}>
          <Paper sx={{ p: 2, borderRadius: 3 }}>
            <Stack direction="row" justifyContent="space-between">
              <Typography fontWeight={800}>Deuda (CETES/bonos)</Typography>
              <Typography fontWeight={800}>{mix.deuda.toFixed(0)}%</Typography>
            </Stack>
            <Slider
              value={mix.deuda}
              onChange={(_, v) => setMix((m) => clampMix(Number(v), m.variable))}
              min={0}
              max={100}
              step={5}
              valueLabelDisplay="auto"
              sx={{ '& .MuiSlider-thumb': { bgcolor: '#F5B041' }, '& .MuiSlider-track': { bgcolor: '#F5B041' } }}
            />
          </Paper>

          <Paper sx={{ p: 2, borderRadius: 3 }}>
            <Stack direction="row" justifyContent="space-between">
              <Typography fontWeight={800}>Renta variable (fondos/acciones)</Typography>
              <Typography fontWeight={800}>{mix.variable.toFixed(0)}%</Typography>
            </Stack>
            <Slider
              value={mix.variable}
              onChange={(_, v) => setMix((m) => clampMix(m.deuda, Number(v)))}
              min={0}
              max={100 - mix.deuda}
              step={5}
              valueLabelDisplay="auto"
              sx={{ '& .MuiSlider-thumb': { bgcolor: '#F5B041' }, '& .MuiSlider-track': { bgcolor: '#F5B041' } }}
            />
          </Paper>

          <Paper sx={{ p: 2, borderRadius: 3 }}>
            <Typography fontWeight={800}>Liquidez resultante</Typography>
            <Typography fontWeight={900} color={mix.liquidez >= 10 ? '#27AE60' : '#C0392B'}>
              {mix.liquidez.toFixed(0)}%
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Liquidez se ajusta con el resto. Asegura mínimo 10%.
            </Typography>
          </Paper>

          <Paper sx={{ p: 2, borderRadius: 3 }}>
            <Typography fontWeight={700}>Rendimiento potencial anual</Typography>
            <Typography variant="h5" fontWeight={900}>{potencial.toFixed(1)}%</Typography>
            <Typography variant="caption" color="text.secondary">
              Estimado combinando renta variable (12%), deuda (6%) y liquidez (3%).
            </Typography>
          </Paper>

          <Stack direction="row" spacing={1}>
            <Chip label="Requisito: Deuda 30%-60%" color={mix.deuda >= 30 && mix.deuda <= 60 ? 'success' : 'default'} />
            <Chip label="Renta variable 30%-50%" color={mix.variable >= 30 && mix.variable <= 50 ? 'success' : 'default'} />
            <Chip label="Liquidez ≥10%" color={mix.liquidez >= 10 ? 'success' : 'default'} />
          </Stack>

          <Button
            variant="contained"
            onClick={confirmar}
            disabled={!requisitos}
            sx={{ bgcolor: '#F5B041', '&:hover': { bgcolor: '#F39C12' } }}
          >
            Confirmar inversión simulada
          </Button>

          <Alert
            severity={completado ? 'success' : 'info'}
            variant="outlined"
          >
            {completado
              ? '¡Reto superado! Tu primera inversión simulada está balanceada.'
              : 'Ajusta hasta cumplir los requisitos y confirma para completar el reto.'}
          </Alert>
        </Stack>
      </Box>
    </LessonShell>
  );
}
