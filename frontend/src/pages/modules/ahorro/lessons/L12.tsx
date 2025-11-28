import { useState } from 'react';
import {
  Box,
  Paper,
  Stack,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  LinearProgress,
  Chip
} from '@mui/material';
import LessonShell from '../LessonShell';

type Answer = 'a' | 'b' | 'c' | null;

export default function L12() {
  const [q1, setQ1] = useState<Answer>(null);
  const [q2, setQ2] = useState<Answer>(null);
  const [q3, setQ3] = useState<Answer>(null);

  const answered = Number(q1 !== null) + Number(q2 !== null) + Number(q3 !== null);
  const correct =
    Number(q1 === 'b') + // seguro protege tus ahorros
    Number(q2 === 'a') + // deducible = parte que pagas
    Number(q3 === 'c'); // ahorro + seguro evitan descapitalizarse

  const allCorrect = answered === 3 && correct === 3;

  return (
    <LessonShell
      id="L12"
      title="Ahorro y seguros"
      completeWhen={allCorrect}
      nextPath="/app/ahorro/lesson/L13"
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
            '& .MuiLinearProgress-bar': { bgcolor: '#3498DB' }
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
            Relaciona tu ahorro con seguros: protegen tu fondo ante riesgos y evitan que lo uses
            por completo en un siniestro.
          </Typography>
        </Paper>

        <Stack spacing={1.5}>
          <Question
            label="1) Por que un seguro complementa tu ahorro?"
            value={q1}
            onChange={setQ1}
            options={[
              ['a', 'Porque hace que gastes menos en todo.'],
              ['b', 'Porque evita usar todo tu fondo en un imprevisto grande.'],
              ['c', 'Porque elimina la necesidad de ahorrar.']
            ]}
          />

          <Question
            label="2) Que es el deducible?"
            value={q2}
            onChange={setQ2}
            options={[
              ['a', 'La parte que pagas de tu bolsillo antes de que aplique el seguro.'],
              ['b', 'El premio que te devuelve el seguro.'],
              ['c', 'El total del siniestro.']
            ]}
          />

          <Question
            label="3) Mejor estrategia ante un imprevisto de salud"
            value={q3}
            onChange={setQ3}
            options={[
              ['a', 'Usar solo ahorro y esperar reponerlo algun dia.'],
              ['b', 'Pedir un prestamo rapido.'],
              ['c', 'Usar seguro y complementar con parte del fondo de emergencia.']
            ]}
          />
        </Stack>

        {allCorrect && (
          <Chip
            color="success"
            sx={{ mt: 2 }}
            label="Listo: entendiste como se complementan ahorro y seguros."
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
