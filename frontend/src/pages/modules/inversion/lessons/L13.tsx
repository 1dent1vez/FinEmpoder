import { useEffect, useState } from 'react';
import { Box, Paper, Stack, Typography, TextField, Button, Alert, ToggleButton, ToggleButtonGroup } from '@mui/material';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import LessonShell from '../LessonShell';
import { lessonProgressRepository } from '../../../../db/lessonProgress.repository';

export default function L13() {
  const [meta, setMeta] = useState('');
  const [plazo, setPlazo] = useState<'corto' | 'medio' | 'largo' | null>(null);
  const [aportacion, setAportacion] = useState('');
  const [confirmado, setConfirmado] = useState(false);

  const completo = meta.trim() !== '' && plazo !== null && aportacion.trim() !== '' && confirmado;

  useEffect(() => {
    if (!completo) return;
    lessonProgressRepository
      .setCompleted('inversion', 'L13')
      .catch((err) => console.error('Error guardando progreso offline L13', err));
  }, [completo]);

  const guardar = () => setConfirmado(true);

  return (
    <LessonShell
      id="L13"
      title="Plan de inversión personal"
      completeWhen={completo}
      nextPath="/app/inversion/lesson/L14"
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
            <AssignmentTurnedInIcon color="warning" />
            <Typography fontWeight={800}>Formulario guiado</Typography>
          </Stack>
          <Typography variant="body2" color="text.secondary">
            Define tu meta, horizonte y aportación inicial. Guarda para cerrar la lección.
          </Typography>
        </Paper>

        <Stack spacing={2}>
          <TextField
            label="Meta de inversión (ej. laptop, fondo de estudios)"
            value={meta}
            onChange={(e) => setMeta(e.target.value)}
            fullWidth
          />
          <Box>
            <Typography fontWeight={700}>Horizonte</Typography>
            <ToggleButtonGroup
              exclusive
              value={plazo}
              onChange={(_, v) => setPlazo(v)}
              sx={{ mt: 1 }}
              fullWidth
            >
              <ToggleButton value="corto">Corto (&lt;1 año)</ToggleButton>
              <ToggleButton value="medio">Medio (1-3 años)</ToggleButton>
              <ToggleButton value="largo">Largo (&gt;3 años)</ToggleButton>
            </ToggleButtonGroup>
          </Box>
          <TextField
            label="Aportación mensual estimada"
            value={aportacion}
            onChange={(e) => setAportacion(e.target.value)}
            fullWidth
          />

          <Button
            variant="contained"
            onClick={guardar}
            disabled={meta.trim() === '' || plazo === null || aportacion.trim() === ''}
            sx={{ bgcolor: '#F5B041', '&:hover': { bgcolor: '#F39C12' } }}
          >
            Guardar plan
          </Button>

          {confirmado && (
            <Alert severity="success" variant="outlined">
              Plan guardado. Vincula tu perfil de riesgo para elegir instrumentos adecuados.
            </Alert>
          )}
        </Stack>
      </Box>
    </LessonShell>
  );
}
