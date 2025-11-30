import { useEffect, useMemo, useState } from 'react';
import { Box, Paper, Stack, Typography, Slider, Button, Alert } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import LessonShell from '../LessonShell';
import { lessonProgressRepository } from '../../../../db/lessonProgress.repository';

export default function L12() {
  const [nominal, setNominal] = useState(10);
  const [inflacion, setInflacion] = useState(6);
  const [calculado, setCalculado] = useState(false);

  const real = useMemo(() => {
    const factor = (1 + nominal / 100) / (1 + inflacion / 100);
    return (factor - 1) * 100;
  }, [nominal, inflacion]);

  useEffect(() => {
    if (!calculado) return;
    lessonProgressRepository
      .setCompleted('inversion', 'L12')
      .catch((err) => console.error('Error guardando progreso offline L12', err));
  }, [calculado]);

  return (
    <LessonShell
      id="L12"
      title="Inflación y rendimiento real"
      completeWhen={calculado}
      nextPath="/app/inversion/lesson/L13"
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
            <TrendingUpIcon color="warning" />
            <Typography fontWeight={800}>Mini-simulador</Typography>
          </Stack>
          <Typography variant="body2" color="text.secondary">
            Ajusta la tasa nominal de tu inversión y la inflación estimada. Calcula el rendimiento real.
          </Typography>
        </Paper>

        <Paper sx={{ p: 2, borderRadius: 3 }}>
          <Stack direction="row" justifyContent="space-between">
            <Typography fontWeight={700}>Rendimiento nominal (%)</Typography>
            <Typography>{nominal}%</Typography>
          </Stack>
          <Slider
            value={nominal}
            onChange={(_, v) => setNominal(Number(v))}
            min={2}
            max={20}
            step={0.5}
            valueLabelDisplay="auto"
            sx={{ mt: 1, '& .MuiSlider-thumb': { bgcolor: '#F5B041' }, '& .MuiSlider-track': { bgcolor: '#F5B041' } }}
          />

          <Stack direction="row" justifyContent="space-between" sx={{ mt: 2 }}>
            <Typography fontWeight={700}>Inflación anual (%)</Typography>
            <Typography>{inflacion}%</Typography>
          </Stack>
          <Slider
            value={inflacion}
            onChange={(_, v) => setInflacion(Number(v))}
            min={0}
            max={15}
            step={0.5}
            valueLabelDisplay="auto"
            sx={{ mt: 1, '& .MuiSlider-thumb': { bgcolor: '#F5B041' }, '& .MuiSlider-track': { bgcolor: '#F5B041' } }}
          />
        </Paper>

        <Button
          variant="contained"
          onClick={() => setCalculado(true)}
          sx={{ mt: 2, bgcolor: '#F5B041', '&:hover': { bgcolor: '#F39C12' } }}
        >
          Calcular rendimiento real
        </Button>

        {calculado && (
          <Alert
            severity={real >= 0 ? 'success' : 'warning'}
            variant="outlined"
            sx={{ mt: 2 }}
          >
            Rendimiento real aproximado: {real.toFixed(2)}%.{' '}
            {real >= 0
              ? 'Superas la inflación, tu dinero gana poder adquisitivo.'
              : 'Estás perdiendo poder adquisitivo; busca mayor rendimiento o menor comisión.'}
          </Alert>
        )}
      </Box>
    </LessonShell>
  );
}
