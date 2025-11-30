import { Box, Stack, Typography, Paper, Fade, Button } from '@mui/material';
import type { ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import HomeIcon from '@mui/icons-material/Home';
import { useNavigate } from 'react-router-dom';

type Props = {
  id: string; // 'L01'
  title: string;
  children: ReactNode;
  completeWhen?: boolean;
  nextPath?: string;
  overviewPath?: string;
};

export default function LessonShell({ id, title, children, completeWhen, nextPath, overviewPath }: Props) {
  const nav = useNavigate();
  const [completed, setCompleted] = useState(false);
  const once = useRef(false);

  useEffect(() => {
    if (completeWhen && !once.current) {
      setCompleted(true);
      once.current = true;
    }
  }, [completeWhen]);

  const goNext = () => {
    if (nextPath) nav(nextPath);
  };

  const goOverview = () => {
    if (overviewPath) nav(overviewPath);
  };

  return (
    <Box sx={{ p: 2, pb: 10 }} data-lesson-id={id}>
      <Typography variant="h6" fontWeight={800}>
        {title}
      </Typography>

      <Paper sx={{ p: 2, borderRadius: 3, mt: 1.5 }}>
        {children}
      </Paper>

      {completed && (
        <Fade in>
          <Paper
            elevation={3}
            sx={{ mt: 2, p: 2, borderRadius: 3, bgcolor: '#E8F5E9', textAlign: 'center' }}
          >
            <EmojiEventsIcon sx={{ color: '#27AE60', fontSize: 40 }} />
            <Typography fontWeight={700} sx={{ mt: 1, mb: 1 }}>
              ¡Lección completada!
            </Typography>
            <Stack direction="row" spacing={1} justifyContent="center">
              {nextPath && (
                <Button
                  variant="contained"
                  startIcon={<ArrowForwardIcon />}
                  onClick={goNext}
                  sx={{ bgcolor: '#F5B041', '&:hover': { bgcolor: '#F39C12' } }}
                >
                  Siguiente
                </Button>
              )}
              {overviewPath && (
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
