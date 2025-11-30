import { useEffect, useMemo, useState } from 'react';
import { Box, Paper, Stack, Typography, TextField, Slider, Alert, Button } from '@mui/material';
import LessonShell from '../LessonShell';
import { lessonProgressRepository } from '../../../../db/lessonProgress.repository';

export default function L04() {
  const [ingreso, setIngreso] = useState(8000);
  const [gasto, setGasto] = useState(6000);
  const [ahorro, setAhorro] = useState(500);
  const [confirmado, setConfirmado] = useState(false);

  const excedente = useMemo(() => ingreso - gasto - ahorro, [ingreso, gasto, ahorro]);
  const puedeInvertir = excedente > 0 && confirmado;

  useEffect(() => {
    if (!puedeInvertir) return;
    lessonProgressRepository
      .setCompleted('inversion', 'L04')
      .catch((err) => console.error('Error guardando progreso offline L04', err));
  }, [puedeInvertir]);

  return (
    <LessonShell
      id="L04"
      title="Solo invierte tus excedentes"
      completeWhen={puedeInvertir}
      nextPath="/app/inversion/lesson/L05"
      overviewPath="/app/inversion"
    >
      <Box sx={{ p: 1 }}>
        <Paper
          sx={{
            p: 2,
            borderRadius: 3,
            bgcolor: '#FFF8E1',
            borderLeft: '6px solid #F5B041',
            mb: 2
          }}
        >
          <Typography fontWeight={700}>Simulación práctica</Typography>
          <Typography variant="body2" color="text.secondary">
            Ajusta tus ingresos, gastos y ahorro. Solo inviertes el excedente libre. Marca la casilla
            cuando decidas enviarlo a inversión.
          </Typography>
        </Paper>

        <Stack spacing={2}>
          <TextField
            label="Ingreso mensual"
            type="number"
            fullWidth
            value={ingreso}
            onChange={(e) => setIngreso(Number(e.target.value))}
          />
          <TextField
            label="Gastos fijos y variables"
            type="number"
            fullWidth
            value={gasto}
            onChange={(e) => setGasto(Number(e.target.value))}
          />
          <Box>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography fontWeight={700}>Ahorro mensual</Typography>
              <Typography variant="body2" color="text.secondary">
                ${ahorro.toFixed(0)}
              </Typography>
            </Stack>
            <Slider
              value={ahorro}
              min={0}
              max={2000}
              step={50}
              onChange={(_, v) => setAhorro(Number(v))}
              sx={{
                mt: 1,
                '& .MuiSlider-thumb': { bgcolor: '#F5B041' },
                '& .MuiSlider-track': { bgcolor: '#F5B041' }
              }}
            />
          </Box>

          <Paper sx={{ p: 2, borderRadius: 3 }}>
            <Typography fontWeight={700}>Excedente disponible</Typography>
            <Typography variant="h4" fontWeight={900} color={excedente > 0 ? '#27AE60' : '#C0392B'}>
              ${excedente.toFixed(0)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Si es negativo, ajusta gastos o incrementa ingresos/ahorro antes de invertir.
            </Typography>
            <Button
              fullWidth
              sx={{ mt: 1.5 }}
              variant={confirmado ? 'contained' : 'outlined'}
              onClick={() => setConfirmado((v) => !v)}
              disabled={excedente <= 0}
            >
              {confirmado ? 'Excedente enviado a inversión' : 'Enviar excedente a inversión'}
            </Button>
          </Paper>

          <Alert severity={puedeInvertir ? 'success' : 'info'} variant="outlined">
            {puedeInvertir
              ? 'Listo. Estás invirtiendo solo lo que sobra después de cubrir gastos y ahorro.'
              : 'Primero asegura gastos y ahorro; solo invierte el excedente positivo.'}
          </Alert>
        </Stack>
      </Box>
    </LessonShell>
  );
}
