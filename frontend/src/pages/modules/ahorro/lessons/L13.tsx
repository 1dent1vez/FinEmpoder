import { useState } from 'react';
import { Box, Paper, Stack, Typography, Switch, FormControlLabel, Chip } from '@mui/material';
import LessonShell from '../LessonShell';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import SavingsIcon from '@mui/icons-material/Savings';

export default function L13() {
  const [reminders, setReminders] = useState({
    weekly: true,
    payday: false,
    goal: false
  });

  const toggle = (key: keyof typeof reminders) => {
    setReminders((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const activeCount = Object.values(reminders).filter(Boolean).length;
  const complete = activeCount > 0;

  return (
    <LessonShell
      id="L13"
      title="Empujoncitos financieros (recordatorios)"
      completeWhen={complete}
      nextPath="/app/ahorro/lesson/L14"
      overviewPath="/app/ahorro"
    >
      <Box sx={{ p: 1 }}>
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
            Activa recordatorios para sostener tu habito de ahorro. Pueden ser notificaciones,
            eventos en calendario o mensajes en tu app de notas.
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            <Chip icon={<NotificationsActiveIcon />} label="Notificacion" />
            <Chip icon={<CalendarTodayIcon />} label="Calendario" />
            <Chip icon={<SavingsIcon />} label="Meta" />
          </Stack>
        </Paper>

        <Stack spacing={1.25}>
          <Card
            title="Recordatorio semanal"
            desc="Cada domingo revisa tu ahorro y planea el siguiente deposito."
            checked={reminders.weekly}
            onToggle={() => toggle('weekly')}
          />
          <Card
            title="Dia de pago"
            desc="Al recibir ingreso, separa primero el monto de ahorro."
            checked={reminders.payday}
            onToggle={() => toggle('payday')}
          />
          <Card
            title="Empujon de meta"
            desc="Mensaje motivacional el dia 10 de cada mes."
            checked={reminders.goal}
            onToggle={() => toggle('goal')}
          />
        </Stack>

        <Typography variant="caption" color="text.secondary" sx={{ mt: 1.5, display: 'block' }}>
          Activos: {activeCount} recordatorios.
        </Typography>
      </Box>
    </LessonShell>
  );
}

function Card({
  title,
  desc,
  checked,
  onToggle
}: {
  title: string;
  desc: string;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <Paper sx={{ p: 1.5, borderRadius: 3 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Box sx={{ mr: 2 }}>
          <Typography fontWeight={700}>{title}</Typography>
          <Typography variant="body2" color="text.secondary">
            {desc}
          </Typography>
        </Box>
        <FormControlLabel control={<Switch checked={checked} onChange={onToggle} />} label="On" />
      </Stack>
    </Paper>
  );
}
