import { useState } from 'react';
import {
  Stack,
  Typography,
  Paper,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  LinearProgress,
} from '@mui/material';
import LessonShell from '../LessonShell';

type Answer = 'a' | 'b' | 'c' | null;

export default function L02() {
  const [started, setStarted] = useState(false);
  const [q1, setQ1] = useState<Answer>(null);
  const [q2, setQ2] = useState<Answer>(null);
  const [q3, setQ3] = useState<Answer>(null);

  const answered = Number(q1 !== null) + Number(q2 !== null) + Number(q3 !== null);
  const correctCount =
    Number(q1 === 'b') + // Beca mensual fija = ingreso fijo
    Number(q2 === 'b') + // Horas extra = ingreso variable
    Number(q3 === 'b');  // Comisiones por venta = variable
  const isPerfect = correctCount === 3;

  return (
    <LessonShell
      id="L02"
      title="Ingresos: fijos y variables"
      completeWhen={isPerfect}
      nextPath="/app/presupuesto/lesson/L03"
      overviewPath="/app/presupuesto"
    >
      {/* Intro */}
      {!started && (
        <Paper
          sx={{
            p: 2,
            borderRadius: 3,
            bgcolor: '#FFF8E1',
            borderLeft: '6px solid #F5B041',
          }}
        >
          <Typography variant="body1" sx={{ mb: 1 }}>
            Identifica qué ingresos son fijos y cuáles son variables. Los fijos se repiten con
            monto y frecuencia similares; los variables cambian mes a mes.
          </Typography>
          <Button
            fullWidth
            variant="contained"
            onClick={() => setStarted(true)}
            sx={{ mt: 1, bgcolor: '#F5B041', '&:hover': { bgcolor: '#F39C12' } }}
          >
            Comenzar mini-quiz
          </Button>
        </Paper>
      )}

      {/* Quiz */}
      {started && (
        <Stack spacing={2} sx={{ mt: 1 }}>
          <LinearProgress
            variant="determinate"
            value={(answered / 3) * 100}
            sx={{
              height: 8,
              borderRadius: 5,
              bgcolor: '#f0f0f0',
              '& .MuiLinearProgress-bar': { bgcolor: '#F5B041' },
            }}
          />

          <Paper sx={{ p: 2, borderRadius: 3 }}>
            <Typography fontWeight={700} sx={{ mb: 1 }}>
              1) ¿Cuál es un ingreso FIJO?
            </Typography>
            <RadioGroup value={q1 ?? ''} onChange={(e) => setQ1(e.target.value as Answer)}>
              <FormControlLabel value="a" control={<Radio />} label="Propina eventual por ayudar en casa" />
              <FormControlLabel value="b" control={<Radio />} label="Beca mensual con monto constante" />
              <FormControlLabel value="c" control={<Radio />} label="Venta esporádica por marketplace" />
            </RadioGroup>
          </Paper>

          <Paper sx={{ p: 2, borderRadius: 3 }}>
            <Typography fontWeight={700} sx={{ mb: 1 }}>
              2) ¿Cuál es un ingreso VARIABLE?
            </Typography>
            <RadioGroup value={q2 ?? ''} onChange={(e) => setQ2(e.target.value as Answer)}>
              <FormControlLabel value="a" control={<Radio />} label="Sueldo base quincenal" />
              <FormControlLabel value="b" control={<Radio />} label="Pago por horas extra" />
              <FormControlLabel value="c" control={<Radio />} label="Renta mensual del depa" />
            </RadioGroup>
          </Paper>

          <Paper sx={{ p: 2, borderRadius: 3 }}>
            <Typography fontWeight={700} sx={{ mb: 1 }}>
              3) ¿Qué ejemplo corresponde a un ingreso VARIABLE?
            </Typography>
            <RadioGroup value={q3 ?? ''} onChange={(e) => setQ3(e.target.value as Answer)}>
              <FormControlLabel value="a" control={<Radio />} label="Suscripción que pagas cada mes" />
              <FormControlLabel value="b" control={<Radio />} label="Comisiones por ventas realizadas" />
              <FormControlLabel value="c" control={<Radio />} label="Beca con monto fijo mensual" />
            </RadioGroup>
          </Paper>

          {!isPerfect && answered === 3 && (
            <Paper sx={{ p: 2, borderRadius: 3, bgcolor: '#FDEDEC' }}>
              <Typography fontWeight={700} color="#C0392B">
                Revisa tus respuestas. Necesitas responder correctamente las 3 para completar la lección.
              </Typography>
            </Paper>
          )}
          {isPerfect && (
            <Paper sx={{ p: 2, borderRadius: 3, bgcolor: '#E8F5E9' }}>
              <Typography fontWeight={700} color="#1E8449">
                Excelente. Lección aprobada. Puedes avanzar o volver al menú del módulo desde el panel inferior.
              </Typography>
            </Paper>
          )}
        </Stack>
      )}
    </LessonShell>
  );
}
