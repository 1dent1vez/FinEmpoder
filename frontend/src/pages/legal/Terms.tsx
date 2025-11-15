import { Box, Typography, Stack, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function Terms() {
  const nav = useNavigate();

  return (
    <Box
      sx={{
        bgcolor: '#fff',
        minHeight: '100svh',
        display: 'flex',
        flexDirection: 'column',
        px: 3,
        pt: `calc(16px + env(safe-area-inset-top))`,
        pb: `calc(16px + env(safe-area-inset-bottom))`,
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h6" fontWeight={800} sx={{ color: '#F39C12' }}>
          Términos y Condiciones
        </Typography>
        <Button variant="text" onClick={() => nav(-1)} sx={{ color: '#6C5CE7', fontWeight: 600 }}>
          Volver
        </Button>
      </Stack>

      <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary', lineHeight: 1.7 }}>
        Estos Términos y Condiciones regulan el uso de la aplicación <b>FinEmpoder</b>, propiedad del Instituto Tecnológico de Toluca.
        <br /><br />
        Al crear una cuenta o utilizar la aplicación, el usuario acepta cumplir con las siguientes disposiciones:
        <br /><br />
        <b>1. Uso responsable:</b> El usuario se compromete a proporcionar información veraz y a utilizar las herramientas de educación financiera con fines personales y educativos.
        <br /><br />
        <b>2. Protección de datos:</b> FinEmpoder no comparte datos personales con terceros sin autorización expresa del usuario.
        <br /><br />
        <b>3. Modificaciones:</b> La aplicación podrá actualizar sus funciones o políticas sin previo aviso, manteniendo siempre el acceso transparente a los usuarios.
        <br /><br />
        <b>4. Limitación de responsabilidad:</b> FinEmpoder no se responsabiliza por decisiones financieras tomadas con base en el contenido educativo de la aplicación.
        <br /><br />
        Al continuar utilizando FinEmpoder, el usuario acepta íntegramente estos términos.
      </Typography>

      <Button
        variant="contained"
        onClick={() => nav(-1)}
        sx={{
          mt: 'auto',
          py: 1.25,
          borderRadius: 3,
          textTransform: 'none',
          fontWeight: 800,
          color: '#fff',
          background: 'linear-gradient(180deg,#F5B041 0%, #F39C12 100%)',
          '&:hover': { background: 'linear-gradient(180deg,#F0A030 0%, #E08E0E 100%)' },
        }}
      >
        Aceptar
      </Button>
    </Box>
  );
}
