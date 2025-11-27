import { useMemo, useState } from 'react';
import {
  Box, Paper, Stack, Typography, Chip, Button, LinearProgress
} from '@mui/material';
import LessonShell from '../LessonShell';
import { lessonProgressRepository } from '../../../../db/lessonProgress.repository';
import { useEffect } from 'react';
type Cat = 'fijo' | 'variable' | 'hormiga';
type Item = {
  id: string;
  label: string;
  correct: Cat;
};

const ORANGE = '#F5B041';
const ORANGE_DK = '#F39C12';

export default function L03() {
  // Ítems del juego (puedes editar o ampliar)
  const pool: Item[] = useMemo(
    () => [
      { id: 'renta', label: 'Renta del departamento', correct: 'fijo' },
      { id: 'stream', label: 'Suscripción streaming', correct: 'fijo' },
      { id: 'comida', label: 'Comida fuera ocasional', correct: 'variable' },
      { id: 'luz', label: 'Recibo de luz', correct: 'fijo' },
      { id: 'propinas', label: 'Propinas del trabajo', correct: 'variable' },
      { id: 'snacks', label: 'Snacks diarios', correct: 'hormiga' },
      { id: 'cafecito', label: 'Café “to go”', correct: 'hormiga' },
      { id: 'uber', label: 'Uber eventual', correct: 'variable' },
    ],
    [],
  );

  // Estado de respuestas del usuario
  const [answers, setAnswers] = useState<Record<string, Cat | null>>(
    () => Object.fromEntries(pool.map(i => [i.id, null])),
  );

  const total = pool.length;
  const answered = Object.values(answers).filter(Boolean).length;
  const correctCount = pool.reduce((acc, i) => acc + (answers[i.id] === i.correct ? 1 : 0), 0);
  const allCorrect = answered === total && correctCount === total;

  const choose = (id: string, cat: Cat) => {
    setAnswers(prev => ({ ...prev, [id]: cat }));
  };
// Efecto para guardar progreso cuando se gana
  useEffect(() => {
    // 1. La condición de completado es 'allCorrect'
    // (que sea true solo si ya contestó todo Y todo está bien)
    if (!allCorrect) return;

    // 2. Guardamos el progreso especificando la lección L03
    lessonProgressRepository
      .setCompleted('presupuesto', 'L03')
      .then(() => {
        console.log('¡Lección L03 completada y guardada!');
        // Aquí podrías disparar un confetti o un modal de éxito si tienes uno
      })
      .catch(err => console.error('Error guardando progreso offline L03', err));
      
  }, [allCorrect]); // Se ejecuta cada vez que 'allCorrect' cambia
  return (
    <LessonShell
      id="L03"
      title="Gastos: fijos, variables y hormiga"
      completeWhen={allCorrect}
      nextPath="/app/presupuesto"            // siguiente aún no existe → vuelve al overview
      overviewPath="/app/presupuesto"
    >
      <Box sx={{ p: 1 }}>
        <Paper
          sx={{
            p: 2,
            borderRadius: 3,
            bgcolor: '#FFF8E1',
            borderLeft: `6px solid ${ORANGE}`,
            mb: 2,
          }}
        >
          <Typography variant="body1" sx={{ mb: 1 }}>
            Clasifica cada gasto tocando una categoría:
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            <Chip label="Fijo" size="small" sx={{ bgcolor: '#FFE6BF' }} />
            <Chip label="Variable" size="small" sx={{ bgcolor: '#EAF2FB' }} />
            <Chip label="Hormiga" size="small" sx={{ bgcolor: '#FDE2E2' }} />
          </Stack>
        </Paper>

        <LinearProgress
          variant="determinate"
          value={(answered / total) * 100}
          sx={{
            mb: 2,
            height: 8,
            borderRadius: 5,
            bgcolor: '#f0f0f0',
            '& .MuiLinearProgress-bar': { bgcolor: ORANGE },
          }}
        />

        <Stack spacing={1.25}>
          {pool.map((it) => {
            const value = answers[it.id];
            const isCorrect = value && value === it.correct;

            return (
              <Paper key={it.id} sx={{ p: 1.5, borderRadius: 3 }}>
                <Stack direction="row" alignItems="center" spacing={1.5}>
                  <Typography sx={{ flex: 1 }} fontWeight={700}>
                    {it.label}
                  </Typography>

                  <Stack direction="row" spacing={1}>
                    <Button
                      size="small"
                      variant={value === 'fijo' ? 'contained' : 'outlined'}
                      onClick={() => choose(it.id, 'fijo')}
                      sx={{
                        textTransform: 'none',
                        borderColor: ORANGE,
                        color: ORANGE_DK,
                        '&.MuiButton-contained': { bgcolor: ORANGE, color: '#fff' },
                      }}
                    >
                      Fijo
                    </Button>
                    <Button
                      size="small"
                      variant={value === 'variable' ? 'contained' : 'outlined'}
                      onClick={() => choose(it.id, 'variable')}
                      sx={{
                        textTransform: 'none',
                        borderColor: ORANGE,
                        color: ORANGE_DK,
                        '&.MuiButton-contained': { bgcolor: ORANGE, color: '#fff' },
                      }}
                    >
                      Variable
                    </Button>
                    <Button
                      size="small"
                      variant={value === 'hormiga' ? 'contained' : 'outlined'}
                      onClick={() => choose(it.id, 'hormiga')}
                      sx={{
                        textTransform: 'none',
                        borderColor: ORANGE,
                        color: ORANGE_DK,
                        '&.MuiButton-contained': { bgcolor: ORANGE, color: '#fff' },
                      }}
                    >
                      Hormiga
                    </Button>
                  </Stack>
                </Stack>

                {value && (
                  <Typography
                    variant="caption"
                    sx={{ mt: 0.75, display: 'block', color: isCorrect ? '#1E8449' : '#C0392B' }}
                  >
                    {isCorrect
                      ? 'Correcto'
                      : `Incorrecto. Este gasto es ${it.correct}.`}
                  </Typography>
                )}
              </Paper>
            );
          })}
        </Stack>
      </Box>
    </LessonShell>
  );
}
