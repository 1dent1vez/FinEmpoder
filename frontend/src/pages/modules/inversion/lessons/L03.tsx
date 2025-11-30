import { useEffect, useMemo, useState } from 'react';
import {
  Stack,
  Typography,
  Paper,
  RadioGroup,
  FormControlLabel,
  Radio,
  LinearProgress,
  Alert
} from '@mui/material';
import LessonShell from '../LessonShell';
import { lessonProgressRepository } from '../../../../db/lessonProgress.repository';

type Answer = 'a' | 'b' | 'c' | null;

export default function L03() {
  const [q1, setQ1] = useState<Answer>(null);
  const [q2, setQ2] = useState<Answer>(null);
  const [q3, setQ3] = useState<Answer>(null);

  const answered = useMemo(
    () => Number(q1 !== null) + Number(q2 !== null) + Number(q3 !== null),
    [q1, q2, q3]
  );
  const correctCount =
    Number(q1 === 'b') + // rendimiento es lo que gana tu dinero
    Number(q2 === 'c') + // plazo es el tiempo que lo dejas invertido
    Number(q3 === 'a'); // liquidez es qué tan rápido retiras
  const isPerfect = correctCount === 3;

  useEffect(() => {
    if (!isPerfect) return;
    lessonProgressRepository
      .setCompleted('inversion', 'L03')
      .catch((err) => console.error('Error guardando progreso offline L03', err));
  }, [isPerfect]);

  return (
    <LessonShell
      id="L03"
      title="Variables clave: rendimiento, riesgo, plazo y liquidez"
      completeWhen={isPerfect}
      nextPath="/app/inversion/lesson/L04"
      overviewPath="/app/inversion"
    >
      <Stack spacing={2}>
        <LinearProgress
          variant="determinate"
          value={(answered / 3) * 100}
          sx={{
            height: 8,
            borderRadius: 5,
            bgcolor: '#f0f0f0',
            '& .MuiLinearProgress-bar': { bgcolor: '#F5B041' }
          }}
        />

        <Paper sx={{ p: 2, borderRadius: 3 }}>
          <Typography fontWeight={700}>1) ¿Qué es el rendimiento?</Typography>
          <RadioGroup value={q1 ?? ''} onChange={(e) => setQ1(e.target.value as Answer)}>
            <FormControlLabel value="a" control={<Radio />} label="El plazo mínimo para recuperar tu dinero" />
            <FormControlLabel value="b" control={<Radio />} label="Lo que gana tu dinero en la inversión" />
            <FormControlLabel value="c" control={<Radio />} label="La comisión que pagas al intermediario" />
          </RadioGroup>
        </Paper>

        <Paper sx={{ p: 2, borderRadius: 3 }}>
          <Typography fontWeight={700}>2) ¿Qué significa plazo?</Typography>
          <RadioGroup value={q2 ?? ''} onChange={(e) => setQ2(e.target.value as Answer)}>
            <FormControlLabel value="a" control={<Radio />} label="El monto inicial invertido" />
            <FormControlLabel value="b" control={<Radio />} label="El riesgo máximo permitido" />
            <FormControlLabel value="c" control={<Radio />} label="Tiempo que dejas invertido tu dinero" />
          </RadioGroup>
        </Paper>

        <Paper sx={{ p: 2, borderRadius: 3 }}>
          <Typography fontWeight={700}>3) ¿Qué es la liquidez?</Typography>
          <RadioGroup value={q3 ?? ''} onChange={(e) => setQ3(e.target.value as Answer)}>
            <FormControlLabel value="a" control={<Radio />} label="Qué tan rápido puedes retirar tu dinero" />
            <FormControlLabel value="b" control={<Radio />} label="La tasa anual ofrecida" />
            <FormControlLabel value="c" control={<Radio />} label="El riesgo de que baje el precio" />
          </RadioGroup>
        </Paper>

        {answered === 3 && (
          <Alert severity={isPerfect ? 'success' : 'warning'} variant="outlined">
            {isPerfect
              ? '¡Excelente! Identificaste correctamente las variables clave.'
              : 'Revisa tus respuestas hasta que las 3 sean correctas.'}
          </Alert>
        )}
      </Stack>
    </LessonShell>
  );
}
