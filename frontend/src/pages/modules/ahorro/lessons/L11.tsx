import { useState } from 'react';
import { Box, Paper, Stack, Typography, Button, LinearProgress, Chip } from '@mui/material';
import LessonShell from '../LessonShell';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

export default function L11() {
  const [streak, setStreak] = useState(0);

  const handleDeposit = () => {
    setStreak((s) => Math.min(3, s + 1));
  };

  const complete = streak >= 3;

  return (
    <LessonShell
      id="L11"
      title="Micro-reto: tres depositos seguidos"
      completeWhen={complete}
      nextPath="/app/ahorro/lesson/L12"
      overviewPath="/app/ahorro"
    >
      <Box sx={{ p: 1 }}>
        <LinearProgress
          variant="determinate"
          value={(streak / 3) * 100}
          sx={{
            mb: 2,
            height: 8,
            borderRadius: 5,
            bgcolor: '#f0f0f0',
            '& .MuiLinearProgress-bar': { bgcolor: '#2ECC71' }
          }}
        />

        <Paper
          sx={{
            p: 2,
            borderRadius: 3,
            bgcolor: '#FFF4E0',
            borderLeft: '6px solid #F5B041',
            mb: 2
          }}
        >
          <Typography variant="body1">
            El reto es registrar tres depositos consecutivos (pueden ser simulados) para reforzar la
            constancia. Presiona el boton cada vez que completes uno.
          </Typography>
        </Paper>

        <Stack spacing={1.25}>
          {[0, 1, 2].map((i) => (
            <Paper
              key={i}
              sx={{
                p: 1.5,
                borderRadius: 3,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <Typography>Deposito {i + 1}</Typography>
              <Chip
                icon={streak > i ? <CheckCircleIcon /> : undefined}
                color={streak > i ? 'success' : 'default'}
                label={streak > i ? 'Listo' : 'Pendiente'}
              />
            </Paper>
          ))}
        </Stack>

        <Button
          fullWidth
          variant="contained"
          sx={{ mt: 2, bgcolor: '#2ECC71', '&:hover': { bgcolor: '#27AE60' } }}
          onClick={handleDeposit}
          disabled={complete}
        >
          Registrar deposito
        </Button>
      </Box>
    </LessonShell>
  );
}
