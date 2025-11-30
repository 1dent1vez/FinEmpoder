import { useEffect, useMemo, useState } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Box,
  Stack,
  Typography,
  Paper,
  LinearProgress,
  List,
  ListItemButton,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Chip
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LockIcon from '@mui/icons-material/Lock';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import QuizIcon from '@mui/icons-material/Quiz';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SportsScoreIcon from '@mui/icons-material/SportsScore';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import { useNavigate } from 'react-router-dom';
import { lessonProgressRepository } from '../../../db/lessonProgress.repository';
import { INVESTMENT_LESSONS } from './constants';

function KindIcon({ kind }: { kind: string }) {
  if (kind === 'quiz') return <QuizIcon />;
  if (kind === 'simulator') return <PlayArrowIcon />;
  if (kind === 'challenge') return <SportsScoreIcon />;
  if (kind === 'feedback') return <TipsAndUpdatesIcon />;
  return <PlayArrowIcon />;
}

export default function InvestmentOverview() {
  const nav = useNavigate();
  const [completedMap, setCompletedMap] = useState<Record<string, boolean>>({});

  // Cargar progreso desde IndexedDB al montar
  useEffect(() => {
    lessonProgressRepository
      .getModuleProgress('inversion')
      .then((rows) => {
        const map: Record<string, boolean> = {};
        rows.forEach((r) => {
          if (r.completed) map[r.lessonId] = true;
        });
        setCompletedMap(map);
      })
      .catch((err) => {
        console.error('Error cargando progreso offline de inversión', err);
      });
  }, []);

  const progressPercent = useMemo(() => {
    if (INVESTMENT_LESSONS.length === 0) return 0;
    const completedCount = INVESTMENT_LESSONS.filter((l) => completedMap[l.id]).length;
    return Math.round((completedCount / INVESTMENT_LESSONS.length) * 100);
  }, [completedMap]);

  const isLessonUnlocked = (lessonId: string): boolean => {
    const num = Number(lessonId.replace('L', ''));
    if (Number.isNaN(num) || num === 1) return true;
    const prevId = `L${String(num - 1).padStart(2, '0')}`;
    return completedMap[prevId] === true;
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#FAFAFA' }}>
      <AppBar position="sticky" elevation={0} color="transparent" sx={{ bgcolor: '#FAFAFA' }}>
        <Toolbar sx={{ px: 1 }}>
          <IconButton edge="start" onClick={() => nav('/app')} aria-label="Volver">
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" fontWeight={800} sx={{ ml: 1 }}>
            Inversión
          </Typography>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 2, pb: 10 }}>
        <Paper
          elevation={3}
          sx={{
            p: 2,
            mb: 2,
            borderRadius: 4,
            background: 'linear-gradient(180deg,#FFE6BF 0%, #FFF4E3 100%)'
          }}
        >
          <Typography fontWeight={800} sx={{ mb: 0.5, color: '#BF7B0E' }}>
            Avance del módulo
          </Typography>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography sx={{ fontSize: 32, fontWeight: 900, color: '#BF7B0E', minWidth: 72 }}>
              {progressPercent}%
            </Typography>
            <Box sx={{ flex: 1 }}>
              <LinearProgress
                variant="determinate"
                value={progressPercent}
                sx={{
                  height: 10,
                  borderRadius: 6,
                  bgcolor: '#FFEBD1',
                  '& .MuiLinearProgress-bar': { bgcolor: '#F39C12' }
                }}
              />
              <Typography variant="caption" color="text.secondary">
                Completa las lecciones en orden para avanzar.
              </Typography>
            </Box>
          </Stack>
        </Paper>

        <Paper elevation={0} sx={{ borderRadius: 4, bgcolor: '#FFFFFF' }}>
          <List disablePadding>
            {INVESTMENT_LESSONS.map((lesson, idx) => {
              const completed = !!completedMap[lesson.id];
              const unlocked = isLessonUnlocked(lesson.id);

              return (
                <ListItemButton
                  key={lesson.id}
                  disabled={!unlocked}
                  onClick={() => nav(`/app/inversion/lesson/${lesson.id}`)}
                  sx={{
                    py: 1.25,
                    opacity: unlocked ? 1 : 0.5,
                    borderBottom: idx < INVESTMENT_LESSONS.length - 1 ? '1px solid #F1F1F1' : 'none'
                  }}
                >
                  <ListItemAvatar>
                    <Avatar
                      sx={{
                        bgcolor: completed ? '#E8F5E9' : '#FFF3E0',
                        color: completed ? '#2E7D32' : '#E67E22',
                        fontWeight: 800
                      }}
                    >
                      {completed ? <CheckCircleIcon /> : <KindIcon kind={lesson.kind} />}
                    </Avatar>
                  </ListItemAvatar>

                  <ListItemText
                    primary={
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Chip label={lesson.id} size="small" variant="outlined" />
                        <Typography fontWeight={700}>{lesson.title}</Typography>
                      </Stack>
                    }
                    secondary={
                      <Typography variant="caption" color="text.secondary">
                        {completed ? 'Completada' : unlocked ? 'Disponible' : 'Bloqueada'}
                      </Typography>
                    }
                  />

                  {completed ? (
                    <Chip color="success" size="small" label="Listo" />
                  ) : unlocked ? (
                    <Chip size="small" label="Empezar" sx={{ bgcolor: '#FFF3E0' }} />
                  ) : (
                    <Chip size="small" icon={<LockIcon />} label="Bloqueada" variant="outlined" />
                  )}
                </ListItemButton>
              );
            })}
          </List>
        </Paper>
      </Box>
    </Box>
  );
}
