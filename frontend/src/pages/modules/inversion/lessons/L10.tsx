import { useEffect, useMemo, useState } from 'react';
import { Box, Paper, Stack, Typography, Checkbox, FormControlLabel, Alert } from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import LessonShell from '../LessonShell';
import { lessonProgressRepository } from '../../../../db/lessonProgress.repository';

type Flag = {
  id: string;
  text: string;
  risky: boolean;
};

const FLAGS: Flag[] = [
  { id: 'f1', text: 'Promesa de 10% semanal garantizado', risky: true },
  { id: 'f2', text: 'No hay contrato ni estado de cuenta', risky: true },
  { id: 'f3', text: 'Intermediario regulado por CNBV', risky: false },
  { id: 'f4', text: 'Te presionan para entrar hoy o pierdes el lugar', risky: true },
  { id: 'f5', text: 'Fondos y prospectos disponibles para consulta', risky: false }
];

export default function L10() {
  const [selected, setSelected] = useState<Record<string, boolean>>({});

  const hits = useMemo(
    () => FLAGS.filter((f) => f.risky && selected[f.id]).length,
    [selected]
  );
  const falsePositives = useMemo(
    () => FLAGS.filter((f) => !f.risky && selected[f.id]).length,
    [selected]
  );
  const complete = hits >= 3 && falsePositives === 0;

  useEffect(() => {
    if (!complete) return;
    lessonProgressRepository
      .setCompleted('inversion', 'L10')
      .catch((err) => console.error('Error guardando progreso offline L10', err));
  }, [complete]);

  const toggle = (id: string) => {
    setSelected((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <LessonShell
      id="L10"
      title="Fraudes y promesas irreales"
      completeWhen={complete}
      nextPath="/app/inversion/lesson/L11"
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
            <WarningAmberIcon color="warning" />
            <Typography fontWeight={800}>Historias interactivas</Typography>
          </Stack>
          <Typography variant="body2" color="text.secondary">
            Marca solo las señales de alerta. Si marcas algo seguro, no cuenta. Necesitas detectar 3
            banderas reales sin falsos positivos.
          </Typography>
        </Paper>

        <Stack spacing={1.25}>
          {FLAGS.map((flag) => (
            <Paper key={flag.id} sx={{ p: 2, borderRadius: 3 }}>
              <FormControlLabel
                control={<Checkbox checked={!!selected[flag.id]} onChange={() => toggle(flag.id)} />}
                label={
                  <Stack spacing={0.5}>
                    <Typography fontWeight={700}>{flag.text}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      Decide si es señal de fraude o si es algo normal.
                    </Typography>
                  </Stack>
                }
              />
            </Paper>
          ))}
        </Stack>

        <Alert
          sx={{ mt: 2 }}
          severity={complete ? 'success' : falsePositives > 0 ? 'error' : 'info'}
          variant="outlined"
        >
          {complete
            ? 'Detectaste las banderas rojas clave. No te dejes llevar por promesas irreales.'
            : falsePositives > 0
            ? 'Quitaste algo que era seguro. Solo marca señales de alerta.'
            : 'Identifica al menos 3 banderas rojas sin marcar elementos seguros.'}
        </Alert>
      </Box>
    </LessonShell>
  );
}
