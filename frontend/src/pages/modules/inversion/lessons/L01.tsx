import { useEffect, useState } from 'react';
import {
  Typography,
  Box,
  Button,
  Paper,
  Stack,
  Fade,
  LinearProgress
} from '@mui/material';
import PsychologyIcon from '@mui/icons-material/Psychology';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import LessonShell from '../LessonShell';
import { lessonProgressRepository } from '../../../../db/lessonProgress.repository';

export default function L01() {
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [correct, setCorrect] = useState(false);

  const handleQuiz = (option: string) => {
    setSelected(option);
    setCorrect(option === 'c');
  };

  useEffect(() => {
    if (!correct) return;

    lessonProgressRepository
      .setCompleted('inversion', 'L01')
      .catch((err) => console.error('Error guardando progreso offline L01', err));
  }, [correct]);

  return (
    <LessonShell
      id="L01"
      title="¿Qué es invertir?"
      completeWhen={correct}
      nextPath="/app/inversion/lesson/L02"
      overviewPath="/app/inversion"
    >
      <Box sx={{ p: 1 }}>
        <LinearProgress
          variant="determinate"
          value={(step / 2) * 100}
          sx={{
            mb: 2,
            height: 8,
            borderRadius: 5,
            bgcolor: '#f0f0f0',
            '& .MuiLinearProgress-bar': { bgcolor: '#F5B041' }
          }}
        />

        {step === 0 && (
          <Fade in>
            <Stack spacing={2}>
              <Typography variant="body1">
                Invertir es poner tu dinero a trabajar para ti: destinarlo a instrumentos que generen
                rendimientos en el tiempo. No es guardar bajo el colchón; es buscar que crezca con
                riesgo medido.
              </Typography>

              <Paper
                sx={{
                  p: 2,
                  borderRadius: 3,
                  bgcolor: '#FFF8E1',
                  borderLeft: '6px solid #F5B041'
                }}
              >
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <PsychologyIcon sx={{ color: '#F5B041' }} />
                  <Typography variant="body2" fontWeight={600}>
                    Tip rápido
                  </Typography>
                </Stack>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Invertir implica asumir riesgo a cambio de potencial rendimiento. Ahorrar es
                  preservar valor con casi nulo riesgo.
                </Typography>
              </Paper>

              <Button
                fullWidth
                variant="contained"
                sx={{
                  bgcolor: '#F5B041',
                  '&:hover': { bgcolor: '#F39C12' }
                }}
                onClick={() => setStep(1)}
              >
                Continuar
              </Button>
            </Stack>
          </Fade>
        )}

        {step === 1 && (
          <Fade in>
            <Stack spacing={2}>
              <Typography variant="h6" fontWeight={800}>
                ¿En qué se diferencia del ahorro?
              </Typography>

              <Stack spacing={1.5}>
                <Paper sx={{ p: 2, borderRadius: 3 }}>
                  <Typography fontWeight={700}>Ahorro</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Protección y liquidez. Bajo riesgo, rendimientos bajos, ideal para emergencias.
                  </Typography>
                </Paper>
                <Paper sx={{ p: 2, borderRadius: 3 }}>
                  <Typography fontWeight={700}>Inversión</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Crecimiento de tu dinero. Mayor riesgo y horizonte más largo a cambio de
                    rendimientos potencialmente superiores.
                  </Typography>
                </Paper>
              </Stack>

              <Button
                fullWidth
                variant="contained"
                sx={{
                  bgcolor: '#F5B041',
                  '&:hover': { bgcolor: '#F39C12' }
                }}
                onClick={() => setStep(2)}
              >
                Vamos al mini-quiz
              </Button>
            </Stack>
          </Fade>
        )}

        {step === 2 && (
          <Fade in>
            <Stack spacing={2} alignItems="center">
              <Typography variant="h6" fontWeight={800}>
                Mini quiz: ¿cuál frase describe invertir?
              </Typography>

              <Stack spacing={1.5} sx={{ width: '100%' }}>
                {[
                  { key: 'a', label: 'Guardar efectivo en casa sin moverlo' },
                  { key: 'b', label: 'Ahorrar en una alcancía para emergencias' },
                  { key: 'c', label: 'Destinar dinero a instrumentos que generen rendimiento' }
                ].map((o) => (
                  <Button
                    key={o.key}
                    variant={selected === o.key ? 'contained' : 'outlined'}
                    onClick={() => handleQuiz(o.key)}
                    sx={{
                      textTransform: 'none',
                      borderColor: '#F5B041',
                      color: '#F39C12',
                      '&.MuiButton-contained': {
                        bgcolor: o.key === 'c' ? '#2ECC71' : '#E74C3C',
                        color: '#fff'
                      }
                    }}
                  >
                    {o.label}
                  </Button>
                ))}
              </Stack>

              {selected && (
                <Typography
                  variant="body2"
                  sx={{
                    color: correct ? '#2ECC71' : '#E74C3C',
                    mt: 1,
                    fontWeight: 600
                  }}
                >
                  {correct
                    ? '¡Correcto! Invertir es hacer crecer tu dinero asumiendo riesgo controlado.'
                    : 'Cerca, pero invertir implica buscar rendimiento, no solo guardar.'}
                </Typography>
              )}

              {correct && (
                <Fade in>
                  <Paper
                    elevation={2}
                    sx={{
                      mt: 3,
                      p: 3,
                      borderRadius: 3,
                      bgcolor: '#E8F5E9',
                      textAlign: 'center'
                    }}
                  >
                    <EmojiEventsIcon sx={{ color: '#27AE60', fontSize: 50 }} />
                    <Typography fontWeight={700} sx={{ mt: 1 }}>
                      Listo, ya entiendes la base de invertir.
                    </Typography>
                  </Paper>
                </Fade>
              )}
            </Stack>
          </Fade>
        )}
      </Box>
    </LessonShell>
  );
}
