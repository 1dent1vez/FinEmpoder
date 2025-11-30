import { useEffect, useMemo, useState } from 'react';
import {
  Paper,
  Stack,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  Alert
} from '@mui/material';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import LessonShell from '../LessonShell';
import { lessonProgressRepository } from '../../../../db/lessonProgress.repository';

type Answer = 'a' | 'b' | 'c' | null;

export default function L08() {
  const [q1, setQ1] = useState<Answer>(null);
  const [q2, setQ2] = useState<Answer>(null);
  const [q3, setQ3] = useState<Answer>(null);
  const [guardado, setGuardado] = useState(false);

  const score = useMemo(
    () =>
      (q1 === 'a' ? 1 : q1 === 'b' ? 2 : q1 === 'c' ? 3 : 0) +
      (q2 === 'a' ? 1 : q2 === 'b' ? 2 : q2 === 'c' ? 3 : 0) +
      (q3 === 'a' ? 1 : q3 === 'b' ? 2 : q3 === 'c' ? 3 : 0),
    [q1, q2, q3]
  );

  const answeredAll = !!(q1 && q2 && q3);
  const profile =
    score <= 4 ? 'Conservador' : score <= 6 ? 'Moderado' : 'Agresivo';

  const complete = answeredAll && guardado;

  useEffect(() => {
    if (!complete) return;
    lessonProgressRepository
      .setCompleted('inversion', 'L08')
      .catch((err) => console.error('Error guardando progreso offline L08', err));
  }, [complete]);

  const guardar = () => {
    if (answeredAll) setGuardado(true);
  };

  return (
    <LessonShell
      id="L08"
      title="Perfil del inversionista"
      completeWhen={complete}
      nextPath="/app/inversion/lesson/L09"
      overviewPath="/app/inversion"
    >
      <Stack spacing={2}>
        <Paper
          sx={{
            p: 2,
            borderRadius: 3,
            bgcolor: '#FFF8E1',
            borderLeft: '6px solid #F5B041'
          }}
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <PersonSearchIcon color="warning" />
            <Typography fontWeight={800}>Cuestionario diagnóstico</Typography>
          </Stack>
          <Typography variant="body2" color="text.secondary">
            Responde y guarda tu perfil. No hay respuestas correctas; solo mide tu tolerancia al riesgo.
          </Typography>
        </Paper>

        <Paper sx={{ p: 2, borderRadius: 3 }}>
          <Typography fontWeight={700}>1) ¿Cómo reaccionas ante la volatilidad?</Typography>
          <RadioGroup value={q1 ?? ''} onChange={(e) => setQ1(e.target.value as Answer)}>
            <FormControlLabel value="a" control={<Radio />} label="Prefiero no ver caídas, quiero estabilidad." />
            <FormControlLabel value="b" control={<Radio />} label="Toleraría bajas moderadas a cambio de mejores retornos." />
            <FormControlLabel value="c" control={<Radio />} label="Acepto variaciones fuertes por rendimientos altos." />
          </RadioGroup>
        </Paper>

        <Paper sx={{ p: 2, borderRadius: 3 }}>
          <Typography fontWeight={700}>2) Horizonte de tu meta principal</Typography>
          <RadioGroup value={q2 ?? ''} onChange={(e) => setQ2(e.target.value as Answer)}>
            <FormControlLabel value="a" control={<Radio />} label="Menos de 1 año" />
            <FormControlLabel value="b" control={<Radio />} label="Entre 1 y 3 años" />
            <FormControlLabel value="c" control={<Radio />} label="Más de 3 años" />
          </RadioGroup>
        </Paper>

        <Paper sx={{ p: 2, borderRadius: 3 }}>
          <Typography fontWeight={700}>3) ¿Qué porcentaje pondrías en renta variable?</Typography>
          <RadioGroup value={q3 ?? ''} onChange={(e) => setQ3(e.target.value as Answer)}>
            <FormControlLabel value="a" control={<Radio />} label="0%-20%" />
            <FormControlLabel value="b" control={<Radio />} label="21%-50%" />
            <FormControlLabel value="c" control={<Radio />} label="51%-80%" />
          </RadioGroup>
        </Paper>

        {answeredAll && (
          <Alert severity="info" variant="outlined">
            Tu perfil estimado: <strong>{profile}</strong>. Guarda para continuar.
          </Alert>
        )}

        <Button variant="contained" onClick={guardar} disabled={!answeredAll}>
          Guardar perfil
        </Button>

        {guardado && (
          <Alert severity="success" variant="outlined">
            Perfil registrado: {profile}. Usa este resultado para diversificar.
          </Alert>
        )}
      </Stack>
    </LessonShell>
  );
}
