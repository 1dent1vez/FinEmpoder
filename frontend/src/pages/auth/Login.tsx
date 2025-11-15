import { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useLogin } from '../../hooks/auth/useLogin';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  Box,
  Stack,
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Alert,
  Link,
} from '@mui/material';
import { Email, Lock, Visibility, VisibilityOff } from '@mui/icons-material';

const schema = z.object({
  email: z.string().email('Correo inválido'),
  password: z.string().min(8, 'Mínimo 8 caracteres'),
});
type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const navigate = useNavigate();
  const login = useLogin();
  const [showPass, setShowPass] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: { email: '', password: '' },
  });

  useEffect(() => { if (login.isSuccess) navigate('/app'); }, [login.isSuccess, navigate]);


  const onSubmit = (values: FormData) => {
    login.mutate({ email: values.email, password: values.password });
  };

  return (
    <Box
      sx={{
        bgcolor: '#fff',
        minHeight: '100svh',
        display: 'grid',
        gridTemplateRows: 'auto 1fr auto',
        px: 3,
        pt: `calc(12px + env(safe-area-inset-top))`,
        pb: `calc(12px + env(safe-area-inset-bottom))`,
      }}
    >
      {/* Header: logo + Registrarse */}
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Stack direction="row" alignItems="center" spacing={1}>
          <Box
            component="img"
            src="/src/assets/logo.png" // coloca tu logo aquí
            alt="FinEmpoder"
            sx={{ width: 24, height: 24, borderRadius: '50%' }}
          />
          <Typography fontWeight={700}>FinEmpoder</Typography>
        </Stack>
        <Link
          component={RouterLink}
          to="/signup"
          underline="none"
          sx={{ color: '#F39C12', fontWeight: 700 }}
        >
          Registrarse
        </Link>
      </Stack>

      {/* Body */}
      <Stack spacing={2} sx={{ maxWidth: 420, mx: 'auto', width: '100%', mt: 3 }}>
        <Typography variant="h6" fontWeight={800} sx={{ color: '#F39C12', textAlign: 'center' }}>
          Bienvenido de Nuevo!
        </Typography>
        <Typography variant="body2" color="text.secondary" textAlign="center">
          Me alegra verte de vuelta, puedes iniciar sesión y continuar con tu progreso de
          aprendizaje.
        </Typography>

        {login.isError && (
          <Alert severity="error">
            {(login.error as Error)?.message ?? 'Error al iniciar sesión'}
          </Alert>
        )}

        <Stack component="form" noValidate onSubmit={handleSubmit(onSubmit)} spacing={1.5}>
          <TextField
            label="Email"
            type="email"
            autoComplete="email"
            fullWidth
            {...register('email')}
            error={!!errors.email}
            helperText={errors.email?.message}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            label="Contraseña"
            type={showPass ? 'text' : 'password'}
            autoComplete="current-password"
            fullWidth
            {...register('password')}
            error={!!errors.password}
            helperText={errors.password?.message}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    edge="end"
                    onClick={() => setShowPass((v) => !v)}
                    aria-label="mostrar u ocultar contraseña"
                  >
                    {showPass ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Box textAlign="right">
            <Link
              component={RouterLink}
              to="#"
              underline="hover"
              sx={{ color: 'text.secondary', fontSize: 12 }}
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </Box>

          <Button
            type="submit"
            size="large"
            disabled={login.isPending || !isValid}
            sx={{
              py: 1.25,
              borderRadius: 3,
              textTransform: 'none',
              fontWeight: 800,
              color: '#fff',
              boxShadow: '0 12px 28px rgba(243,156,18,.35)',
              background: 'linear-gradient(180deg,#F5B041 0%, #F39C12 100%)',
              '&:hover': { background: 'linear-gradient(180deg,#F0A030 0%, #E08E0E 100%)' },
            }}
          >
            {login.isPending ? 'Conectando…' : 'Iniciar sesión'}
          </Button>
        </Stack>

        <Typography variant="caption" color="text.secondary" textAlign="center" sx={{ mt: 2 }}>
          Al crear una cuenta, aceptas los{' '}
          <Link component={RouterLink} to="/terms" underline="none" sx={{ color: '#F39C12' }}>
            Términos y Condiciones
          </Link>{' '}
          y la{' '}
          <Link component={RouterLink} to="/privacy" underline="none" sx={{ color: '#F39C12' }}>
            Política de Privacidad
          </Link>{' '}
          de FinEmpoder.
        </Typography>
      </Stack>
    </Box>
  );
}
