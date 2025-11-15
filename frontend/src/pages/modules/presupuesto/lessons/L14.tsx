import { useMemo, useState } from 'react';
import {
  Box, Paper, Stack, Typography, LinearProgress,
  Button, RadioGroup, FormControlLabel, Radio, Chip, Collapse, Divider
} from '@mui/material';
import QuizIcon from '@mui/icons-material/Quiz';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import LessonShell from '../LessonShell';
import { useLessons } from '../../../../store/lessons';

// ---------- Banco de preguntas ----------
type Q = {
  id: string;
  prompt: string;
  options: string[];
  correct: number;      // índice correcto
  explain: string;      // explicación breve
};

const qs: Q[] = [
  {
    id: 'q1',
    prompt: 'Tu presupuesto debe…',
    options: [
      'Incluir solo gastos fijos',
      'Reflejar ingresos y todos los gastos por categorías',
      'Ser mensual y nunca cambiarse',
      'Depender de la tarjeta de crédito'
    ],
    correct: 1,
    explain: 'Un presupuesto sano lista ingresos y todos los gastos por categorías para tomar decisiones.'
  },
  {
    id: 'q2',
    prompt: 'Si detectas “gastos hormiga”, el primer paso eficaz es…',
    options: [
      'Ignorarlos porque son pequeños',
      'Pedir un préstamo',
      'Registrarlos a diario y fijar límites',
      'Eliminar el fondo de emergencia'
    ],
    correct: 2,
    explain: 'Registro + límites por categoría permite reducirlos de forma sostenida.'
  },
  {
    id: 'q3',
    prompt: 'Una señal de alerta en tu balance mensual es…',
    options: [
      'Superávit recurrente',
      'Déficit recurrente',
      'Gastar menos de lo presupuestado',
      'Ahorro automático'
    ],
    correct: 1,
    explain: 'Déficit constante indica que debes recortar o aumentar ingresos.'
  },
  {
    id: 'q4',
    prompt: 'La regla 50/30/20 sugiere que el 20% vaya a…',
    options: [
      'Entretenimiento',
      'Gastos esenciales',
      'Ahorro, metas y deudas',
      'Impuestos'
    ],
    correct: 2,
    explain: '20% se destina a ahorro/metas/abono a deudas para construir estabilidad.'
  },
  {
    id: 'q5',
    prompt: 'En una crisis, ¿qué priorizas?',
    options: [
      'Suscripciones y antojos',
      'Gastos esenciales y renegociación de servicios',
      'Compras a meses sin intereses',
      'Cambiar de celular'
    ],
    correct: 1,
    explain: 'Prioriza esenciales, renegocia, congela no esenciales.'
  },
  {
    id: 'q6',
    prompt: '¿Cuál es un objetivo SMART válido?',
    options: [
      'Ahorrar mucho',
      'Ahorrar $1,500/mes por 6 meses para fondo de emergencia',
      'Gastar menos',
      'Pagar todas mis deudas pronto'
    ],
    correct: 1,
    explain: 'Específico, medible, alcanzable, relevante y con tiempo definido.'
  }
];

// ---------- Vista ----------
export default function L14() {
  const { complete } = useLessons();

  // respuestas por id de pregunta: índice seleccionado o null
  const [ans, setAns] = useState<Record<string, number | null>>(
    () => Object.fromEntries(qs.map(q => [q.id, null]))
  );
  const [submitted, setSubmitted] = useState(false);

  const total = qs.length;
  const answered = useMemo(
    () => Object.values(ans).filter(v => v !== null).length,
    [ans]
  );
  const correctCount = useMemo(
    () => qs.reduce((acc, q) => acc + (ans[q.id] === q.correct ? 1 : 0), 0),
    [ans]
  );
  const score = Math.round((correctCount / total) * 100);
  const passed = score >= 80;

  const handleSelect = (qid: string, idx: number) => {
    if (submitted) return;
    setAns(a => ({ ...a, [qid]: idx }));
  };

  const handleSubmit = () => {
    setSubmitted(true);
    // guarda el score real; LessonShell marca completado si passed
    complete('L14', score);
  };

  return (
    <LessonShell
      id="L14"
      title="Evaluación: ¿Controlas tus finanzas?"
      completeWhen={submitted && passed}
      nextPath="/app/presupuesto"
      overviewPath="/app/presupuesto"
    >
      <Box sx={{ p: 1 }}>
        <Paper sx={{ p: 2, borderRadius: 3, mb: 2, bgcolor: '#FFF8E1', borderLeft: '6px solid #F5B041' }}>
          <Stack spacing={1}>
            <Stack direction="row" spacing={1} alignItems="center">
              <QuizIcon color="warning" />
              <Typography fontWeight={800}>Instrucciones</Typography>
            </Stack>
            <Typography variant="body2" color="text.secondary">
              Responde las {total} preguntas. Aprobación con 80% o más. Podrás revisar las explicaciones al enviar.
            </Typography>

            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography variant="body2" sx={{ minWidth: 120 }}>Progreso</Typography>
              <LinearProgress
                variant="determinate"
                value={(answered / total) * 100}
                sx={{ flex: 1, height: 8, borderRadius: 6 }}
              />
              <Typography variant="body2" sx={{ ml: 1 }}>{answered}/{total}</Typography>
            </Stack>
          </Stack>
        </Paper>

        <Stack spacing={1.5}>
          {qs.map((q, i) => {
            const selected = ans[q.id];
            const isCorrect = selected === q.correct;
            return (
              <Paper key={q.id} variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
                <Stack spacing={1}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Chip label={`P${i + 1}`} size="small" />
                    <Typography fontWeight={800}>{q.prompt}</Typography>
                  </Stack>

                  <RadioGroup
                    value={selected ?? -1}
                    onChange={(_, v) => handleSelect(q.id, Number(v))}
                  >
                    {q.options.map((opt, idx) => {
                      // colorea solo en revisión
                      const showCorrect = submitted && idx === q.correct;
                      const showWrong = submitted && selected === idx && !isCorrect;
                      return (
                        <FormControlLabel
                          key={idx}
                          value={idx}
                          control={<Radio />}
                          label={
                            <Stack direction="row" spacing={1} alignItems="center">
                              <Typography>{opt}</Typography>
                              <Collapse in={showCorrect} orientation="horizontal">
                                <Chip
                                  icon={<CheckCircleIcon />}
                                  label="Correcta"
                                  size="small"
                                  color="success"
                                  sx={{ ml: 1 }}
                                />
                              </Collapse>
                              <Collapse in={showWrong} orientation="horizontal">
                                <Chip
                                  icon={<ErrorIcon />}
                                  label="Tu respuesta"
                                  size="small"
                                  color="error"
                                  sx={{ ml: 1 }}
                                />
                              </Collapse>
                            </Stack>
                          }
                        />
                      );
                    })}
                  </RadioGroup>

                  <Collapse in={submitted}>
                    <Divider sx={{ my: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      Explicación: {q.explain}
                    </Typography>
                  </Collapse>
                </Stack>
              </Paper>
            );
          })}
        </Stack>

        <Stack direction="row" spacing={1.5} sx={{ mt: 2 }}>
          {!submitted ? (
            <Button
              variant="contained"
              disabled={answered !== total}
              onClick={handleSubmit}
            >
              Enviar respuestas
            </Button>
          ) : (
            <>
              <Chip
                label={`Puntaje: ${score}%`}
                color={passed ? 'success' : 'warning'}
              />
              <Button variant="outlined" onClick={() => window.location.reload()}>
                Reintentar
              </Button>
            </>
          )}
        </Stack>
      </Box>
    </LessonShell>
  );
}
