import { useEffect, useMemo, useState } from 'react';
import { Box, Paper, Stack, Typography, TextField, Slider, Button, Alert } from '@mui/material';
import CalculateIcon from '@mui/icons-material/Calculate';
import LessonShell from '../LessonShell';
import { lessonProgressRepository } from '../../../../db/lessonProgress.repository';

export default function L11() {
  const [monto, setMonto] = useState(5000);
  const [tasa, setTasa] = useState(8);
  const [comision, setComision] = useState(1);
  const [impuesto, setImpuesto] = useState(15);
  const [calculado, setCalculado] = useState(false);

  const resultado = useMemo(() => {
    const rendimientoBruto = (monto * tasa) / 100;
    const costoComision = (monto * comision) / 100;
    const impuestoRetencion = ((rendimientoBruto - costoComision) * impuesto) / 100;
    const neto = rendimientoBruto - costoComision - impuestoRetencion;
    const netoPct = (neto / monto) * 100;
    return { rendimientoBruto, costoComision, impuestoRetencion, neto, netoPct };
  }, [monto, tasa, comision, impuesto]);

  useEffect(() => {
    if (!calculado) return;
    lessonProgressRepository
      .setCompleted('inversion', 'L11')
      .catch((err) => console.error('Error guardando progreso offline L11', err));
  }, [calculado]);

  const calcular = () => setCalculado(true);

  return (
    <LessonShell
      id="L11"
      title="Comisiones e impuestos"
      completeWhen={calculado}
      nextPath="/app/inversion/lesson/L12"
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
            <CalculateIcon color="warning" />
            <Typography fontWeight={800}>Simulador financiero</Typography>
          </Stack>
          <Typography variant="body2" color="text.secondary">
            Ajusta tasa, comisión y retención. Calcula el rendimiento neto real después de costos.
          </Typography>
        </Paper>

        <Stack spacing={2}>
          <TextField
            label="Monto a invertir"
            type="number"
            value={monto}
            onChange={(e) => setMonto(Number(e.target.value))}
            fullWidth
          />
          <Stack>
            <Stack direction="row" justifyContent="space-between">
              <Typography fontWeight={700}>Tasa anual (%)</Typography>
              <Typography>{tasa}%</Typography>
            </Stack>
            <Slider
              value={tasa}
              onChange={(_, v) => setTasa(Number(v))}
              min={2}
              max={20}
              step={0.5}
              valueLabelDisplay="auto"
              sx={{ '& .MuiSlider-thumb': { bgcolor: '#F5B041' }, '& .MuiSlider-track': { bgcolor: '#F5B041' } }}
            />
          </Stack>
          <Stack>
            <Stack direction="row" justifyContent="space-between">
              <Typography fontWeight={700}>Comisión anual (%)</Typography>
              <Typography>{comision}%</Typography>
            </Stack>
            <Slider
              value={comision}
              onChange={(_, v) => setComision(Number(v))}
              min={0}
              max={3}
              step={0.1}
              valueLabelDisplay="auto"
              sx={{ '& .MuiSlider-thumb': { bgcolor: '#F5B041' }, '& .MuiSlider-track': { bgcolor: '#F5B041' } }}
            />
          </Stack>
          <Stack>
            <Stack direction="row" justifyContent="space-between">
              <Typography fontWeight={700}>Impuesto a intereses (%)</Typography>
              <Typography>{impuesto}%</Typography>
            </Stack>
            <Slider
              value={impuesto}
              onChange={(_, v) => setImpuesto(Number(v))}
              min={0}
              max={20}
              step={0.5}
              valueLabelDisplay="auto"
              sx={{ '& .MuiSlider-thumb': { bgcolor: '#F5B041' }, '& .MuiSlider-track': { bgcolor: '#F5B041' } }}
            />
          </Stack>

          <Button variant="contained" onClick={calcular} sx={{ bgcolor: '#F5B041', '&:hover': { bgcolor: '#F39C12' } }}>
            Calcular rendimiento neto
          </Button>

          {calculado && (
            <Paper sx={{ p: 2, borderRadius: 3 }}>
              <Typography fontWeight={800} sx={{ mb: 1 }}>
                Resultado neto aproximado
              </Typography>
              <Stack spacing={0.5}>
                <Typography variant="body2">Rendimiento bruto: ${resultado.rendimientoBruto.toFixed(2)}</Typography>
                <Typography variant="body2">Comisión: -${resultado.costoComision.toFixed(2)}</Typography>
                <Typography variant="body2">Impuesto retenido: -${resultado.impuestoRetencion.toFixed(2)}</Typography>
                <Typography fontWeight={800}>Neto anual: ${resultado.neto.toFixed(2)} ({resultado.netoPct.toFixed(2)}%)</Typography>
              </Stack>
            </Paper>
          )}

          <Alert severity="info" variant="outlined">
            Considera comisiones, impuestos y plazos antes de comparar instrumentos.
          </Alert>
        </Stack>
      </Box>
    </LessonShell>
  );
}
