import { useEffect, useMemo, useState } from 'react';
import { Box, Paper, Stack, Typography, RadioGroup, FormControlLabel, Radio, Alert } from '@mui/material';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import LessonShell from '../LessonShell';
import { lessonProgressRepository } from '../../../../db/lessonProgress.repository';

type Perfil = 'conservador' | 'moderado' | 'agresivo' | null;

const TIP = {
  conservador: 'Prioriza deuda gubernamental y liquidez. Mantén variable &lt;25%.',
  moderado: 'Combina deuda (40-50%) con renta variable diversificada (30-40%) y liquidez de respaldo.',
  agresivo: 'Mayor peso en renta variable/ETFs (60-70%). Rebalancea y respeta horizonte largo.'
};

export default function L14() {
  const [perfil, setPerfil] = useState<Perfil>(null);

  useEffect(() => {
    if (!perfil) return;
    lessonProgressRepository
      .setCompleted('inversion', 'L14')
      .catch((err) => console.error('Error guardando progreso offline L14', err));
  }, [perfil]);

  const mensaje = useMemo(() => (perfil ? TIP[perfil] : ''), [perfil]);

  return (
    <LessonShell
      id="L14"
      title="Retroalimentación con Finni"
      completeWhen={!!perfil}
      nextPath="/app/inversion/lesson/L15"
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
            <LightbulbIcon color="warning" />
            <Typography fontWeight={800}>Micro-feedback</Typography>
          </Stack>
          <Typography variant="body2" color="text.secondary">
            Selecciona tu perfil de riesgo para recibir un consejo rápido de Finni.
          </Typography>
        </Paper>

        <Paper sx={{ p: 2, borderRadius: 3 }}>
          <Typography fontWeight={700}>¿Cuál es tu perfil?</Typography>
          <RadioGroup value={perfil ?? ''} onChange={(e) => setPerfil(e.target.value as Perfil)}>
            <FormControlLabel value="conservador" control={<Radio />} label="Conservador" />
            <FormControlLabel value="moderado" control={<Radio />} label="Moderado" />
            <FormControlLabel value="agresivo" control={<Radio />} label="Agresivo" />
          </RadioGroup>
        </Paper>

        {perfil && (
          <Alert severity="success" variant="outlined" sx={{ mt: 2 }}>
            {mensaje}
          </Alert>
        )}
      </Box>
    </LessonShell>
  );
}
