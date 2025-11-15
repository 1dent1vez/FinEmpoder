import { Box, Stack, Typography, Paper, Fade, Button } from '@mui/material';
import type { ReactNode } from 'react';
import { useEffect, useRef } from 'react';
import { useLessons } from '../../../store/lessons';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import HomeIcon from '@mui/icons-material/Home';
import { useNavigate } from 'react-router-dom';

export default function LessonShell(props: {
  id: string;                  // ej. 'L01'
  title: string;               // título visible
  children: ReactNode;         // contenido de la lección
  completeWhen?: boolean;      // condición de autocompletado
  score?: number;              // puntaje al completar (default 100)
  nextPath?: string;           // ruta a la siguiente lección
  overviewPath?: string;       // ruta al índice del módulo
}) {
  const nav = useNavigate();
  const { complete, lessons } = useLessons();
  const isCompleted = lessons.find(l => l.id === props.id)?.completed ?? false;
  const once = useRef(false);

  useEffect(() => {
    if (props.completeWhen && !isCompleted && !once.current) {
      complete(props.id, props.score ?? 100);
      once.current = true;
    }
  }, [props.completeWhen, isCompleted, complete, props.id, props.score]);

  const goNext = () => { if (props.nextPath) nav(props.nextPath); };
  const goOverview = () => { if (props.overviewPath) nav(props.overviewPath); };

  return (
    <Box sx={{ p:2, pb:10 }}>
      <Typography variant="h6" fontWeight={800}>{props.title}</Typography>

      <Paper sx={{ p:2, borderRadius:3, mt:1.5 }}>
        {props.children}
      </Paper>

      {isCompleted && (
        <Fade in>
          <Paper elevation={3} sx={{ mt:2, p:2, borderRadius:3, bgcolor:'#E8F5E9', textAlign:'center' }}>
            <EmojiEventsIcon sx={{ color:'#27AE60', fontSize:40 }} />
            <Typography fontWeight={700} sx={{ mt:1, mb:1 }}>¡Lección completada!</Typography>
            <Stack direction="row" spacing={1} justifyContent="center">
              {props.nextPath && (
                <Button
                  variant="contained"
                  startIcon={<ArrowForwardIcon />}
                  onClick={goNext}
                  sx={{ bgcolor:'#F5B041', '&:hover':{ bgcolor:'#F39C12' } }}
                >
                  Siguiente
                </Button>
              )}
              {props.overviewPath && (
                <Button variant="outlined" startIcon={<HomeIcon />} onClick={goOverview}>
                  Menú del módulo
                </Button>
              )}
            </Stack>
          </Paper>
        </Fade>
      )}
    </Box>
  );
}
