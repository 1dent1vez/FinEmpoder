import { Box, Stack, Typography, Paper, Fade, Button } from '@mui/material';
import type { ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import HomeIcon from '@mui/icons-material/Home';
import { useNavigate } from 'react-router-dom';
import { lessonProgressRepository } from '../../../db/lessonProgress.repository';
import { useProgress } from '../../../store/progress';

const MODULE_ID = 'ahorro';

export default function LessonShell(props: {
  id: string;
  title: string;
  children: ReactNode;
  completeWhen?: boolean;
  score?: number;
  nextPath?: string;
  overviewPath?: string;
}) {
  const nav = useNavigate();
  const recordActivity = useProgress((s) => s.recordActivity);
  const [completed, setCompleted] = useState(false);
  const once = useRef(false);

  // Recuperar progreso previo
  useEffect(() => {
    lessonProgressRepository
      .isCompleted(MODULE_ID, props.id)
      .then(setCompleted)
      .catch((err) => console.error(`Error leyendo progreso offline ${props.id}`, err));
  }, [props.id]);

  // Autocompletar cuando se cumpla la condicion
  useEffect(() => {
    if (!props.completeWhen || completed || once.current) return;
    once.current = true;
    setCompleted(true);
    lessonProgressRepository
      .setCompleted(MODULE_ID, props.id)
      .catch((err) => console.error(`Error guardando progreso offline ${props.id}`, err));
    recordActivity(MODULE_ID, 0);
  }, [props.completeWhen, completed, props.id, recordActivity]);

  const goNext = () => props.nextPath && nav(props.nextPath);
  const goOverview = () => props.overviewPath && nav(props.overviewPath);

  return (
    <Box sx={{ p: 2, pb: 10 }}>
      <Typography variant="h6" fontWeight={800}>
        {props.title}
      </Typography>

      <Paper sx={{ p: 2, borderRadius: 3, mt: 1.5 }}>{props.children}</Paper>

      {completed && (
        <Fade in>
          <Paper
            elevation={3}
            sx={{ mt: 2, p: 2, borderRadius: 3, bgcolor: '#E8F5E9', textAlign: 'center' }}
          >
            <EmojiEventsIcon sx={{ color: '#27AE60', fontSize: 40 }} />
            <Typography fontWeight={700} sx={{ mt: 1, mb: 1 }}>
              Leccion completada
            </Typography>
            <Stack direction="row" spacing={1} justifyContent="center">
              {props.nextPath && (
                <Button
                  variant="contained"
                  startIcon={<ArrowForwardIcon />}
                  onClick={goNext}
                  sx={{ bgcolor: '#F5B041', '&:hover': { bgcolor: '#F39C12' } }}
                >
                  Siguiente
                </Button>
              )}
              {props.overviewPath && (
                <Button variant="outlined" startIcon={<HomeIcon />} onClick={goOverview}>
                  Menu del modulo
                </Button>
              )}
            </Stack>
          </Paper>
        </Fade>
      )}
    </Box>
  );
}
