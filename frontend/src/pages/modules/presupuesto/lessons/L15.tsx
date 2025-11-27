import { useMemo, useState } from 'react';
import {
  Box, Paper, Stack, Typography, TextField, IconButton, Button,
  Divider, Chip, LinearProgress, MenuItem
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LessonShell from '../LessonShell';
import { lessonProgressRepository } from '../../../../db/lessonProgress.repository';
import { useEffect } from 'react';

type Row = { id: string; label: string; amount: number; bucket: 'necesidades'|'deseos'|'ahorro' };
const ORANGE = '#F5B041';
const uid = () => Math.random().toString(36).slice(2, 9);

export default function L15() {
  const [ingresos, setIngresos] = useState<Row[]>([
    { id: uid(), label: 'Ingreso principal', amount: 0, bucket: 'necesidades' }
  ]);
  const [gastos, setGastos] = useState<Row[]>([
    { id: uid(), label: 'Renta/servicios', amount: 0, bucket: 'necesidades' },
    { id: uid(), label: 'Suscripciones', amount: 0, bucket: 'deseos' }
  ]);

  const totalIngreso = useMemo(
    () => ingresos.reduce((a, r) => a + (Number(r.amount) || 0), 0),
    [ingresos]
  );
  const totalNeces = useMemo(
    () => gastos.filter(g => g.bucket === 'necesidades')
                .reduce((a, r) => a + (Number(r.amount) || 0), 0),
    [gastos]
  );
  const totalDeseos = useMemo(
    () => gastos.filter(g => g.bucket === 'deseos')
                .reduce((a, r) => a + (Number(r.amount) || 0), 0),
    [gastos]
  );
  const totalAhorro = useMemo(
    () => gastos.filter(g => g.bucket === 'ahorro')
                .reduce((a, r) => a + (Number(r.amount) || 0), 0),
    [gastos]
  );
  const totalGasto = totalNeces + totalDeseos + totalAhorro;
  const balance = totalIngreso - totalGasto;

  const pNeces = totalIngreso ? Math.round((totalNeces / totalIngreso) * 100) : 0;
  const pDeseos = totalIngreso ? Math.round((totalDeseos / totalIngreso) * 100) : 0;
  const pAhorro = totalIngreso ? Math.round((totalAhorro / totalIngreso) * 100) : 0;

  // Criterios de finalización:
  //  - al menos 1 ingreso > 0
  //  - al menos 2 gastos > 0
  //  - porcentajes “cerca” de la 50/30/20 (±10%)
  const ingresosValidos = totalIngreso > 0;
  const gastosValidos = gastos.filter(g => g.amount > 0).length >= 2;
  const reglaOk =
    Math.abs(pNeces - 50) <= 10 &&
    Math.abs(pDeseos - 30) <= 10 &&
    Math.abs(pAhorro - 20) <= 10;

  const ready = ingresosValidos && gastosValidos && reglaOk;

  const addIngreso = () => setIngresos(arr => [...arr, { id: uid(), label: '', amount: 0, bucket: 'necesidades' }]);
  const addGasto = () => setGastos(arr => [...arr, { id: uid(), label: '', amount: 0, bucket: 'necesidades' }]);

  const removeIngreso = (id: string) => setIngresos(arr => arr.filter(r => r.id !== id));
  const removeGasto = (id: string) => setGastos(arr => arr.filter(r => r.id !== id));

  const saveJSON = () => {
    const data = {
      createdAt: new Date().toISOString(),
      ingresos, gastos, totales: { totalIngreso, totalGasto, balance, pNeces, pDeseos, pAhorro }
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'mi_presupuesto_finempoder.json';
    a.click();
    URL.revokeObjectURL(a.href);
  };
useEffect(() => {
  if (!ready) return;
  lessonProgressRepository
    .setCompleted('presupuesto', 'L15')
    .catch(err => console.error(err));
}, [ready]);
  return (
    <LessonShell
      id="L15"
      title="Reto final: crea tu presupuesto real"
      completeWhen={ready}
      nextPath="/app/presupuesto"
      overviewPath="/app/presupuesto"
    >
      <Box sx={{ p: 1 }}>
        <Paper sx={{ p: 2, borderRadius: 3, borderLeft: `6px solid ${ORANGE}`, mb: 2, bgcolor: '#FFF8E1' }}>
          <Typography sx={{ mb: .5 }}>
            Integra todo lo aprendido: registra tus ingresos, clasifica gastos por Necesidades/Deseos/Ahorro
            y ajusta hasta aproximarte a la regla 50/30/20.
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Se completa automáticamente cuando tu distribución quede cercana a 50/30/20 (±10%) y hayas
            capturado al menos un ingreso y dos gastos.
          </Typography>
        </Paper>

        {/* INGRESOS */}
        <Paper sx={{ p: 2, borderRadius: 3, mb: 2 }}>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
            <Typography fontWeight={800}>Ingresos</Typography>
            <Chip size="small" label={`$${totalIngreso.toFixed(2)}`} />
            <IconButton onClick={addIngreso} aria-label="agregar ingreso"><AddIcon /></IconButton>
          </Stack>

          <Stack spacing={1}>
            {ingresos.map((r, i) => (
              <Stack key={r.id} direction="row" spacing={1} alignItems="center">
                <TextField
                  label={`Concepto ${i + 1}`}
                  value={r.label}
                  onChange={(e) => {
                    const v = e.target.value;
                    setIngresos(arr => arr.map(x => x.id === r.id ? { ...x, label: v } : x));
                  }}
                  sx={{ flex: 1 }}
                />
                <TextField
                  label="Monto"
                  type="number"
                  inputProps={{ step: '0.01', min: 0 }}
                  value={r.amount}
                  onChange={(e) => {
                    const v = Number(e.target.value);
                    setIngresos(arr => arr.map(x => x.id === r.id ? { ...x, amount: v } : x));
                  }}
                  sx={{ width: 160 }}
                />
                <IconButton onClick={() => removeIngreso(r.id)} aria-label="eliminar ingreso"><DeleteIcon /></IconButton>
              </Stack>
            ))}
          </Stack>
        </Paper>

        {/* GASTOS */}
        <Paper sx={{ p: 2, borderRadius: 3 }}>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
            <Typography fontWeight={800}>Gastos</Typography>
            <Chip size="small" label={`$${totalGasto.toFixed(2)}`} />
            <IconButton onClick={addGasto} aria-label="agregar gasto"><AddIcon /></IconButton>
          </Stack>

          <Stack spacing={1}>
            {gastos.map((r, i) => (
              <Stack key={r.id} direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                <TextField
                  label={`Gasto ${i + 1}`}
                  value={r.label}
                  onChange={(e) => {
                    const v = e.target.value;
                    setGastos(arr => arr.map(x => x.id === r.id ? { ...x, label: v } : x));
                  }}
                  sx={{ flex: 1, minWidth: 200 }}
                />
                <TextField
                  select
                  label="Categoría"
                  value={r.bucket}
                  onChange={(e) => {
                    const v = e.target.value as Row['bucket'];
                    setGastos(arr => arr.map(x => x.id === r.id ? { ...x, bucket: v } : x));
                  }}
                  sx={{ width: 190 }}
                >
                  <MenuItem value="necesidades">Necesidades</MenuItem>
                  <MenuItem value="deseos">Deseos</MenuItem>
                  <MenuItem value="ahorro">Ahorro</MenuItem>
                </TextField>
                <TextField
                  label="Monto"
                  type="number"
                  inputProps={{ step: '0.01', min: 0 }}
                  value={r.amount}
                  onChange={(e) => {
                    const v = Number(e.target.value);
                    setGastos(arr => arr.map(x => x.id === r.id ? { ...x, amount: v } : x));
                  }}
                  sx={{ width: 160 }}
                />
                <IconButton onClick={() => removeGasto(r.id)} aria-label="eliminar gasto"><DeleteIcon /></IconButton>
              </Stack>
            ))}
          </Stack>

          <Divider sx={{ my: 2 }} />

          {/* Resumen 50/30/20 */}
          <Stack direction="row" spacing={2} flexWrap="wrap">
            <Chip label={`Necesidades: ${pNeces}%`} color={Math.abs(pNeces - 50) <= 10 ? 'success' : 'warning'} />
            <Chip label={`Deseos: ${pDeseos}%`} color={Math.abs(pDeseos - 30) <= 10 ? 'success' : 'warning'} />
            <Chip label={`Ahorro: ${pAhorro}%`} color={Math.abs(pAhorro - 20) <= 10 ? 'success' : 'warning'} />
            <Chip label={`Balance: $${balance.toFixed(2)}`} variant={balance >= 0 ? 'outlined' : 'filled'} color={balance >= 0 ? 'success' : 'warning'} />
          </Stack>

          <LinearProgress
            variant="determinate"
            value={Math.min(100, (Number(ingresosValidos) + Number(gastosValidos) + Number(reglaOk)) / 3 * 100)}
            sx={{ mt: 2, height: 8, borderRadius: 6, '& .MuiLinearProgress-bar': { bgcolor: ORANGE } }}
          />

          <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
            <Button variant="outlined" startIcon={<SaveIcon />} onClick={saveJSON}>
              Exportar JSON
            </Button>
            {ready && (
              <Chip
                icon={<CheckCircleIcon />}
                color="success"
                label="Listo para completar"
                sx={{ ml: 'auto' }}
              />
            )}
          </Stack>
        </Paper>
      </Box>
    </LessonShell>
  );
}
