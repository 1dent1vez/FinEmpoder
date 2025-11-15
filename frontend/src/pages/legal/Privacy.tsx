import { Box, Typography, Stack, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function Privacy() {
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
          Política de Privacidad
        </Typography>
        <Button variant="text" onClick={() => nav(-1)} sx={{ color: '#6C5CE7', fontWeight: 600 }}>
          Volver
        </Button>
      </Stack>

      <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary', lineHeight: 1.7 }}>
        La aplicación <b>FinEmpoder</b> respeta la privacidad de sus usuarios y protege los datos personales conforme a la legislación mexicana vigente.
        <br /><br />
        <b>1. Recolección de datos:</b> Se recopilan únicamente los datos necesarios para crear la cuenta del usuario (nombre, correo, carrera, edad y número telefónico).
        <br /><br />
        <b>2. Uso de la información:</b> Los datos se emplean para personalizar la experiencia educativa y mejorar los contenidos financieros.
        <br /><br />
        <b>3. Seguridad:</b> Los datos se almacenan de manera cifrada en servidores seguros.
        <br /><br />
        <b>4. Derechos del usuario:</b> El usuario puede solicitar en cualquier momento la eliminación o modificación de sus datos.
        <br /><br />
        <b>5. Contacto:</b> Para ejercer estos derechos o resolver dudas, puede escribir a <b>soporte@finempoder.mx</b>.
        <br /><br />
        Al continuar utilizando FinEmpoder, el usuario reconoce haber leído y comprendido esta política de privacidad.
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
        Entendido
      </Button>
    </Box>
  );
}
