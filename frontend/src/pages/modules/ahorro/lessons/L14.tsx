import { useMemo, useState } from 'react';
import {
  Box,
  Paper,
  Stack,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  Chip,
  LinearProgress
} from '@mui/material';
import LessonShell from '../LessonShell';

type Answer = 'a' | 'b' | 'c' | null;

export default function L14() {
  const [q1, setQ1] = useState<Answer>(null);
  const [q2, setQ2] = useState<Answer>(null);
  const [q3, setQ3] = useState<Answer>(null);

  const answered = Number(q1 !== null) + Number(q2 !== null) + Number(q3 !== null);
  const complete = answered === 3;

  const profile = useMemo(() => {
    const scores = { metodico: 0, impulsivo: 0, preventivo: 0 };
    if (q1 === 'a') scores.metodico += 1;
    if (q1 === 'b') scores.impulsivo += 1;
    if (q1 === 'c') scores.preventivo += 1;
    if (q2 === 'a') scores.metodico += 1;
    if (q2 === 'b') scores.impulsivo += 1;
    if (q2 === 'c') scores.preventivo += 1;
    if (q3 === 'a') scores.preventivo += 1;
    if (q3 === 'b') scores.metodico += 1;
    if (q3 === 'c') scores.impulsivo += 1;

    const winner = Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0];
    return winner;
  }, [q1, q2, q3]);

  const profileText: Record<string, string> = {
    metodico: 'Metodico: sigues reglas y te conviene automatizar para mantener el ritmo.',
    impulsivo: 'Impulsivo: necesitas frenos visuales y recordatorios para no gastar tu ahorro.',
    preventivo: 'Preventivo: priorizas seguridad, refuerza tu fondo de emergencia 1-3-6.'
  };

  return (
    <LessonShell
      id="L14"
      title="Autoevaluacion del habito de ahorro"
      completeWhen={complete}
      nextPath="/app/ahorro/lesson/L15"
      overviewPath="/app/ahorro"
    >
      <Box sx={{ p: 1 }}>
        <LinearProgress
          variant="determinate"
          value={(answered / 3) * 100}
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
          <Typography variant="body1">
            Responde rapido. Obtendras un perfil y una recomendacion para fortalecer tu habito de
            ahorro.
          </Typography>
        </Paper>

        <Stack spacing={1.5}>
          <Question
            label="1) Cuando recibes dinero, que haces primero?"
            value={q1}
            onChange={setQ1}
            options={[
              ['a', 'Separar ahorro en cuanto llega.'],
              ['b', 'Compras algo que querias y luego ves.'],
              ['c', 'Pagas deudas o emergencias antes de todo.']
            ]}
          />
          <Question
            label="2) Como reaccionas a un imprevisto?"
            value={q2}
            onChange={setQ2}
            options={[
              ['a', 'Usas tu fondo y repones despues.'],
              ['b', 'Pides prestado rapidamente.'],
              ['c', 'Recortas gastos y ajustas para cubrirlo.']
            ]}
          />
          <Question
            label="3) Que te motiva a ahorrar?"
            value={q3}
            onChange={setQ3}
            options={[
              ['a', 'Tener un colchoncito por si acaso.'],
              ['b', 'Cumplir metas rapidas o retos.'],
              ['c', 'Seguir un plan con fecha y monto.']
            ]}
          />
        </Stack>

        {complete && (
          <Chip
            color="success"
            sx={{ mt: 2 }}
            label={profileText[profile]}
          />
        )}
      </Box>
    </LessonShell>
  );
}

function Question({
  label,
  value,
  onChange,
  options
}: {
  label: string;
  value: Answer;
  onChange: (val: Answer) => void;
  options: [Answer, string][];
}) {
  return (
    <Paper sx={{ p: 2, borderRadius: 3 }}>
      <Typography fontWeight={700} sx={{ mb: 1 }}>
        {label}
      </Typography>
      <RadioGroup value={value ?? ''} onChange={(e) => onChange(e.target.value as Answer)}>
        {options.map(([k, txt]) => (
          <FormControlLabel key={k} value={k} control={<Radio />} label={txt} />
        ))}
      </RadioGroup>
    </Paper>
  );
}
