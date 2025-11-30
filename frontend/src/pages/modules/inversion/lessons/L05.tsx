import { useEffect, useMemo, useState } from 'react';
import { Box, Paper, Stack, Typography, Chip, Button, Collapse, Alert } from '@mui/material';
import MapIcon from '@mui/icons-material/Map';
import LessonShell from '../LessonShell';
import { lessonProgressRepository } from '../../../../db/lessonProgress.repository';

type Instrument = {
  id: string;
  name: string;
  risk: 'bajo' | 'medio' | 'alto';
  text: string;
};

const DATA: Instrument[] = [
  { id: 'cetes', name: 'CETES', risk: 'bajo', text: 'Bonos del gobierno a corto plazo, alta liquidez.' },
  { id: 'fondos', name: 'Fondos de inversión', risk: 'medio', text: 'Carteras diversificadas gestionadas por expertos.' },
  { id: 'acciones', name: 'Acciones', risk: 'alto', text: 'Participación en empresas; mayor volatilidad y potencial.' },
  { id: 'udibonos', name: 'UDIBONOS', risk: 'bajo', text: 'Protegen contra inflación, pagan intereses reales.' },
  { id: 'etfs', name: 'ETFs', risk: 'medio', text: 'Replican índices; combinan diversificación y liquidez.' }
];

export default function L05() {
  const [openIds, setOpenIds] = useState<Record<string, boolean>>({});

  const exploredAll = useMemo(
    () => DATA.every((i) => openIds[i.id]),
    [openIds]
  );

  useEffect(() => {
    if (!exploredAll) return;
    lessonProgressRepository
      .setCompleted('inversion', 'L05')
      .catch((err) => console.error('Error guardando progreso offline L05', err));
  }, [exploredAll]);

  const toggle = (id: string) => {
    setOpenIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const chipColor = (risk: Instrument['risk']) => {
    if (risk === 'bajo') return { label: 'Riesgo bajo', color: '#27AE60' };
    if (risk === 'medio') return { label: 'Riesgo medio', color: '#F5B041' };
    return { label: 'Riesgo alto', color: '#E74C3C' };
  };

  return (
    <LessonShell
      id="L05"
      title="Mapa de instrumentos de inversión"
      completeWhen={exploredAll}
      nextPath="/app/inversion/lesson/L06"
      overviewPath="/app/inversion"
    >
      <Box sx={{ p: 1 }}>
        <Paper
          sx={{
            p: 2,
            mb: 2,
            borderRadius: 3,
            bgcolor: '#FFF8E1',
            borderLeft: '6px solid #F5B041'
          }}
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <MapIcon color="warning" />
            <Typography fontWeight={700}>Explora cada instrumento</Typography>
          </Stack>
          <Typography variant="body2" color="text.secondary">
            Abre todas las tarjetas para desbloquear el mapa completo.
          </Typography>
        </Paper>

        <Stack spacing={1.5}>
          {DATA.map((ins) => {
            const riskChip = chipColor(ins.risk);
            const open = !!openIds[ins.id];
            return (
              <Paper key={ins.id} sx={{ p: 2, borderRadius: 3 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Stack spacing={0.5}>
                    <Typography fontWeight={800}>{ins.name}</Typography>
                    <Chip
                      size="small"
                      label={riskChip.label}
                      sx={{ bgcolor: '#FDF2E9', color: riskChip.color, border: `1px solid ${riskChip.color}` }}
                    />
                  </Stack>
                  <Button variant={open ? 'contained' : 'outlined'} onClick={() => toggle(ins.id)}>
                    {open ? 'Ocultar' : 'Ver'}
                  </Button>
                </Stack>
                <Collapse in={open} unmountOnExit>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {ins.text}
                  </Typography>
                </Collapse>
              </Paper>
            );
          })}
        </Stack>

        <Alert sx={{ mt: 2 }} severity={exploredAll ? 'success' : 'info'} variant="outlined">
          {exploredAll
            ? 'Mapa listo. Conoces los principales instrumentos y su nivel de riesgo.'
            : 'Abre cada tarjeta para completar el mapa de inversión.'}
        </Alert>
      </Box>
    </LessonShell>
  );
}
