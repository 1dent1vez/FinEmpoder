import { useMemo, useState } from 'react';
import {
  Stack,
  Typography,
  Paper,
  Button,
  LinearProgress,
  Chip
} from '@mui/material';
import LessonShell from '../LessonShell';

type Mode = 'informal' | 'formal';
type Item = { id: string; label: string; correct: Mode; note: string };

const BLUE = '#3498DB';

export default function L02() {
  const pool: Item[] = useMemo(
    () => [
      { id: 'alcancia', label: 'Guardar efectivo en una alcancia', correct: 'informal', note: 'Riesgo de robo o gasto impulsivo.' },
      { id: 'tanda', label: 'Participar en una tanda sin contrato', correct: 'informal', note: 'No hay proteccion legal si alguien falla.' },
      { id: 'cuenta', label: 'Cuenta de ahorro en banco regulado', correct: 'formal', note: 'Protegida y con historial financiero.' },
      { id: 'caja', label: 'Caja popular con reglas y contrato', correct: 'formal', note: 'Supervision y reglas de retiro.' },
      { id: 'app', label: 'App sin respaldo que promete rendimientos', correct: 'informal', note: 'No hay garantia sobre tu dinero.' },
      { id: 'cetes', label: 'CETES directo a tu nombre', correct: 'formal', note: 'Es un producto de bajo riesgo y regulado.' }
    ],
    []
  );

  const [answers, setAnswers] = useState<Record<string, Mode | null>>(
    () => Object.fromEntries(pool.map((i) => [i.id, null]))
  );

  const total = pool.length;
  const answered = Object.values(answers).filter(Boolean).length;
  const correctCount = pool.reduce((acc, i) => acc + (answers[i.id] === i.correct ? 1 : 0), 0);
  const allCorrect = answered === total && correctCount === total;

  const choose = (id: string, mode: Mode) => {
    setAnswers((prev) => ({ ...prev, [id]: mode }));
  };

  return (
    <LessonShell
      id="L02"
      title="Ahorro informal vs. formal"
      completeWhen={allCorrect}
      nextPath="/app/ahorro/lesson/L03"
      overviewPath="/app/ahorro"
    >
      <Stack spacing={2}>
        <Paper
          sx={{
            p: 2,
            borderRadius: 3,
            bgcolor: '#EAF6FF',
            borderLeft: `6px solid ${BLUE}`
          }}
        >
          <Typography variant="body1" sx={{ mb: 1 }}>
            Clasifica cada ejemplo tocando el tipo de ahorro. El ahorro formal es regulado y genera
            historial; el informal depende de acuerdos sin proteccion.
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            <Chip label="Formal = protegido y con historial" size="small" sx={{ bgcolor: '#D6ECFF' }} />
            <Chip label="Informal = sin reglas claras" size="small" sx={{ bgcolor: '#FFF4E0' }} />
          </Stack>
        </Paper>

        <LinearProgress
          variant="determinate"
          value={(answered / total) * 100}
          sx={{
            mb: 1,
            height: 8,
            borderRadius: 5,
            bgcolor: '#f0f0f0',
            '& .MuiLinearProgress-bar': { bgcolor: BLUE }
          }}
        />

        <Stack spacing={1.25}>
          {pool.map((it) => {
            const value = answers[it.id];
            const isCorrect = value && value === it.correct;

            return (
              <Paper key={it.id} sx={{ p: 1.5, borderRadius: 3 }}>
                <Typography fontWeight={700}>{it.label}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {it.note}
                </Typography>
                <Stack direction="row" spacing={1}>
                  <Button
                    size="small"
                    variant={value === 'informal' ? 'contained' : 'outlined'}
                    onClick={() => choose(it.id, 'informal')}
                    sx={{
                      textTransform: 'none',
                      borderColor: '#F5B041',
                      color: '#c2760f',
                      '&.MuiButton-contained': { bgcolor: '#F5B041', color: '#fff' }
                    }}
                  >
                    Informal
                  </Button>
                  <Button
                    size="small"
                    variant={value === 'formal' ? 'contained' : 'outlined'}
                    onClick={() => choose(it.id, 'formal')}
                    sx={{
                      textTransform: 'none',
                      borderColor: BLUE,
                      color: '#1f6fa6',
                      '&.MuiButton-contained': { bgcolor: BLUE, color: '#fff' }
                    }}
                  >
                    Formal
                  </Button>
                </Stack>

                {value && (
                  <Typography
                    variant="caption"
                    sx={{ mt: 0.75, display: 'block', color: isCorrect ? '#1E8449' : '#C0392B' }}
                  >
                    {isCorrect ? 'Correcto' : `Revisa: este ejemplo es ${it.correct}.`}
                  </Typography>
                )}
              </Paper>
            );
          })}
        </Stack>
      </Stack>
    </LessonShell>
  );
}
