import { useEffect, useMemo, useState } from 'react';
import { Box, Paper, Stack, Typography, Slider, Alert } from '@mui/material';
import TimelineIcon from '@mui/icons-material/Timeline';
import LessonShell from '../LessonShell';
import { lessonProgressRepository } from '../../../../db/lessonProgress.repository';

export default function L07() {
  const [exposicion, setExposicion] = useState(50);

  const metrics = useMemo(() => {
    const potencial = (exposicion / 100) * 18 + 2; // 2% base + riesgo
    const volatilidad = (exposicion / 100) * 20 + 5;
    return { potencial, volatilidad };
  }, [exposicion]);

  const rangoEquilibrado = exposicion >= 40 && exposicion <= 60;

  useEffect(() => {
    if (!rangoEquilibrado) return;
    lessonProgressRepository
      .setCompleted('inversion', 'L07')
      .catch((err) => console.error('Error guardando progreso offline L07', err));
  }, [rangoEquilibrado]);

  return (
    <LessonShell
      id="L07"
      title="Instrumentos de renta variable: fondos y acciones"
      completeWhen={rangoEquilibrado}
      nextPath="/app/inversion/lesson/L08"
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
            <TimelineIcon color="warning" />
            <Typography fontWeight={800}>Fondos y acciones</Typography>
          </Stack>
          <Typography variant="body2" color="text.secondary">
            Ajusta la exposición a renta variable y observa el impacto en rendimiento potencial y
            volatilidad estimada. Equilibra entre 40% y 60% para este ejemplo moderado.
          </Typography>
        </Paper>

        <Paper sx={{ p: 2, borderRadius: 3 }}>
          <Stack direction="row" justifyContent="space-between">
            <Typography fontWeight={700}>Exposición a renta variable</Typography>
            <Typography fontWeight={800}>{exposicion}%</Typography>
          </Stack>
          <Slider
            value={exposicion}
            onChange={(_, v) => setExposicion(Number(v))}
            min={0}
            max={100}
            step={5}
            sx={{
              mt: 1,
              '& .MuiSlider-thumb': { bgcolor: '#F5B041' },
              '& .MuiSlider-track': { bgcolor: '#F5B041' }
            }}
          />
          <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
            <Paper sx={{ p: 1.5, borderRadius: 3, flex: 1 }}>
              <Typography variant="caption" color="text.secondary">
                Rendimiento potencial anual
              </Typography>
              <Typography variant="h6" fontWeight={900}>
                ~{metrics.potencial.toFixed(1)}%
              </Typography>
            </Paper>
            <Paper sx={{ p: 1.5, borderRadius: 3, flex: 1 }}>
              <Typography variant="caption" color="text.secondary">
                Volatilidad estimada
              </Typography>
              <Typography variant="h6" fontWeight={900}>
                ~{metrics.volatilidad.toFixed(1)}%
              </Typography>
            </Paper>
          </Stack>
        </Paper>

        <Alert sx={{ mt: 2 }} severity={rangoEquilibrado ? 'success' : 'info'} variant="outlined">
          {rangoEquilibrado
            ? 'Buen balance. Fondos/acciones en 40-60% mantienen potencial sin exceder tu tolerancia moderada.'
            : 'Mueve el control hasta un rango moderado (40%-60%) para completar.'}
        </Alert>
      </Box>
    </LessonShell>
  );
}
