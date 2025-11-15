import {
  AppBar, Toolbar, IconButton, Box, Stack, Typography, Paper,
  LinearProgress, List, ListItemButton, ListItemAvatar, Avatar,
  ListItemText, Chip
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LockIcon from '@mui/icons-material/Lock';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import QuizIcon from '@mui/icons-material/Quiz';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SportsScoreIcon from '@mui/icons-material/SportsScore';
import { useNavigate } from 'react-router-dom';
import { useLessons } from '../../../store/lessons';

function KindIcon({ kind }: { kind: string }) {
  if (kind === 'quiz') return <QuizIcon />;
  if (kind === 'simulator') return <PlayArrowIcon />;
  if (kind === 'challenge') return <SportsScoreIcon />;
  return <PlayArrowIcon />;
}

export default function PresupuestoOverview() {
  const nav = useNavigate();
  const { lessons, isUnlocked } = useLessons();
  const progress = useLessons((s) => s.moduleProgress);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#FAFAFA' }}>
      {/* App bar con regreso al Home */}
      <AppBar position="sticky" elevation={0} color="transparent" sx={{ bgcolor: '#FAFAFA' }}>
        <Toolbar sx={{ px: 1 }}>
          <IconButton edge="start" onClick={() => nav('/app')} aria-label="Volver">
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" fontWeight={800} sx={{ ml: 1 }}>
            Presupuestación
          </Typography>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 2, pb: 10 }}>
        {/* Tarjeta de progreso tipo pastel */}
        <Paper
          elevation={3}
          sx={{
            p: 2,
            mb: 2,
            borderRadius: 4,
            background: 'linear-gradient(180deg,#FFE6BF 0%, #FFF4E3 100%)',
          }}
        >
          <Typography fontWeight={800} sx={{ mb: 0.5, color: '#BF7B0E' }}>
            Avance del módulo
          </Typography>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography sx={{ fontSize: 32, fontWeight: 900, color: '#BF7B0E', minWidth: 72 }}>
              {progress}%
            </Typography>
            <Box sx={{ flex: 1 }}>
              <LinearProgress
                variant="determinate"
                value={progress}
                sx={{
                  height: 10,
                  borderRadius: 6,
                  bgcolor: '#FFEBD1',
                  '& .MuiLinearProgress-bar': { bgcolor: '#F39C12' },
                }}
              />
              <Typography variant="caption" color="text.secondary">
                Completa las lecciones en orden para avanzar.
              </Typography>
            </Box>
          </Stack>
        </Paper>

        {/* Lista de lecciones */}
        <Paper elevation={0} sx={{ borderRadius: 4, bgcolor: '#FFFFFF' }}>
          <List disablePadding>
            {lessons.map((l, idx) => {
              const unlocked = isUnlocked(l.id);

              return (
                <ListItemButton
                  key={l.id}
                  disabled={!unlocked}
                  onClick={() => nav(`/app/presupuesto/lesson/${l.id}`)}
                  sx={{
                    py: 1.25,
                    opacity: unlocked ? 1 : 0.5,
                    borderBottom: idx < lessons.length - 1 ? '1px solid #F1F1F1' : 'none',
                  }}
                >
                  <ListItemAvatar>
                    <Avatar
                      sx={{
                        bgcolor: l.completed ? '#E8F5E9' : '#FFF3E0',
                        color: l.completed ? '#2E7D32' : '#E67E22',
                        fontWeight: 800,
                      }}
                    >
                      {l.completed ? <CheckCircleIcon /> : <KindIcon kind={l.kind} />}
                    </Avatar>
                  </ListItemAvatar>

                  <ListItemText
                    primary={
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Chip label={l.id} size="small" variant="outlined" />
                        <Typography fontWeight={700}>{l.title}</Typography>
                      </Stack>
                    }
                    secondary={
                      <Typography variant="caption" color="text.secondary">
                        {l.completed ? 'Completada' : unlocked ? 'Disponible' : 'Bloqueada'}
                      </Typography>
                    }
                  />

                  {/* Estado a la derecha */}
                  {l.completed ? (
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
