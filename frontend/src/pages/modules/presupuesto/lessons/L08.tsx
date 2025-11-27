import { useEffect, useMemo, useRef, useState } from 'react';
import type { SelectChangeEvent } from '@mui/material';
import {
  Box, Paper, Stack, Typography, IconButton, Chip, Collapse, Button,
  LinearProgress, Divider, Alert, MenuItem, Select
} from '@mui/material';

import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import PauseIcon from '@mui/icons-material/Pause';
import StopIcon from '@mui/icons-material/Stop';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import LessonShell from '../LessonShell';
import { lessonProgressRepository } from '../../../../db/lessonProgress.repository';
const ORANGE = '#F5B041';

// Checkpoints cronometrados (segundos desde el inicio del TTS)
type Checkpoint = { id: string; t: number; question: string; options: string[]; correct: number };
const genId = () => 'c' + Math.random().toString(16).slice(2);

// mm:ss
const fmt = (s: number) => {
  const mm = Math.floor(s / 60).toString().padStart(2, '0');
  const ss = Math.floor(s % 60).toString().padStart(2, '0');
  return `${mm}:${ss}`;
};

export default function L08() {
  // Texto que narra el TTS (puedes ajustar/expandir)
  const transcriptText =
    `Fugas financieras son pequeños gastos repetitivos que drenan tu presupuesto sin notarlo.
     En periodos de crisis, prioriza lo esencial, congela caprichos y renegocia servicios.
     Para detectar gastos hormiga, registra compras diarias y define límites por categoría.
     Un colchón de tres a seis meses de gastos da resiliencia. Ajusta hábitos, empieza pequeño y sé constante.`;

  // Checkpoints (ajusta tiempos según prefieras)
  const checks = useMemo<Checkpoint[]>(
    () => [
      {
        id: genId(),
        t: 20,
        question: '¿Qué es una “fuga financiera”?',
        options: [
          'Un gasto grande planificado',
          'Pequeños gastos repetitivos que pasan desapercibidos',
          'Una inversión de alto riesgo',
          'Un préstamo estudiantil'
        ],
        correct: 1
      },
      {
        id: genId(),
        t: 55,
        question: 'En crisis, ¿qué se recomienda primero?',
        options: [
          'Suspender todo ahorro',
          'Revisar y priorizar gastos esenciales',
          'Tomar deuda para mantener el mismo nivel de gasto',
          'Invertir todo el efectivo disponible'
        ],
        correct: 1
      },
      {
        id: genId(),
        t: 95,
        question: '¿Qué ayuda a detectar “gastos hormiga”?',
        options: [
          'Registro diario por categorías con límites',
          'Tarjeta de crédito exclusiva',
          'Criptomonedas',
          'Prestar dinero a conocidos'
        ],
        correct: 0
      },
      {
        id: genId(),
        t: 130,
        question: 'Indicador simple de resiliencia financiera:',
        options: [
          'Tener 3–6 meses de gastos cubiertos',
          'Comprar un seguro de auto',
          'Aumentar el límite de la tarjeta',
          'Pagar solo el mínimo de la tarjeta'
        ],
        correct: 0
      }
    ],
    []
  );

  // Estado de respuestas
  const [answers, setAnswers] = useState<Record<string, number | null>>(
    () => Object.fromEntries(checks.map(c => [c.id, null]))
  );

  // ====== NARRADOR TTS (Web Speech API) ======
  const [ttsBusy, setTtsBusy] = useState(false);
  const [paused, setPaused] = useState(false);
  const [time, setTime] = useState(0);
  const [openTranscript, setOpenTranscript] = useState(false);

  // Voz/idioma y velocidad
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [voiceIndex, setVoiceIndex] = useState<number>(-1); // -1 = auto
  const rate = 1; // 0.5–2 (si quieres exponerlo)
  const voice = voiceIndex >= 0 ? voices[voiceIndex] : undefined;

  // Cargar voces disponibles
  useEffect(() => {
    const load = () => {
      const all = window.speechSynthesis.getVoices();
      // Prioriza voces en español, pero muestra todas
      const sorted = [...all].sort((a, b) => Number(b.lang.startsWith('es')) - Number(a.lang.startsWith('es')));
      setVoices(sorted);
    };
    load();
    window.speechSynthesis.onvoiceschanged = load;
  }, []);

  // Duración estimada por WPM (palabras por minuto) y rate
  const words = useMemo(() => transcriptText.trim().split(/\s+/).length, [transcriptText]);
  const baseWpm = 160; // lectura natural
  const dur = Math.max(checks.at(-1)?.t ?? 120, Math.ceil((words / (baseWpm * rate)) * 60)) + 5;

  // Timers
  const timerRef = useRef<number | null>(null);
  const startTsRef = useRef<number | null>(null);
  const elapsedRef = useRef(0);

  const clearTimers = () => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const speak = () => {
    if (!('speechSynthesis' in window)) return;
    stop(); // resetea cualquier narración previa

    const u = new SpeechSynthesisUtterance(transcriptText);
    u.lang = voice?.lang || 'es-MX';
    u.voice = voice || null;
    u.rate = rate;
    u.pitch = 1;

    u.onend = () => {
      setTtsBusy(false);
      setPaused(false);
      clearTimers();
    };

    setTtsBusy(true);
    setPaused(false);
    startTsRef.current = performance.now();
    window.speechSynthesis.speak(u);

    // cronómetro (cada 200ms)
    timerRef.current = window.setInterval(() => {
      const base = elapsedRef.current;
      const now = startTsRef.current ?? performance.now();
      const secs = base + (performance.now() - now) / 1000;
      setTime(Math.min(secs, dur));
    }, 200);
  };

  const pause = () => {
    if (!ttsBusy || paused) return;
    window.speechSynthesis.pause();
    setPaused(true);
    // fija elapsed y limpia base de inicio
    if (startTsRef.current) {
      elapsedRef.current += (performance.now() - startTsRef.current) / 1000;
      startTsRef.current = null;
    }
  };

  const resume = () => {
    if (!ttsBusy || !paused) return;
    window.speechSynthesis.resume();
    setPaused(false);
    startTsRef.current = performance.now();
  };

  const stop = () => {
    window.speechSynthesis.cancel();
    setTtsBusy(false);
    setPaused(false);
    clearTimers();
    startTsRef.current = null;
    elapsedRef.current = 0;
    setTime(0);
  };
  // ============================================

  // Autopause “lógico” en cada checkpoint si aún no se respondió
  useEffect(() => {
    if (!ttsBusy || paused) return;
    const next = checks.find(c => time >= c.t && answers[c.id] === null);
    if (next) pause();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [time, ttsBusy, paused, answers]);

  // Métricas de finalización
  const listenedPct = dur > 0 ? Math.min(100, (time / dur) * 100) : 0;
  const answeredAll = checks.every(c => answers[c.id] === c.correct);
  const complete = listenedPct >= 80 && answeredAll;
  const progressVal = Math.round(Math.min(listenedPct, 100) * 0.7 + (answeredAll ? 30 : 0));

  const handleVoiceChange = (e: SelectChangeEvent<string>) => {
    const idx = Number(e.target.value);
    setVoiceIndex(Number.isNaN(idx) ? -1 : idx);
  };
useEffect(() => {
  if (!complete) return;
  lessonProgressRepository
    .setCompleted('presupuesto', 'L08')
    .catch(err => console.error(err));
}, [complete]);
  return (
    <LessonShell
      id="L08"
      title="Fugas financieras y crisis: podcast interactivo (TTS)"
      completeWhen={complete}
      nextPath="/app/presupuesto"
      overviewPath="/app/presupuesto"
    >
      <Box sx={{ p: 1 }}>
        <Paper sx={{ p: 2, borderRadius: 3, bgcolor: '#FFF8E1', borderLeft: `6px solid ${ORANGE}`, mb: 2 }}>
          <Typography variant="body1" sx={{ mb: 1 }}>
            Escucha la narración generada por tu dispositivo. Se pausará automáticamente para responder preguntas.
            La lección se completa al escuchar ≥ 80% y acertar todas.
          </Typography>

          <Stack direction="row" spacing={1} alignItems="center" sx={{ flexWrap: 'wrap' }}>
            <IconButton onClick={ttsBusy ? (paused ? resume : pause) : speak} aria-label="tts-control">
              {ttsBusy ? (paused ? <RecordVoiceOverIcon /> : <PauseIcon />) : <RecordVoiceOverIcon />}
            </IconButton>
            <IconButton onClick={stop} aria-label="tts-stop" disabled={!ttsBusy}>
              <StopIcon />
            </IconButton>

            <Typography variant="body2" sx={{ ml: 1 }}>
              {fmt(time)} / {fmt(dur)}
            </Typography>

            <Box sx={{ flex: 1 }} />

            <Select
              size="small"
              value={String(voiceIndex)}
              onChange={handleVoiceChange}
              sx={{ minWidth: 180 }}
            >
              <MenuItem value="-1">Voz automática (es-MX)</MenuItem>
              {voices.map((v, i) => (
                <MenuItem key={v.name + i} value={String(i)}>
                  {v.name} ({v.lang})
                </MenuItem>
              ))}
            </Select>
          </Stack>
        </Paper>

        <LinearProgress
          variant="determinate"
          value={progressVal}
          sx={{ mb: 2, height: 8, borderRadius: 5, bgcolor: '#f0f0f0', '& .MuiLinearProgress-bar': { bgcolor: ORANGE } }}
        />

        {/* Checkpoints */}
        <Stack spacing={1.25}>
          {checks.map(c => {
            const shouldShow = time >= c.t || answers[c.id] !== null;
            const answered = answers[c.id] !== null;
            const correct = answers[c.id] === c.correct;
            return (
              <Collapse in={shouldShow} key={c.id}>
                <Paper
                  sx={{
                    p: 2,
                    borderRadius: 3,
                    borderLeft: `5px solid ${answered ? (correct ? '#2ECC71' : '#E74C3C') : ORANGE}`
                  }}
                >
                  <Stack spacing={1}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Chip size="small" label={fmt(c.t)} variant="outlined" />
                      <Typography fontWeight={800}>{c.question}</Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} flexWrap="wrap">
                      {c.options.map((opt, idx) => {
                        const selected = answers[c.id] === idx;
                        const variant = selected ? 'contained' : 'outlined';
                        const color = selected ? (idx === c.correct ? 'success' : 'error') : 'primary';
                        return (
                          <Button
                            key={idx}
                            size="small"
                            variant={variant}
                            color={color}
                            onClick={() => setAnswers(a => ({ ...a, [c.id]: idx }))}
                            sx={{ textTransform: 'none', borderColor: ORANGE }}
                          >
                            {opt}
                          </Button>
                        );
                      })}
                    </Stack>
                    {!answered && (
                      <Typography variant="caption" color="text.secondary">
                        Responde para continuar la narración.
                      </Typography>
                    )}
                  </Stack>
                </Paper>
              </Collapse>
            );
          })}
        </Stack>

        <Divider sx={{ my: 2 }} />

        {/* Tips accionables */}
        <Paper sx={{ p: 2, borderRadius: 3, mb: 2 }}>
          <Typography fontWeight={800} sx={{ mb: 1 }}>
            Plan anti–fugas (acción inmediata)
          </Typography>
          <Stack spacing={0.75}>
            <Alert severity="info" variant="outlined">Registra todo 7 días y etiqueta “hormiga”.</Alert>
            <Alert severity="success" variant="outlined">Límites: antojos ≤ 5% del ingreso. Streaming: máx. 2.</Alert>
            <Alert severity="warning" variant="outlined">Crisis: congela lujos 30 días y renegocia servicios.</Alert>
            <Alert severity="info" variant="outlined">Fondo de emergencia: empieza por 1 mes de gastos.</Alert>
          </Stack>
        </Paper>

        {/* Transcripción */}
        <Paper sx={{ p: 2, borderRadius: 3 }}>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
            <Typography fontWeight={800}>Transcripción</Typography>
            <IconButton onClick={() => setOpenTranscript(v => !v)} size="small">
              {openTranscript ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </Stack>
          <Collapse in={openTranscript}>
            <Typography variant="body2" color="text.secondary">
              {transcriptText}
            </Typography>
          </Collapse>
        </Paper>
      </Box>
    </LessonShell>
  );
}
