import { useEffect, useState } from 'react';
import { Box, Paper, Stack, Typography, Chip, Button } from '@mui/material';
import SavingsIcon from '@mui/icons-material/Savings';
import LessonShell from '../LessonShell';
import { lessonProgressRepository } from '../../../../db/lessonProgress.repository';

const ITEMS = [
  {
    title: 'CETES',
    desc: 'Bonos del gobierno mexicano. Plazos cortos, riesgo bajo, liquidez semanal/quincenal.',
    tag: 'Riesgo bajo'
  },
  {
    title: 'BONDES',
    desc: 'Bonos de desarrollo. Pagan tasa variable ligada a referencias; adecuados para horizontes medios.',
    tag: 'Riesgo bajo-medio'
  },
  {
    title: 'PRLV',
    desc: 'Pagarés bancarios. Otorgan tasa fija a plazo; revisa solvencia del banco y comisiones.',
    tag: 'Banca múltiple'
  }
];

export default function L06() {
  const [entendido, setEntendido] = useState(false);

  useEffect(() => {
    if (!entendido) return;
    lessonProgressRepository
      .setCompleted('inversion', 'L06')
      .catch((err) => console.error('Error guardando progreso offline L06', err));
  }, [entendido]);

  return (
    <LessonShell
      id="L06"
      title="Instrumentos de deuda: CETES, BONDES, PRLV"
      completeWhen={entendido}
      nextPath="/app/inversion/lesson/L07"
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
            <SavingsIcon color="warning" />
            <Typography fontWeight={800}>Fichas rápidas</Typography>
          </Stack>
          <Typography variant="body2" color="text.secondary">
            Deuda = prestar tu dinero a gobierno o bancos a cambio de intereses. Lee cada ficha.
          </Typography>
        </Paper>

        <Stack spacing={1.5}>
          {ITEMS.map((item) => (
            <Paper key={item.title} sx={{ p: 2, borderRadius: 3 }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography fontWeight={800}>{item.title}</Typography>
                <Chip size="small" label={item.tag} />
              </Stack>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                {item.desc}
              </Typography>
            </Paper>
          ))}
        </Stack>

        <Button
          fullWidth
          variant={entendido ? 'contained' : 'outlined'}
          sx={{ mt: 2 }}
          onClick={() => setEntendido(true)}
        >
          Listo, entiendo cómo funcionan
        </Button>
      </Box>
    </LessonShell>
  );
}
