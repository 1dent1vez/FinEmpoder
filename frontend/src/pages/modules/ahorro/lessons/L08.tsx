import { useMemo, useState } from 'react';
import { Box, Paper, Stack, Typography, Button, LinearProgress, Chip } from '@mui/material';
import LessonShell from '../LessonShell';

type Choice = 'a' | 'b' | 'c';
type Scenario = {
  id: string;
  title: string;
  options: { key: Choice; text: string }[];
  best: Choice;
};

export default function L08() {
  const scenarios: Scenario[] = useMemo(
    () => [
      {
        id: 'medico',
        title: 'Se rompe tu celular y necesitas reparar o reemplazar',
        options: [
          { key: 'a', text: 'Usar el fondo de emergencia y reponerlo en 2 meses.' },
          { key: 'b', text: 'Pagar con tarjeta de credito a 12 meses sin plan de pago.' },
          { key: 'c', text: 'Esperar hasta ahorrar completo y quedarte incomunicado.' }
        ],
        best: 'a'
      },
      {
        id: 'universidad',
        title: 'Tu transporte sube 15% por un mes de contingencia',
        options: [
          { key: 'a', text: 'Cubrir la diferencia con el fondo y ajustar otros gastos.' },
          { key: 'b', text: 'Suspender todo ahorro y gastar sin control.' },
          { key: 'c', text: 'Pedir prestado con intereses altos.' }
        ],
        best: 'a'
      },
      {
        id: 'salud',
        title: 'Consulta medica inesperada',
        options: [
          { key: 'a', text: 'Usar el fondo y reponerlo en 3 meses.' },
          { key: 'b', text: 'Vender pertenencias urgentes.' },
          { key: 'c', text: 'Ignorar el problema.' }
        ],
        best: 'a'
      }
    ],
    []
  );

  const [answers, setAnswers] = useState<Record<string, Choice | null>>(
    () => Object.fromEntries(scenarios.map((s) => [s.id, null]))
  );

  const total = scenarios.length;
  const answered = Object.values(answers).filter(Boolean).length;
  const correct = scenarios.every((s) => answers[s.id] === s.best);
  const progress = Math.round((answered / total) * 100);

  const select = (id: string, choice: Choice) => {
    setAnswers((prev) => ({ ...prev, [id]: choice }));
  };

  return (
    <LessonShell
      id="L08"
      title="Ahorro de emergencia en accion"
      completeWhen={correct}
      nextPath="/app/ahorro/lesson/L09"
      overviewPath="/app/ahorro"
    >
      <Box sx={{ p: 1 }}>
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            mb: 2,
            height: 8,
            borderRadius: 5,
            bgcolor: '#f0f0f0',
            '& .MuiLinearProgress-bar': { bgcolor: '#3498DB' }
          }}
        />

        <Paper
          sx={{
            p: 2,
            borderRadius: 3,
            bgcolor: '#EAF6FF',
            borderLeft: '6px solid #3498DB',
            mb: 2
          }}
        >
          <Typography variant="body1">
            Practica usar tu fondo de emergencia. Elige la accion mas saludable para mantener el
            habito de ahorro sin endeudarte.
          </Typography>
        </Paper>

        <Stack spacing={1.5}>
          {scenarios.map((s) => {
            const selected = answers[s.id];
            const isCorrect = selected && selected === s.best;
            return (
              <Paper key={s.id} sx={{ p: 2, borderRadius: 3 }}>
                <Typography fontWeight={700} sx={{ mb: 1 }}>
                  {s.title}
                </Typography>
                <Stack spacing={1}>
                  {s.options.map((o) => (
                    <Button
                      key={o.key}
                      variant={selected === o.key ? 'contained' : 'outlined'}
                      onClick={() => select(s.id, o.key)}
                      sx={{
                        textTransform: 'none',
                        justifyContent: 'flex-start',
                        borderColor: '#3498DB',
                        color: '#1f6fa6',
                        '&.MuiButton-contained': {
                          bgcolor: o.key === s.best ? '#2ECC71' : '#E74C3C',
                          color: '#fff'
                        }
                      }}
                    >
                      {o.text}
                    </Button>
                  ))}
                </Stack>
                {selected && (
                  <Chip
                    sx={{ mt: 1 }}
                    color={isCorrect ? 'success' : 'error'}
                    label={isCorrect ? 'Bien: usaste el fondo correctamente.' : 'Revisa: la idea es usar el fondo y reponerlo.'}
                  />
                )}
              </Paper>
            );
          })}
        </Stack>
      </Box>
    </LessonShell>
  );
}
