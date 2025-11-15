import { useMemo, useState } from 'react';
import { Box, Paper, Stack, Typography, Slider, Chip, Button, Alert } from '@mui/material';
import LessonShell from '../LessonShell';
import { useLessons } from '../../../../store/lessons';

const ORANGE = '#F5B041';

type Split = { needs: number; wants: number; savings: number };

function clampSplit(n: number, w: number): Split {
  // n y w dentro [0,100], ahorro es el resto y nunca negativo
  const needs = Math.max(0, Math.min(100, n));
  const wants = Math.max(0, Math.min(100 - needs, w));
  const savings = Math.max(0, 100 - (needs + wants));
  return { needs, wants, savings };
}

export default function L09() {
  const income = 10000;          // ingreso de ejemplo (editable si quieres)
  const [split, setSplit] = useState<Split>(() => clampSplit(50, 30));
  const { complete } = useLessons();

  const pesos = useMemo(() => ({
    needs: (income * split.needs) / 100,
    wants: (income * split.wants) / 100,
    savings: (income * split.savings) / 100,
  }), [income, split]);

  // Criterio de finalización: aproximación a 50/30/20 ±2%
  const within = (val: number, target: number, tol = 2) => Math.abs(val - target) <= tol;
  const isRecommended = within(split.needs, 50) && within(split.wants, 30) && within(split.savings, 20);

  const donutStyle = {
    width: 180,
    height: 180,
    borderRadius: '50%',
    background: `conic-gradient(#FFB84D 0 ${split.needs}%,
                                 #B39DDB ${split.needs}% ${split.needs + split.wants}%,
                                 #81C784 ${split.needs + split.wants}% 100%)`,
    boxShadow: '0 6px 18px rgba(0,0,0,.12)',
  } as const;

  return (
    <LessonShell
      id="L09"
      title="La regla 50-30-20"
      // detección automática: recomendado ≙ completo
      completeWhen={isRecommended}
      nextPath="/app/presupuesto/lesson/L10"     // si aún no existe, te llevará al overview
      overviewPath="/app/presupuesto"
    >
      <Box sx={{ p: 1 }}>
        <Paper sx={{ p: 2, borderRadius: 3, borderLeft: `6px solid ${ORANGE}`, bgcolor: '#FFF8E1', mb: 2 }}>
          <Typography fontWeight={800} sx={{ mb: .5 }}>Distribuye tus ingresos racionalmente</Typography>
          <Typography variant="body2" color="text.secondary">
            La guía 50-30-20 sugiere dedicar 50% a necesidades, 30% a gustos y 20% al ahorro/meta.
            Ajusta los controles hasta acercarte al reparto recomendado. Se completa cuando llegues
            a la distribución objetivo con una tolerancia de ±2%.
          </Typography>
        </Paper>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center" sx={{ mb: 2 }}>
          <Box sx={donutStyle} />
          <Stack spacing={1}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Chip size="small" sx={{ bgcolor: '#FFB84D' }} label="Necesidades" />
              <Typography fontWeight={700}>{split.needs.toFixed(0)}%</Typography>
              <Typography variant="body2" color="text.secondary">≈ ${pesos.needs.toFixed(0)}</Typography>
            </Stack>
            <Slider
              value={split.needs}
              onChange={(_, v) => setSplit(s => clampSplit(Number(v), s.wants))}
              min={0}
              max={100}
              valueLabelDisplay="auto"
              sx={{ '& .MuiSlider-thumb': { bgcolor: '#FFB84D' }, '& .MuiSlider-track': { bgcolor: '#FFB84D' } }}
            />

            <Stack direction="row" spacing={1} alignItems="center">
              <Chip size="small" sx={{ bgcolor: '#B39DDB', color: '#1a1a1a' }} label="Gustos" />
              <Typography fontWeight={700}>{split.wants.toFixed(0)}%</Typography>
              <Typography variant="body2" color="text.secondary">≈ ${pesos.wants.toFixed(0)}</Typography>
            </Stack>
            <Slider
              value={split.wants}
              onChange={(_, v) => setSplit(s => clampSplit(s.needs, Number(v)))}
              min={0}
              max={100 - split.needs}
              valueLabelDisplay="auto"
              sx={{ '& .MuiSlider-thumb': { bgcolor: '#B39DDB' }, '& .MuiSlider-track': { bgcolor: '#B39DDB' } }}
            />

            <Stack direction="row" spacing={1} alignItems="center">
              <Chip size="small" sx={{ bgcolor: '#81C784' }} label="Ahorro / Metas" />
              <Typography fontWeight={700}>{split.savings.toFixed(0)}%</Typography>
              <Typography variant="body2" color="text.secondary">≈ ${pesos.savings.toFixed(0)}</Typography>
            </Stack>

            <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }}>
              <Button
                variant="outlined"
                onClick={() => setSplit(clampSplit(50, 30))}
              >
                Aplicar 50-30-20
              </Button>
              <Button
                variant="contained"
                onClick={() => complete('L09', isRecommended ? 100 : 80)}
              >
                Guardar reparto
              </Button>
            </Stack>
          </Stack>
        </Stack>

        {isRecommended ? (
          <Alert severity="success" variant="outlined">
            Excelente. Estás dentro de la regla 50-30-20. Puedes avanzar a la siguiente lección o volver al menú.
          </Alert>
        ) : (
          <Alert severity="info" variant="outlined">
            Ajusta los deslizadores hasta acercarte a 50% / 30% / 20%. El anillo refleja el reparto actual.
          </Alert>
        )}

        <Paper sx={{ p: 2, mt: 2, borderRadius: 3 }}>
          <Typography fontWeight={800} sx={{ mb: .5 }}>Pistas rápidas</Typography>
          <Typography variant="body2" color="text.secondary">
            Si tus “necesidades” superan 50%, identifica oportunidades: vivienda compartida, plan de datos más
            económico, transporte alternativo. Si “gustos” rebasan 30%, fija límites por categoría y usa
            recordatorios semanales.
          </Typography>
        </Paper>
      </Box>
    </LessonShell>
  );
}
