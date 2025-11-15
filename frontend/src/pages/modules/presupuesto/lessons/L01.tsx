import { useState } from 'react';
import {
  Typography,
  Box,
  Button,
  Paper,
  Stack,
  Fade,
  LinearProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import LessonShell from '../LessonShell';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import PsychologyIcon from '@mui/icons-material/Psychology';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import HomeIcon from '@mui/icons-material/Home';

export default function L01() {
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [correct, setCorrect] = useState(false);
  const nav = useNavigate();

  const handleQuiz = (option: string) => {
    setSelected(option);
    setCorrect(option === 'b');
  };

  const next = () => setStep((s) => Math.min(s + 1, 2));

  return (
    <LessonShell
      id="L01"
      title="¿Por qué hacer un presupuesto?"
      completeWhen={correct}
    >
      <Box sx={{ p: 1 }}>
        {/* Progreso visual */}
        <LinearProgress
          variant="determinate"
          value={(step / 2) * 100}
          sx={{
            mb: 2,
            height: 8,
            borderRadius: 5,
            bgcolor: '#f0f0f0',
            '& .MuiLinearProgress-bar': { bgcolor: '#F5B041' },
          }}
        />

        {/* PASO 1 */}
        {step === 0 && (
          <Fade in>
            <Stack spacing={2}>
              <Typography variant="body1">
                Imagina que tu dinero es como un equipo de futbol ⚽: sin una estrategia clara,
                ¡cada jugador corre por su cuenta! El presupuesto es ese plan de juego que te dice
                cómo usar tus recursos para alcanzar tus metas financieras.
              </Typography>

              <Paper
                sx={{
                  p: 2,
                  borderRadius: 3,
                  bgcolor: '#FFF8E1',
                  borderLeft: '6px solid #F5B041',
                }}
              >
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <PsychologyIcon sx={{ color: '#F5B041' }} />
                  <Typography variant="body2" fontWeight={600}>
                    ¿Sabías que…?
                  </Typography>
                </Stack>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Las personas que hacen presupuestos ahorran hasta un 30% más cada mes,
                  según estudios de educación financiera en jóvenes universitarios (ENIF, 2023).
                </Typography>
              </Paper>

              <Button
                fullWidth
                variant="contained"
                sx={{
                  bgcolor: '#F5B041',
                  '&:hover': { bgcolor: '#F39C12' },
                }}
                onClick={next}
              >
                Continuar
              </Button>
            </Stack>
          </Fade>
        )}

        {/* PASO 2 */}
        {step === 1 && (
          <Fade in>
            <Stack spacing={2}>
              <Typography variant="h6" fontWeight={800}>
                Beneficios de tener un presupuesto
              </Typography>

              <Stack spacing={1.5}>
                {[
                  {
                    title: 'Te da claridad',
                    desc: 'Sabes exactamente en qué gastas y cuánto puedes ahorrar cada mes.',
                  },
                  {
                    title: 'Evita deudas innecesarias',
                    desc: 'Te ayuda a decidir si una compra realmente encaja con tus ingresos.',
                  },
                  {
                    title: 'Reduce el estrés financiero',
                    desc: 'Tener control sobre tu dinero te da tranquilidad mental.',
                  },
                ].map((b, i) => (
                  <Paper key={i} sx={{ p: 2, borderRadius: 3 }}>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <TipsAndUpdatesIcon sx={{ color: '#E67E22' }} />
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
                sx={{
                  bgcolor: '#F5B041',
                  '&:hover': { bgcolor: '#F39C12' },
                }}
                onClick={next}
              >
                ¡Vamos al mini-reto!
              </Button>
            </Stack>
          </Fade>
        )}

        {/* PASO 3 - QUIZ */}
        {step === 2 && (
          <Fade in>
            <Stack spacing={2} alignItems="center">
              <Typography variant="h6" fontWeight={800}>
                🧠 Mini Reto: ¿Cuál es la principal función de un presupuesto?
              </Typography>

              <Stack spacing={1.5} sx={{ width: '100%' }}>
                {[
                  {
                    key: 'a',
                    label: 'Registrar mis deudas para preocuparme después',
                  },
                  {
                    key: 'b',
                    label:
                      'Organizar ingresos y gastos para tomar mejores decisiones',
                  },
                  {
                    key: 'c',
                    label: 'Gastar sin límites porque el dinero siempre vuelve',
                  },
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
                        bgcolor: o.key === 'b' ? '#2ECC71' : '#E74C3C',
                        color: '#fff',
                      },
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
                    fontWeight: 600,
                  }}
                >
                  {correct
                    ? '¡Correcto! Ya dominas la base de la presupuestación 🎯'
                    : 'Ups... inténtalo otra vez.'}
                </Typography>
              )}

              {/* PANTALLA FINAL */}
              {correct && (
                <Fade in>
                  <Paper
                    elevation={2}
                    sx={{
                      mt: 3,
                      p: 3,
                      borderRadius: 3,
                      bgcolor: '#E8F5E9',
                      textAlign: 'center',
                    }}
                  >
                    <EmojiEventsIcon sx={{ color: '#27AE60', fontSize: 50 }} />
                    <Typography fontWeight={700} sx={{ mt: 1, mb: 2 }}>
                      ¡Lección completada!
                    </Typography>

                    <Stack spacing={1.5}>
                      <Button
                        variant="contained"
                        startIcon={<ArrowForwardIcon />}
                        sx={{
                          bgcolor: '#F5B041',
                          '&:hover': { bgcolor: '#F39C12' },
                        }}
                        onClick={() => nav('/app/presupuesto/lesson/L02')}
                      >
                        Ir a la siguiente lección
                      </Button>

                      <Button
                        variant="outlined"
                        startIcon={<HomeIcon />}
                        onClick={() => nav('/app/presupuesto')}
                      >
                        Volver al menú del módulo
                      </Button>
                    </Stack>
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
