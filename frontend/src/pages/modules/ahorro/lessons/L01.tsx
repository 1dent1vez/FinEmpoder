import { useState } from 'react';
import {
  Typography,
  Box,
  Button,
  Paper,
  Stack,
  Fade,
  LinearProgress,
  Chip
} from '@mui/material';
import PsychologyIcon from '@mui/icons-material/Psychology';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import LessonShell from '../LessonShell';

type Answer = 'a' | 'b' | 'c' | null;

export default function L01() {
  const [step, setStep] = useState(0);
  const [answer, setAnswer] = useState<Answer>(null);

  const correct = answer === 'b';
  const progress = Math.round((step / 2) * 100);

  return (
    <LessonShell
      id="L01"
      title="Que significa ahorrar?"
      completeWhen={correct}
      nextPath="/app/ahorro/lesson/L02"
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
            '& .MuiLinearProgress-bar': { bgcolor: '#2ECC71' }
          }}
        />

        {step === 0 && (
          <Fade in>
            <Stack spacing={2}>
              <Typography variant="body1">
                Ahorrar no es lo que sobra: es separar un monto antes de gastar para acercarte a una
                meta. Es una decision consciente, repetida y medible.
              </Typography>

              <Paper
                sx={{
                  p: 2,
                  borderRadius: 3,
                  bgcolor: '#EAF6FF',
                  borderLeft: '6px solid #3498DB'
                }}
              >
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <PsychologyIcon sx={{ color: '#3498DB' }} />
                  <Typography variant="body2" fontWeight={600}>
                    Idea clave
                  </Typography>
                </Stack>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Cuando apartas primero, reduces la tentacion de gastar y conviertes el ahorro en
                  un habito automatico.
                </Typography>
              </Paper>

              <Button
                fullWidth
                variant="contained"
                onClick={() => setStep(1)}
                sx={{ bgcolor: '#3498DB', '&:hover': { bgcolor: '#2c81bb' } }}
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
                Ejemplos de ahorro planificado
              </Typography>
              <Stack spacing={1.25}>
                {[
                  { title: 'Ahorro fijo', desc: 'Separar $200 cada semana apenas recibes tu ingreso.' },
                  { title: 'Ahorro por meta', desc: 'Reservar $500 al mes para tu fondo de emergencia.' },
                  { title: 'Ahorro automatizado', desc: 'Domiciliar un traspaso recurrente a tu cuenta de ahorro.' }
                ].map((b, i) => (
                  <Paper key={i} sx={{ p: 2, borderRadius: 3 }}>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <TipsAndUpdatesIcon sx={{ color: '#2ECC71' }} />
                      <Typography fontWeight={600}>{b.title}</Typography>
                    </Stack>
                    <Typography variant="body2" sx={{ mt: 0.5 }}>
                      {b.desc}
                    </Typography>
                  </Paper>
                ))}
              </Stack>

              <Button
                fullWidth
                variant="contained"
                onClick={() => setStep(2)}
                sx={{ bgcolor: '#3498DB', '&:hover': { bgcolor: '#2c81bb' } }}
              >
                Ir al mini-reto
              </Button>
            </Stack>
          </Fade>
        )}

        {step === 2 && (
          <Fade in>
            <Stack spacing={2} alignItems="center">
              <Typography variant="h6" fontWeight={800}>
                Mini-reto: cual opcion define mejor el ahorro?
              </Typography>

              <Stack spacing={1.25} sx={{ width: '100%' }}>
                {[
                  { key: 'a', label: 'Lo que sobra si no gaste todo.' },
                  { key: 'b', label: 'Un monto planeado que aparto antes de gastar.' },
                  { key: 'c', label: 'Comprar a meses sin intereses.' }
                ].map((o) => (
                  <Button
                    key={o.key}
                    variant={answer === o.key ? 'contained' : 'outlined'}
                    onClick={() => setAnswer(o.key as Answer)}
                    sx={{
                      textTransform: 'none',
                      borderColor: '#3498DB',
                      color: '#1f6fa6',
                      '&.MuiButton-contained': {
                        bgcolor: o.key === 'b' ? '#2ECC71' : '#E74C3C',
                        color: '#fff'
                      }
                    }}
                  >
                    {o.label}
                  </Button>
                ))}
              </Stack>

              {answer && (
                <Chip
                  color={correct ? 'success' : 'error'}
                  label={
                    correct
                      ? 'Exacto: ahorrar es separar intencionalmente.'
                      : 'Intenta de nuevo. El ahorro es planificado.'
                  }
                />
              )}

              <Button
                startIcon={<ArrowForwardIcon />}
                variant="outlined"
                onClick={() => setStep(1)}
                sx={{ display: answer ? 'inline-flex' : 'none' }}
              >
                Revisar concepto
              </Button>
            </Stack>
          </Fade>
        )}
      </Box>
    </LessonShell>
  );
}
