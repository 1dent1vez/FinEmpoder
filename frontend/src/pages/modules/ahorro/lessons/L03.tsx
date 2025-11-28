import { useState } from 'react';
import { Box, Paper, Stack, Typography, Chip, Button, LinearProgress } from '@mui/material';
import LessonShell from '../LessonShell';
import VerifiedIcon from '@mui/icons-material/Verified';
import SecurityIcon from '@mui/icons-material/Security';
import TimelineIcon from '@mui/icons-material/Timeline';
import SavingsIcon from '@mui/icons-material/Savings';

export default function L03() {
  const [ack, setAck] = useState(false);
  const progress = ack ? 100 : 60;

  return (
    <LessonShell
      id="L03"
      title="Ventajas del ahorro formal"
      completeWhen={ack}
      nextPath="/app/ahorro/lesson/L04"
      overviewPath="/app/ahorro"
    >
      <Box sx={{ p: 1 }}>
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            mb: 2,
            height: 8,
            borderRadius: 5,
            bgcolor: '#f0f0f0',
            '& .MuiLinearProgress-bar': { bgcolor: '#2ECC71' }
          }}
        />

        <Paper
          sx={{
            p: 2,
            borderRadius: 3,
            bgcolor: '#EAF6FF',
            borderLeft: '6px solid #3498DB',
            mb: 2
          }}
        >
          <Typography fontWeight={700} sx={{ mb: 1 }}>
            Infografia rapida
          </Typography>
          <Typography variant="body2" color="text.secondary">
            El ahorro formal te protege y te abre puertas. Revisa cada bloque y confirma que lo
            entendiste.
          </Typography>
        </Paper>

        <Stack spacing={1.5}>
          {[
            {
              icon: <SecurityIcon sx={{ color: '#1f6fa6' }} />,
              title: 'Seguridad y regulacion',
              desc: 'Instituciones reguladas (banco, caja popular) protegen tu dinero y te dan comprobantes.'
            },
            {
              icon: <SavingsIcon sx={{ color: '#27ae60' }} />,
              title: 'Intereses y rendimiento',
              desc: 'Puedes ganar intereses y evitar que la inflacion erosione tus ahorros.'
            },
            {
              icon: <TimelineIcon sx={{ color: '#8e44ad' }} />,
              title: 'Historial financiero',
              desc: 'Tus depositos generan historial que ayuda a acceder a mejores productos en el futuro.'
            },
            {
              icon: <VerifiedIcon sx={{ color: '#f39c12' }} />,
              title: 'Metas mas claras',
              desc: 'Configuras metas, alertas y automatizaciones que te mantienen constante.'
            }
          ].map((b, idx) => (
            <Paper key={idx} sx={{ p: 2, borderRadius: 3 }}>
              <Stack direction="row" spacing={1.25} alignItems="center">
                {b.icon}
                <Typography fontWeight={700}>{b.title}</Typography>
                <Chip label="Formal" size="small" variant="outlined" />
              </Stack>
              <Typography variant="body2" sx={{ mt: 0.5 }}>
                {b.desc}
              </Typography>
            </Paper>
          ))}
        </Stack>

        <Button
          fullWidth
          variant="contained"
          sx={{ mt: 2, bgcolor: '#2ECC71', '&:hover': { bgcolor: '#27AE60' } }}
          onClick={() => setAck(true)}
        >
          Entendido: quiero estas ventajas
        </Button>
      </Box>
    </LessonShell>
  );
}
