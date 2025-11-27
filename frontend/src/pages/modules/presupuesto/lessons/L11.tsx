import { useState } from 'react';
import {
  Box, Paper, Stack, Typography, Stepper, Step, StepLabel,
  Button, Alert, Divider, Chip
} from '@mui/material';
import LessonShell from '../LessonShell';
import { useLessons } from '../../../../store/lessons';
import { lessonProgressRepository } from '../../../../db/lessonProgress.repository';
import { useEffect } from 'react';

const ORANGE = '#F5B041';

const steps = [
  { k: 'crear',    t: 'Crea tu “Presupuesto Familiar”', d: 'Define miembros y moneda. Activa respaldo local.' },
  { k: 'ingresos', t: 'Registra ingresos',              d: 'Sueldo, becas y otros. Marca fijos/variables.' },
  { k: 'gastos',   t: 'Agrega gastos por categorías',   d: 'Casa, comida, transporte, ocio. Límites mensuales.' },
  { k: 'vista',    t: 'Revisa tablero y alertas',       d: 'Semáforo por categoría y balance proyectado.' },
];

export default function L11() {
  const { complete } = useLessons();
  const [active, setActive] = useState(0);
  const [visited, setVisited] = useState<Record<string, boolean>>({ crear: true });

  const allDone = steps.every(s => visited[s.k]);

  const next = () => {
    const idx = Math.min(active + 1, steps.length - 1);
    setActive(idx);
    setVisited(v => ({ ...v, [steps[idx].k]: true }));
  };

  const back = () => setActive(i => Math.max(0, i - 1));
useEffect(() => {
  if (!allDone) return;
  lessonProgressRepository
    .setCompleted('presupuesto', 'L11')
    .catch(err => console.error(err));
}, [allDone]);
  return (
    <LessonShell
      id="L11"
      title="Presupuesto familiar y app digital"
      completeWhen={allDone}
      nextPath="/app/presupuesto"
      overviewPath="/app/presupuesto"
    >
      <Box sx={{ p: 1 }}>
        <Paper sx={{ p: 2, borderRadius: 3, bgcolor: '#FFF8E1', borderLeft: `6px solid ${ORANGE}`, mb: 2 }}>
          <Typography fontWeight={800} sx={{ mb: .5 }}>Tutorial rápido</Typography>
          <Typography variant="body2" color="text.secondary">
            Recorre los 4 pasos para montar un presupuesto familiar en una app digital.
            La lección se completa al visitar todos los pasos.
          </Typography>
        </Paper>

        <Stepper activeStep={active} alternativeLabel sx={{ mb: 2 }}>
          {steps.map(s => (
            <Step key={s.k}>
              <StepLabel>{s.t}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Paper sx={{ p: 2, borderRadius: 3, mb: 2 }}>
          <Stack spacing={1}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Chip size="small" label={`Paso ${active + 1} de ${steps.length}`} />
              <Typography fontWeight={800}>{steps[active].t}</Typography>
            </Stack>
            <Typography color="text.secondary">{steps[active].d}</Typography>

            <Divider sx={{ my: 1 }} />

            {/* Mini demo estática guiada: puntos clave del paso */}
            {active === 0 && (
              <Stack spacing={1}>
                <Typography variant="body2">1) Nuevo presupuesto → “Familiar”.</Typography>
                <Typography variant="body2">2) Agrega miembros y roles.</Typography>
                <Typography variant="body2">3) Activa respaldo local y sincronización cuando esté disponible.</Typography>
              </Stack>
            )}
            {active === 1 && (
              <Stack spacing={1}>
                <Typography variant="body2">1) Ingreso principal: mensual, fijo.</Typography>
                <Typography variant="body2">2) Extras: beca/ventas, variables.</Typography>
                <Typography variant="body2">3) Marca fuente y periodicidad para métricas.</Typography>
              </Stack>
            )}
            {active === 2 && (
              <Stack spacing={1}>
                <Typography variant="body2">1) Categorías con límite: casa, comida, transporte, ocio.</Typography>
                <Typography variant="body2">2) Reglas de alerta: 50%/80% del límite.</Typography>
                <Typography variant="body2">3) Notas y etiquetas: “hormiga”, “extraordinario”.</Typography>
              </Stack>
            )}
            {active === 3 && (
              <Stack spacing={1}>
                <Typography variant="body2">1) Semáforo de categorías con progreso.</Typography>
                <Typography variant="body2">2) Balance proyectado y ahorro meta.</Typography>
                <Typography variant="body2">3) Revisión semanal y cierre mensual.</Typography>
              </Stack>
            )}

            <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
              <Button variant="outlined" onClick={back} disabled={active === 0}>Atrás</Button>
              <Button
                variant="contained"
                onClick={active === steps.length - 1 ? () => complete('L11', 100) : next}
              >
                {active === steps.length - 1 ? 'Finalizar tutorial' : 'Siguiente'}
              </Button>
            </Stack>
          </Stack>
        </Paper>

        {allDone ? (
          <Alert severity="success">Listo. Has completado el tutorial y puedes volver al menú o continuar.</Alert>
        ) : (
          <Alert severity="info">Visita todos los pasos para completar la lección.</Alert>
        )}
      </Box>
    </LessonShell>
  );
}
