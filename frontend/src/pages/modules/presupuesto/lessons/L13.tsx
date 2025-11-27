import { useMemo, useState } from 'react';
import {
  Box, Paper, Stack, Typography, Chip, Button, LinearProgress, Divider
} from '@mui/material';
import PsychologyIcon from '@mui/icons-material/Psychology';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import ReplayIcon from '@mui/icons-material/Replay';
import LessonShell from '../LessonShell';
import { useLessons } from '../../../../store/lessons';
import { lessonProgressRepository } from '../../../../db/lessonProgress.repository';
import { useEffect } from 'react';

type Strength = { label: string; reason: string };
type Advice = { label: string; action: string; goTo?: string };

export default function L13() {
  const { lessons, complete } = useLessons();
  const [ack, setAck] = useState(false);

  // Progreso global del módulo
  const moduleProgress = useLessons(s => s.moduleProgress);

  // Últimas lecciones evaluables (L06–L12) para detectar áreas débiles
  const recent = useMemo(
    () => lessons.filter(l => /^L0[6-9]|^L1[0-2]/.test(l.id)),
    [lessons]
  );

  const completed = recent.filter(l => l.completed && typeof l.score === 'number');
  const avg = completed.length
    ? Math.round(completed.reduce((a, b) => a + (b.score ?? 0), 0) / completed.length)
    : 0;

  // Detecta la “más débil” para sugerir repaso
  const weakest = useMemo(() => {
    const evals = completed
      .map(l => ({ id: l.id, title: l.title, score: l.score as number }))
      .sort((a, b) => a.score - b.score);
    return evals[0];
  }, [completed]);

  // Fortalezas y recomendaciones rápidas
  const strengths: Strength[] = useMemo(() => {
    const out: Strength[] = [];
    if ((lessons.find(l => l.id === 'L05')?.completed)) {
      out.push({ label: 'Clasificación de gastos', reason: 'Definiste categorías y límites.' });
    }
    if ((lessons.find(l => l.id === 'L06')?.completed)) {
      out.push({ label: 'Balance mensual', reason: 'Calculaste superávit/déficit.' });
    }
    if ((lessons.find(l => l.id === 'L09')?.completed)) {
      out.push({ label: 'Regla 50/30/20', reason: 'Distribuiste ingresos de forma racional.' });
    }
    return out.length ? out : [{ label: 'Buen inicio', reason: 'Ya tienes progreso registrado.' }];
  }, [lessons]);

  const advices: Advice[] = useMemo(() => {
    const a: Advice[] = [];
    if (weakest && weakest.score < 80) {
      a.push({
        label: `Refuerza ${weakest.id}`,
        action: `Tu puntuación fue ${weakest.score}%. Un repaso corto consolidará el aprendizaje.`,
        goTo: `/app/presupuesto/lesson/${weakest.id}`
      });
    }
    if (!(lessons.find(l => l.id === 'L04')?.completed)) {
      a.push({
        label: 'Registra ingresos y gastos',
        action: 'Lleva un registro semanal para detectar fugas y proyectar el mes.'
      });
    }
    if (!(lessons.find(l => l.id === 'L12')?.completed)) {
      a.push({
        label: 'Plan anti-crisis',
        action: 'Simula recortes preventivos para mantener esenciales cubiertos.'
      });
    }
    if (!a.length) {
      a.push({ label: '¡Vas sólido!', action: 'Continúa con el siguiente bloque del módulo.' });
    }
    return a;
  }, [lessons, weakest]);

  const done = ack; // se completa cuando el usuario confirma
useEffect(() => {
  if (!done) return;
  lessonProgressRepository
    .setCompleted('presupuesto', 'L13')
    .catch(err => console.error(err));
}, [done]);
  return (
    <LessonShell
      id="L13"
      title="Retroalimentación con Finni"
      completeWhen={done}
      nextPath="/app/presupuesto"
      overviewPath="/app/presupuesto"
    >
      <Box sx={{ p: 1 }}>
        {/* Tarjeta de resumen */}
        <Paper sx={{ p: 2, borderRadius: 3, mb: 2, bgcolor: '#FFF8E1', borderLeft: '6px solid #F5B041' }}>
          <Stack spacing={1}>
            <Stack direction="row" spacing={1} alignItems="center">
              <PsychologyIcon color="warning" />
              <Typography fontWeight={800}>Resumen automático</Typography>
            </Stack>
            <Typography variant="body2" color="text.secondary">
              Con base en tus micro-actividades recientes, este es tu estado del módulo.
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="body2" sx={{ minWidth: 120 }}>Progreso del módulo</Typography>
              <LinearProgress
                variant="determinate"
                value={moduleProgress}
                sx={{ flex: 1, height: 8, borderRadius: 6 }}
              />
              <Typography variant="body2" sx={{ ml: 1 }}>{moduleProgress}%</Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="body2" sx={{ minWidth: 120 }}>Promedio reciente</Typography>
              <LinearProgress
                variant="determinate"
                value={avg}
                color={avg >= 80 ? 'success' : 'warning'}
                sx={{ flex: 1, height: 8, borderRadius: 6 }}
              />
              <Typography variant="body2" sx={{ ml: 1 }}>{avg}%</Typography>
            </Stack>
          </Stack>
        </Paper>

        {/* Fortalezas */}
        <Paper sx={{ p: 2, borderRadius: 3, mb: 2 }}>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
            <TrendingUpIcon color="success" />
            <Typography fontWeight={800}>Fortalezas recientes</Typography>
          </Stack>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {strengths.map((s, i) => (
              <Chip key={i} label={s.label} variant="outlined" color="success" />
            ))}
          </Stack>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            {strengths[0]?.reason}
          </Typography>
        </Paper>

        {/* Recomendaciones accionables */}
        <Paper sx={{ p: 2, borderRadius: 3 }}>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
            <ReportProblemIcon color="warning" />
            <Typography fontWeight={800}>Siguientes pasos sugeridos</Typography>
          </Stack>

          <Stack spacing={1}>
            {advices.map((a, i) => (
              <Paper key={i} variant="outlined" sx={{ p: 1.25, borderRadius: 2 }}>
                <Stack direction="row" alignItems="center" spacing={1} justifyContent="space-between">
                  <Typography fontWeight={700}>{a.label}</Typography>
                  {a.goTo && (
                    <Button size="small" variant="contained" href={a.goTo}>
                      Repasar
                    </Button>
                  )}
                </Stack>
                <Typography variant="body2" color="text.secondary">{a.action}</Typography>
              </Paper>
            ))}
          </Stack>

          <Divider sx={{ my: 2 }} />

          <Stack direction="row" spacing={1}>
            <Button
              startIcon={<ReplayIcon />}
              variant="outlined"
              onClick={() => window.location.reload()}
            >
              Recalcular feedback
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                setAck(true);
                complete('L13', 100);
              }}
            >
              Entendido, continuar
            </Button>
          </Stack>
        </Paper>
      </Box>
    </LessonShell>
  );
}
