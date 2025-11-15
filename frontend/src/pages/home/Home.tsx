import {
  Box,
  Stack,
  Typography,
  Paper,
  LinearProgress,
  Button,
  Avatar,
  Chip,
  IconButton,
  Divider,
} from '@mui/material';
import SavingsIcon from '@mui/icons-material/Savings';
import SchoolIcon from '@mui/icons-material/School';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { useNavigate } from 'react-router-dom';
import { useProgress } from '../../store/progress';
import { useAuth } from '../../store/auth';
import { useLessons } from '../../store/lessons';


const ORANGE = '#F5B041';
const ORANGE_DK = '#F39C12';

function ModuleCard(props: {
  title: string;
  subtitle: string;
  progress: number;
  icon: React.ReactNode;
  onOpen: () => void;
}) {
  return (
    <Paper
      elevation={2}
      sx={{
        p: 2,
        borderRadius: 4,
        bgcolor: '#fff',
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1.5}>
        <Box sx={{ p: 1.5, borderRadius: 3, bgcolor: '#FFF3E0' }}>{props.icon}</Box>
        <Box sx={{ flex: 1 }}>
          <Typography fontWeight={800} sx={{ fontSize: 16 }}>
            {props.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {props.subtitle}
          </Typography>
        </Box>
        <IconButton size="small" onClick={props.onOpen}>
          <ArrowForwardIosIcon fontSize="small" />
        </IconButton>
      </Stack>

      <LinearProgress
        variant="determinate"
        value={props.progress}
        sx={{
          mt: 1,
          height: 8,
          borderRadius: 6,
          bgcolor: '#f1f1f1',
          '& .MuiLinearProgress-bar': { bgcolor: ORANGE },
        }}
      />
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="caption" color="text.secondary">
          {props.progress}% completado
        </Typography>
        <Button
          variant="contained"
          size="small"
          onClick={props.onOpen}
          sx={{
            textTransform: 'none',
            bgcolor: ORANGE,
            '&:hover': { bgcolor: ORANGE_DK },
          }}
        >
          Entrar
        </Button>
      </Stack>
    </Paper>
  );
}

function StreakCard() {
  // Esperamos que useProgress exponga 'streak' { current, best, lastActiveISO }
  // Si aún no existe en tu store, se mostrará 0 por defecto.
 const streak = useProgress((s) => s.streak);
const todayDone = useProgress((s) => s.todayDone);
//const mod = useProgress((s) => s.modules.presupuesto);


  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.25,
        borderRadius: 4,
        background: 'linear-gradient(180deg, #FFF3E0 0%, #FFE8C7 100%)',
        border: `1px solid ${ORANGE}20`,
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1.5}>
        <Box
          sx={{
            p: 1.25,
            borderRadius: '50%',
            bgcolor: '#FFF',
            boxShadow: '0 4px 12px rgba(0,0,0,.06)',
            color: ORANGE_DK,
          }}
        >
          <LocalFireDepartmentIcon />
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography fontWeight={900} sx={{ lineHeight: 1, fontSize: 18 }}>
            Racha activa: {streak.current ?? 0} días
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Mejor racha: {streak.best ?? 0} días
          </Typography>
        </Box>
        <Chip
          color={todayDone ? 'success' : 'warning'}
          variant="filled"
          label={todayDone ? '¡Hecho hoy!' : 'Falta hoy'}
          sx={{ fontWeight: 700 }}
        />
      </Stack>
    </Paper>
  );
}

function DailyTip() {
  return (
    <Paper elevation={0} sx={{ p: 2, borderRadius: 4 }}>
      <Stack direction="row" spacing={1.25} alignItems="center">
        <CalendarTodayIcon sx={{ color: ORANGE_DK }} />
        <Box sx={{ flex: 1 }}>
          <Typography fontWeight={800} sx={{ fontSize: 14 }}>
            Tip del día
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Separa primero el ahorro (5–10%) y vive con el resto. ¡Automatiza tu progreso!
          </Typography>
        </Box>
      </Stack>
    </Paper>
  );
}

export default function Home() {
  const nav = useNavigate();
  const mod = useProgress((s) => s.modules);
  const { user } = useAuth();

  // “Continuar” — toma la siguiente lección pendiente de Presupuesto
  const lessons = useLessons((s) => s.lessons);
  const next = lessons.find((l) => !l.completed);
  const nextPath = next ? `/app/presupuesto/lesson/${next.id}` : '/app/presupuesto';

  return (
    <Box
      sx={{
        p: 2,
        pb: 9,
        bgcolor: '#FAFAFA',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      {/* Tarjeta de bienvenida */}
      <Paper
        elevation={3}
        sx={{
          borderRadius: 4,
          p: 3,
          background: 'linear-gradient(180deg,#F5B041 0%, #F39C12 100%)',
          color: '#fff',
        }}
      >
        <Stack direction="row" alignItems="center" spacing={2}>
          <Avatar
            sx={{
              width: 56,
              height: 56,
              bgcolor: '#fff',
              color: ORANGE_DK,
              fontWeight: 700,
              fontSize: 24,
            }}
          >
            {user?.email?.[0]?.toUpperCase() ?? 'U'}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography fontWeight={900} sx={{ fontSize: 18 }}>
              ¡Hola, {user?.email?.split('@')[0] ?? 'Estudiante'}!
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Nivel: Aprendiz Financiero
            </Typography>
          </Box>
          <Chip
            icon={<TrendingUpIcon sx={{ color: '#2E7D32 !important' }} />}
            label="Progreso"
            sx={{ bgcolor: '#ffffff22', color: '#fff', border: '1px solid #ffffff44' }}
          />
        </Stack>

        {/* CTA continuar */}
        <Stack direction="row" justifyContent="flex-end" sx={{ mt: 2 }}>
          <Button
            onClick={() => nav(nextPath)}
            variant="contained"
            size="small"
            sx={{
              textTransform: 'none',
              bgcolor: '#fff',
              color: ORANGE_DK,
              fontWeight: 800,
              '&:hover': { bgcolor: '#fff' },
            }}
            endIcon={<ArrowForwardIosIcon fontSize="small" />}
          >
            Continuar
          </Button>
        </Stack>
      </Paper>

      {/* Racha */}
      <StreakCard />

      {/* Acciones rápidas */}
      <Paper elevation={0} sx={{ p: 1.5, borderRadius: 4 }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <Button
            variant="outlined"
            onClick={() => nav('/app/presupuesto')}
            sx={{ textTransform: 'none', borderColor: ORANGE, color: ORANGE_DK }}
            startIcon={<SavingsIcon />}
          >
            Ir al módulo
          </Button>
          <Button
            variant="outlined"
            onClick={() => nav(nextPath)}
            sx={{ textTransform: 'none', borderColor: ORANGE, color: ORANGE_DK }}
            startIcon={<ArrowForwardIosIcon />}
          >
            Siguiente lección
          </Button>
          <Button
            variant="outlined"
            onClick={() => nav('/achievements')}
            sx={{ textTransform: 'none', borderColor: ORANGE, color: ORANGE_DK }}
            startIcon={<EmojiEventsIcon />}
          >
            Logros
          </Button>
        </Stack>
      </Paper>

      {/* Tip del día */}
      <DailyTip />

      {/* Módulos */}
      <Typography variant="h6" fontWeight={900} sx={{ mt: 1 }}>
        Tus módulos
      </Typography>

      <Stack spacing={2}>
        <ModuleCard
          title="Presupuestación"
          subtitle="Organiza ingresos y gastos"
          progress={mod.presupuesto?.progress ?? 0}
          icon={<SavingsIcon sx={{ color: ORANGE_DK }} />}
          onOpen={() => nav('/app/presupuesto')}
        />

        <ModuleCard
          title="Ahorro programado"
          subtitle="Crea hábitos de ahorro"
          progress={mod.ahorro?.progress ?? 0}
          icon={<SchoolIcon sx={{ color: '#58D68D' }} />}
          onOpen={() => nav('/app')} // Ajustar cuando exista el módulo
        />

        <ModuleCard
          title="Inversión básica"
          subtitle="Haz crecer tu dinero"
          progress={mod.inversion?.progress ?? 0}
          icon={<ShowChartIcon sx={{ color: '#5DADE2' }} />}
          onOpen={() => nav('/app')} // Ajustar cuando exista el módulo
        />
      </Stack>

      <Divider sx={{ my: 1 }} />

      {/* Footer mini */}
      <Typography variant="caption" color="text.secondary" align="center">
        FinEmpoder · Aprende, practica y crece 🚀
      </Typography>
    </Box>
  );
}
