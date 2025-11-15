import { useMemo, useState } from 'react';
import { Box, Paper, Stack, Typography, TextField, Slider, Chip, Button, Alert, LinearProgress, Divider } from '@mui/material';
import LessonShell from '../LessonShell';
import { useLessons } from '../../../../store/lessons';

const ORANGE = '#F5B041';

export default function L10() {
  const { complete } = useLessons();

  // Campos SMART
  const [what, setWhat] = useState('Ahorrar para fondo de emergencia');
  const [measure, setMeasure] = useState('Monto acumulado en MXN y % de avance');
  const [achieve, setAchieve] = useState('Aportar semanalmente con débito automático');
  const [relevant, setRelevant] = useState('Me da estabilidad ante imprevistos');
  const [deadline, setDeadline] = useState('2026-01-31');

  // Parámetros cuantitativos
  const [target, setTarget] = useState(6000);    // meta total
  const [weekly, setWeekly] = useState(300);     // aporte
  const weeksNeeded = target > 0 && weekly > 0 ? Math.ceil(target / weekly) : 0;

  // Validador básico: cada criterio SMART “cuenta” si tiene contenido suficiente.
  const score = useMemo(() => {
    let s = 0;
    if (what.trim().length >= 8) s++;
    if (measure.trim().length >= 8) s++;
    if (achieve.trim().length >= 8) s++;
    if (relevant.trim().length >= 8) s++;
    if (deadline) s++;
    return s;               // 0..5
  }, [what, measure, achieve, relevant, deadline]);

  const completeOK = score === 5 && target > 0 && weekly > 0;

  return (
    <LessonShell
      id="L10"
      title="Plan SMART de metas"
      completeWhen={completeOK}
      nextPath="/app/presupuesto"     // siguiente módulo/quiz cuando exista
      overviewPath="/app/presupuesto"
    >
      <Box sx={{ p: 1 }}>
        <Paper sx={{ p: 2, borderRadius: 3, bgcolor: '#FFF8E1', borderLeft: `6px solid ${ORANGE}`, mb: 2 }}>
          <Typography fontWeight={800} sx={{ mb: .5 }}>Reto guiado</Typography>
          <Typography variant="body2" color="text.secondary">
            Define una meta usando el marco SMART. La lección se marca como completada cuando todos los criterios
            están cubiertos y tu plan cuantitativo es válido.
          </Typography>
        </Paper>

        <LinearProgress
          variant="determinate"
          value={(score / 5) * 100}
          sx={{ mb: 2, height: 8, borderRadius: 5, '& .MuiLinearProgress-bar': { bgcolor: ORANGE } }}
        />

        {/* S (Specific) & M (Measurable) */}
        <Paper sx={{ p: 2, borderRadius: 3, mb: 2 }}>
          <Stack spacing={1}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Chip label="S — Específica" size="small" sx={{ bgcolor: '#FFD180' }} />
            </Stack>
            <TextField
              label="¿Qué exactamente quieres lograr?"
              fullWidth
              value={what}
              onChange={(e) => setWhat(e.target.value)}
            />

            <Stack direction="row" spacing={1} alignItems="center">
              <Chip label="M — Medible" size="small" sx={{ bgcolor: '#FFE0B2' }} />
            </Stack>
            <TextField
              label="¿Cómo sabrás que avanzas?"
              fullWidth
              value={measure}
              onChange={(e) => setMeasure(e.target.value)}
            />
          </Stack>
        </Paper>

        {/* A (Achievable) & R (Relevant) */}
        <Paper sx={{ p: 2, borderRadius: 3, mb: 2 }}>
          <Stack spacing={1}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Chip label="A — Alcanzable" size="small" sx={{ bgcolor: '#D1C4E9' }} />
            </Stack>
            <TextField
              label="¿Qué acciones harás para lograrla?"
              fullWidth
              value={achieve}
              onChange={(e) => setAchieve(e.target.value)}
            />

            <Stack direction="row" spacing={1} alignItems="center">
              <Chip label="R — Relevante" size="small" sx={{ bgcolor: '#C8E6C9' }} />
            </Stack>
            <TextField
              label="¿Por qué es importante para ti?"
              fullWidth
              value={relevant}
              onChange={(e) => setRelevant(e.target.value)}
            />
          </Stack>
        </Paper>

        {/* T (Time-bound) + cuantificación */}
        <Paper sx={{ p: 2, borderRadius: 3, mb: 2 }}>
          <Stack spacing={1.25}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Chip label="T — Con fecha límite" size="small" sx={{ bgcolor: '#BBDEFB' }} />
            </Stack>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              style={{ width: 200, padding: '8px 10px', borderRadius: 8, border: '1px solid #ccc' }}
            />

            <Divider sx={{ my: 1 }} />

            <Typography fontWeight={700}>Cuantifica tu meta</Typography>
            <Typography variant="body2" color="text.secondary">Objetivo total (MXN)</Typography>
            <Slider
              value={target}
              onChange={(_, v) => setTarget(Number(v))}
              min={1000}
              max={50000}
              step={500}
              valueLabelDisplay="auto"
              sx={{ '& .MuiSlider-thumb': { bgcolor: ORANGE }, '& .MuiSlider-track': { bgcolor: ORANGE } }}
            />
            <Typography variant="body2" color="text.secondary">Aporte semanal (MXN)</Typography>
            <Slider
              value={weekly}
              onChange={(_, v) => setWeekly(Number(v))}
              min={100}
              max={5000}
              step={50}
              valueLabelDisplay="auto"
              sx={{ '& .MuiSlider-thumb': { bgcolor: ORANGE }, '& .MuiSlider-track': { bgcolor: ORANGE } }}
            />

            <Alert severity="info" variant="outlined">
              Con ${weekly} semanales, necesitas ~{weeksNeeded} semanas para alcanzar ${target}.
            </Alert>
          </Stack>
        </Paper>

        {completeOK ? (
          <Alert severity="success" icon={false} sx={{ mb: 2 }}>
            Tu plan cumple con todos los criterios SMART. Puedes avanzar a la siguiente lección o volver al menú.
          </Alert>
        ) : (
          <Alert severity="warning" icon={false} sx={{ mb: 2 }}>
            Completa todos los campos con suficiente detalle y fija una cantidad y un plazo coherentes.
          </Alert>
        )}

        <Stack direction="row" spacing={1}>
          <Button variant="outlined" onClick={() => window.history.back()}>Volver</Button>
          <Button
            variant="contained"
            onClick={() => complete('L10', completeOK ? 100 : 80)}
            disabled={!completeOK}
          >
            Guardar plan SMART
          </Button>
        </Stack>
      </Box>
    </LessonShell>
  );
}
