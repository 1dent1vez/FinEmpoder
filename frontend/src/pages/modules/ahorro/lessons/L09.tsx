import { useState } from 'react';
import { Box, Paper, Stack, Typography, Button, Chip, LinearProgress } from '@mui/material';
import LessonShell from '../LessonShell';
import AlarmIcon from '@mui/icons-material/Alarm';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import TaskAltIcon from '@mui/icons-material/TaskAlt';

export default function L09() {
  const [auto, setAuto] = useState(false);
  const progress = auto ? 100 : 60;

  return (
    <LessonShell
      id="L09"
      title="Automatiza tu ahorro"
      completeWhen={auto}
      nextPath="/app/ahorro/lesson/L10"
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

        <Paper
          sx={{
            p: 2,
            borderRadius: 3,
            bgcolor: '#EAF6FF',
            borderLeft: '6px solid #3498DB',
            mb: 2
          }}
        >
          <Typography variant="body1" sx={{ mb: 1 }}>
            Configura un recordatorio o cargo automatico para que tu ahorro ocurra sin depender de
            fuerza de voluntad.
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            <Chip icon={<AutorenewIcon />} label="Cargo programado" />
            <Chip icon={<AlarmIcon />} label="Recordatorio semanal" />
            <Chip icon={<TaskAltIcon />} label="Revisar cada mes" />
          </Stack>
        </Paper>

        <Stack spacing={1.25}>
          {[
            'Elige el dia posterior a tu ingreso.',
            'Define monto fijo o porcentaje.',
            'Activa transferencia recurrente o notificacion.',
            'Revisa y ajusta cada mes segun tu flujo.'
          ].map((s, i) => (
            <Paper key={s} sx={{ p: 1.5, borderRadius: 3 }}>
              <Stack direction="row" spacing={1}>
                <Chip label={i + 1} size="small" color="primary" />
                <Typography>{s}</Typography>
              </Stack>
            </Paper>
          ))}
        </Stack>

        <Button
          fullWidth
          variant="contained"
          sx={{ mt: 2, bgcolor: '#2ECC71', '&:hover': { bgcolor: '#27AE60' } }}
          onClick={() => setAuto(true)}
        >
          Simular activacion automatica
        </Button>
      </Box>
    </LessonShell>
  );
}
