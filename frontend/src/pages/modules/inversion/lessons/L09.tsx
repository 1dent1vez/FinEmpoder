import { useEffect, useMemo, useState } from 'react';
import { Box, Paper, Stack, Typography, Slider, Alert, Button, Chip } from '@mui/material';
import ScatterPlotIcon from '@mui/icons-material/ScatterPlot';
import LessonShell from '../LessonShell';
import { lessonProgressRepository } from '../../../../db/lessonProgress.repository';

type Split = { deuda: number; variable: number; liquidez: number };

function clampSplit(d: number, v: number): Split {
  const deuda = Math.max(0, Math.min(100, d));
  const variable = Math.max(0, Math.min(100 - deuda, v));
  const liquidez = Math.max(0, 100 - (deuda + variable));
  return { deuda, variable, liquidez };
}

export default function L09() {
  const [split, setSplit] = useState<Split>(() => clampSplit(50, 30));
  const balanced =
    split.deuda >= 30 && split.liquidez >= 10 && split.variable >= 20 && split.variable <= 50;

  const donut = useMemo(
    () => ({
      width: 180,
      height: 180,
      borderRadius: '50%',
      background: `conic-gradient(#F5B041 0 ${split.deuda}%,
                                 #B39DDB ${split.deuda}% ${split.deuda + split.variable}%,
                                 #81C784 ${split.deuda + split.variable}% 100%)`,
      boxShadow: '0 6px 18px rgba(0,0,0,.12)'
    }),
    [split]
  );

  useEffect(() => {
    if (!balanced) return;
    lessonProgressRepository
      .setCompleted('inversion', 'L09')
      .catch((err) => console.error('Error guardando progreso offline L09', err));
  }, [balanced]);

  return (
    <LessonShell
      id="L09"
      title="Diversificación inteligente"
      completeWhen={balanced}
      nextPath="/app/inversion/lesson/L10"
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
            <ScatterPlotIcon color="warning" />
            <Typography fontWeight={800}>Simulador de portafolio</Typography>
          </Stack>
          <Typography variant="body2" color="text.secondary">
            Ajusta deuda, renta variable y liquidez. Completa cuando tu mezcla tenga al menos 30% deuda,
            10% liquidez y 20%-50% variable (perfil moderado).
          </Typography>
        </Paper>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center" sx={{ mb: 2 }}>
          <Box sx={donut} />
          <Stack spacing={1.5} sx={{ flex: 1, width: '100%' }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Chip size="small" sx={{ bgcolor: '#F5B041' }} label="Deuda" />
              <Typography fontWeight={800}>{split.deuda.toFixed(0)}%</Typography>
            </Stack>
            <Slider
              value={split.deuda}
              onChange={(_, v) => setSplit((s) => clampSplit(Number(v), s.variable))}
              min={0}
              max={100}
              valueLabelDisplay="auto"
              sx={{ '& .MuiSlider-thumb': { bgcolor: '#F5B041' }, '& .MuiSlider-track': { bgcolor: '#F5B041' } }}
            />

            <Stack direction="row" spacing={1} alignItems="center">
              <Chip size="small" sx={{ bgcolor: '#B39DDB', color: '#1a1a1a' }} label="Renta variable" />
              <Typography fontWeight={800}>{split.variable.toFixed(0)}%</Typography>
            </Stack>
            <Slider
              value={split.variable}
              onChange={(_, v) => setSplit((s) => clampSplit(s.deuda, Number(v)))}
              min={0}
              max={100 - split.deuda}
              valueLabelDisplay="auto"
              sx={{ '& .MuiSlider-thumb': { bgcolor: '#B39DDB' }, '& .MuiSlider-track': { bgcolor: '#B39DDB' } }}
            />

            <Stack direction="row" spacing={1} alignItems="center">
              <Chip size="small" sx={{ bgcolor: '#81C784' }} label="Liquidez" />
              <Typography fontWeight={800}>{split.liquidez.toFixed(0)}%</Typography>
            </Stack>
            <Typography variant="caption" color="text.secondary">
              Liquidez se ajusta automáticamente con el resto.
            </Typography>

            <Button
              variant="outlined"
              onClick={() => setSplit(clampSplit(50, 30))}
              sx={{ alignSelf: 'flex-start' }}
            >
              Aplicar 50/30/20
            </Button>
          </Stack>
        </Stack>

        <Alert severity={balanced ? 'success' : 'info'} variant="outlined">
          {balanced
            ? 'Diversificación moderada lograda. Reduce riesgo manteniendo liquidez.'
            : 'Mueve los controles hasta cumplir con deuda ≥30%, liquidez ≥10% y variable 20%-50%.'}
        </Alert>
      </Box>
    </LessonShell>
  );
}
