import { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Paper,
  Stack,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  LinearProgress,
  Alert
} from '@mui/material';
import LessonShell from '../LessonShell';
import { lessonProgressRepository } from '../../../../db/lessonProgress.repository';

type Choice = 'ahorro' | 'inversion' | null;

const STATEMENTS = [
  { id: 's1', text: 'Fondo de emergencia en cuenta de alta liquidez', answer: 'ahorro' },
  { id: 's2', text: 'Comprar CETES a 1 año para buscar rendimiento', answer: 'inversion' },
  { id: 's3', text: 'Apartar efectivo en efectivo en casa', answer: 'ahorro' },
  { id: 's4', text: 'Comprar acciones para horizonte de 5 años', answer: 'inversion' }
] as const;

export default function L02() {
  const [choices, setChoices] = useState<Record<string, Choice>>({
    s1: null,
    s2: null,
    s3: null,
    s4: null
  });

  const answered = useMemo(
    () => Object.values(choices).filter((v) => v !== null).length,
    [choices]
  );
  const correct = useMemo(
    () => STATEMENTS.every((s) => choices[s.id] === s.answer),
    [choices]
  );

  useEffect(() => {
    if (!correct) return;
    lessonProgressRepository
      .setCompleted('inversion', 'L02')
      .catch((err) => console.error('Error guardando progreso offline L02', err));
  }, [correct]);

  const setChoice = (id: string, value: Choice) => {
    setChoices((prev) => ({ ...prev, [id]: value }));
  };

  return (
    <LessonShell
      id="L02"
      title="Ahorro vs. inversión"
      completeWhen={correct}
      nextPath="/app/inversion/lesson/L03"
      overviewPath="/app/inversion"
    >
      <Box sx={{ p: 1 }}>
        <Paper
          sx={{
            p: 2,
            borderRadius: 3,
            bgcolor: '#FFF8E1',
            borderLeft: '6px solid #F5B041',
            mb: 2
          }}
        >
          <Typography fontWeight={700}>Comparador interactivo</Typography>
          <Typography variant="body2" color="text.secondary">
            Clasifica cada situación según corresponda a ahorro (seguridad y liquidez) o inversión
            (rendimiento con riesgo). Completa todas correctamente para avanzar.
          </Typography>
        </Paper>

        <LinearProgress
          variant="determinate"
          value={(answered / STATEMENTS.length) * 100}
          sx={{
            mb: 2,
            height: 8,
            borderRadius: 5,
            bgcolor: '#f0f0f0',
            '& .MuiLinearProgress-bar': { bgcolor: '#F5B041' }
          }}
        />

        <Stack spacing={1.5}>
          {STATEMENTS.map((item) => {
            const value = choices[item.id];
            const isCorrect = value === item.answer;
            const attempted = value !== null;
            return (
              <Paper key={item.id} sx={{ p: 2, borderRadius: 3 }}>
                <Typography fontWeight={700}>{item.text}</Typography>
                <Typography variant="caption" color="text.secondary">
                  Considera riesgo, plazo y liquidez.
                </Typography>
                <ToggleButtonGroup
                  exclusive
                  value={value}
                  onChange={(_, v) => setChoice(item.id, v)}
                  sx={{ mt: 1 }}
                  fullWidth
                >
                  <ToggleButton value="ahorro">Ahorro</ToggleButton>
                  <ToggleButton value="inversion">Inversión</ToggleButton>
                </ToggleButtonGroup>
                {attempted && (
                  <Alert
                    sx={{ mt: 1 }}
                    severity={isCorrect ? 'success' : 'warning'}
                    variant="outlined"
                  >
                    {isCorrect
                      ? 'Correcto, coincide con su riesgo/plazo.'
                      : 'Revisa: piensa en riesgo y objetivo antes de elegir.'}
                  </Alert>
                )}
              </Paper>
            );
          })}
        </Stack>

        {answered === STATEMENTS.length && !correct && (
          <Alert sx={{ mt: 2 }} severity="info" variant="outlined">
            Ajusta las que falten hasta que todas coincidan.
          </Alert>
        )}
      </Box>
    </LessonShell>
  );
}
