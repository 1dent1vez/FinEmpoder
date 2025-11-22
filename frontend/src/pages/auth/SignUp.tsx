import { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Stack,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Button,
  MenuItem,
  Link,
  Checkbox,
  FormControlLabel,
  Alert,
} from '@mui/material';
import {
  Person,
  School,
  CalendarToday,
  Email,
  Phone,
  Lock,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRegister } from '../../hooks/auth/useRegister';

const schema = z.object({
  name: z.string().min(3, 'Nombre muy corto'),
  career: z.string().min(2, 'Selecciona una carrera'),
  age: z.number().min(17, 'Edad mínima 17'),
  email: z.string().email('Correo inválido'),
  phone: z.string().min(10, 'Teléfono inválido'),
  password: z.string().min(8, 'Mínimo 8 caracteres'),
  // FIX: usar boolean().refine en lugar de literal(true) para mensaje personalizado
  acceptTerms: z
    .boolean()
    .refine((v) => v, { message: 'Debes aceptar los Términos y Condiciones' }),
});
type FormData = z.infer<typeof schema>;

export default function SignUpPage() {
  const navigate = useNavigate();
  const registerMutation = useRegister();
  const [showPass, setShowPass] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      career: '',
      age: 18,
      email: '',
      phone: '',
      password: '',
      acceptTerms: false,
    },
  });

  useEffect(() => {
    if (registerMutation.isSuccess) {
      navigate('/app', { replace: true });
    }
  }, [registerMutation.isSuccess, navigate]);

  const onSubmit = (data: FormData) => {
    registerMutation.mutate(data);
  };

  const accepted = watch('acceptTerms');
  const globalError = registerMutation.isError
    ? registerMutation.error instanceof Error
      ? registerMutation.error.message
      : 'No se pudo crear la cuenta'
    : null;

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
      {/* Header: logo + Acceder */}
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Stack direction="row" alignItems="center" spacing={1}>
          <Box
            component="img"
            src="/src/assets/logo.png"
            alt="FinEmpoder"
            sx={{ width: 24, height: 24, borderRadius: '50%' }}
          />
          <Typography fontWeight={700}>FinEmpoder</Typography>
        </Stack>
        <Link
          component={RouterLink}
          to="/login"
          underline="none"
          sx={{ color: '#F39C12', fontWeight: 700 }}
        >
          Acceder
        </Link>
      </Stack>

      {/* Body */}
      <Stack spacing={2} sx={{ maxWidth: 420, mx: 'auto', width: '100%', mt: 3 }}>
        <Typography variant="h6" fontWeight={800} sx={{ color: '#F39C12', textAlign: 'center' }}>
          Crear una cuenta
        </Typography>
        <Typography variant="body2" color="text.secondary" textAlign="center">
          El punto de partida de tu viaje juntos está aquí, comienza a registrarte ahora.
        </Typography>

        {globalError && <Alert severity="error">{globalError}</Alert>}

        <Stack component="form" spacing={1.5} onSubmit={handleSubmit(onSubmit)} noValidate>
          <TextField
            label="Nombre completo"
            fullWidth
            {...register('name')}
            error={!!errors.name}
            helperText={errors.name?.message}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Person />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="Carrera"
            select
            fullWidth
            {...register('career')}
            error={!!errors.career}
            helperText={errors.career?.message}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <School />
                </InputAdornment>
              ),
            }}
          >
            <MenuItem value="ITI">Ing. Tecnologías de la Información</MenuItem>
            <MenuItem value="IGE">Ing. Gestión Empresarial</MenuItem>
            <MenuItem value="II">Ing. Industrial</MenuItem>
            <MenuItem value="ISC">Ing. Sistemas Computacionales</MenuItem>
          </TextField>
          <TextField
            label="Edad"
            type="number"
            fullWidth
            {...register('age', { valueAsNumber: true })}
            error={!!errors.age}
            helperText={errors.age?.message}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <CalendarToday />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="Email"
            type="email"
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
            label="Número de teléfono"
            type="tel"
            fullWidth
            {...register('phone')}
            error={!!errors.phone}
            helperText={errors.phone?.message}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Phone />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="Contraseña"
            type={showPass ? 'text' : 'password'}
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
                  <IconButton onClick={() => setShowPass((v) => !v)}>
                    {showPass ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <FormControlLabel
            control={<Checkbox {...register('acceptTerms')} />}
            label={
              <Typography variant="body2" color="text.secondary">
                Acepto los{' '}
                <Link component={RouterLink} to="/terms" underline="none" sx={{ color: '#F39C12' }}>
                  Términos y Condiciones
                </Link>{' '}
                y la{' '}
                <Link component={RouterLink} to="/privacy" underline="none" sx={{ color: '#F39C12' }}>
                  Política de Privacidad
                </Link>
                .
              </Typography>
            }
          />
          {errors.acceptTerms && (
            <Typography variant="caption" color="error">
              {errors.acceptTerms.message}
            </Typography>
          )}

          <Button
            type="submit"
            size="large"
            disabled={!isValid || !accepted || registerMutation.isPending}
            sx={{
              mt: 0.5,
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
            {registerMutation.isPending ? 'Creando cuenta…' : 'Crear Cuenta'}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
