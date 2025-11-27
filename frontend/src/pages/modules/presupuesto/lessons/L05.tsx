import { useMemo, useState } from 'react';
import {
  Box, Stack, Paper, Typography, Chip, TextField, LinearProgress
} from '@mui/material';
import LessonShell from '../LessonShell';
import { lessonProgressRepository } from '../../../../db/lessonProgress.repository';
import { useEffect} from 'react';


type CatKey = 'Vivienda' | 'Comida' | 'Transporte';
type Item = { id: string; label: string; amount: number };

// paleta FinEmpoder
const ORANGE = '#F5B041';


const genId = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : 'e' + Date.now() + Math.random().toString(16).slice(2);

export default function L05() {
  // Ítems a clasificar (puedes modificarlos o tomarlos desde el store más adelante)
  const allItems = useMemo<Item[]>(
    () => [
      { id: genId(), label: 'Renta', amount: 3000 },
      { id: genId(), label: 'Supermercado', amount: 1200 },
      { id: genId(), label: 'Gasolina', amount: 800 },
      { id: genId(), label: 'Snacks', amount: 150 },
      { id: genId(), label: 'Metro/Bus', amount: 250 },
      { id: genId(), label: 'Restaurante', amount: 450 },
    ],
    [],
  );

  // asignaciones por categoría
  const [byCat, setByCat] = useState<Record<CatKey, string[]>>({
    Vivienda: [],
    Comida: [],
    Transporte: [],
  });

  // límites por categoría
  const [limits, setLimits] = useState<Record<CatKey, number>>({
    Vivienda: 0,
    Comida: 0,
    Transporte: 0,
  });

  // utilidades
  const findItem = (id: string) => allItems.find((i) => i.id === id)!;
  const totals: Record<CatKey, number> = {
    Vivienda: byCat.Vivienda.reduce((a, id) => a + findItem(id).amount, 0),
    Comida: byCat.Comida.reduce((a, id) => a + findItem(id).amount, 0),
    Transporte: byCat.Transporte.reduce((a, id) => a + findItem(id).amount, 0),
  };

  const assignedIds = new Set([...byCat.Vivienda, ...byCat.Comida, ...byCat.Transporte]);
  const unassigned = allItems.filter((i) => !assignedIds.has(i.id));

  // DnD handlers (HTML5, sin libs)
  const onDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('text/plain', id);
  };
  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };
  const onDrop = (cat: CatKey, e: React.DragEvent) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain');
    if (!id) return;
    // elimina de cualquier categoría anterior
    setByCat((prev) => {
      const clean: Record<CatKey, string[]> = {
        Vivienda: prev.Vivienda.filter((x) => x !== id),
        Comida: prev.Comida.filter((x) => x !== id),
        Transporte: prev.Transporte.filter((x) => x !== id),
      };
      // agrega en nueva categoría
      clean[cat] = [...clean[cat], id];
      return clean;
    });
  };

  // condición de finalización: todo clasificado + límites definidos (>0) + ninguna categoría supera su límite
  const allClassified = assignedIds.size === allItems.length;
  const limitsOk = (limits.Vivienda > 0 && limits.Comida > 0 && limits.Transporte > 0);
  const withinLimits =
    totals.Vivienda <= limits.Vivienda &&
    totals.Comida <= limits.Comida &&
    totals.Transporte <= limits.Transporte;

  const complete = allClassified && limitsOk && withinLimits;

  const progress =
    Math.round(
      (assignedIds.size / allItems.length) * 70 + // 70% por clasificar
      (Number(limitsOk) * 15) +                   // 15% por fijar límites
      (Number(withinLimits) * 15),               // 15% por respetarlos
    );
useEffect(() => {
  if (!complete) return;
  lessonProgressRepository
    .setCompleted('presupuesto', 'L05')
    .catch(err => console.error(err));
}, [complete]);
  return (
    <LessonShell
      id="L05"
      title="Clasifica tus gastos: crea categorías y límites"
      completeWhen={complete}
      nextPath="/app/presupuesto"          // siguiente aún no implementado
      overviewPath="/app/presupuesto"
    >
      <Box sx={{ p: 1 }}>
        <Paper
          sx={{
            p: 2,
            borderRadius: 3,
            bgcolor: '#FFF8E1',
            borderLeft: `6px solid ${ORANGE}`,
            mb: 2,
          }}
        >
          <Typography variant="body1" sx={{ mb: 1 }}>
            Arrastra cada gasto a su categoría y establece un límite mensual para cada una.
            Completa cuando todos estén clasificados y ningún total exceda su límite.
          </Typography>
        </Paper>

        <LinearProgress
          variant="determinate"
          value={Math.min(100, progress)}
          sx={{
            mb: 2,
            height: 8,
            borderRadius: 5,
            bgcolor: '#f0f0f0',
            '& .MuiLinearProgress-bar': { bgcolor: ORANGE },
          }}
        />

        <Stack spacing={2}>
          {/* No asignados */}
          <Paper sx={{ p: 2, borderRadius: 3 }}>
            <Typography fontWeight={700} sx={{ mb: 1 }}>
              Gastos por clasificar
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {unassigned.length === 0 && (
                <Typography variant="body2" color="text.secondary">
                  Todo clasificado.
                </Typography>
              )}
              {unassigned.map((it) => (
                <Chip
                  key={it.id}
                  draggable
                  onDragStart={(e) => onDragStart(e, it.id)}
                  label={`${it.label} — $${it.amount}`}
                  sx={{ m: 0.5, bgcolor: '#FFE6BF' }}
                />
              ))}
            </Stack>
          </Paper>

          {/* Categorías */}
          {(['Vivienda', 'Comida', 'Transporte'] as CatKey[]).map((cat) => {
            const over = limits[cat] > 0 && totals[cat] > limits[cat];
            return (
              <Paper
                key={cat}
                onDragOver={onDragOver}
                onDrop={(e) => onDrop(cat, e)}
                sx={{
                  p: 2,
                  borderRadius: 3,
                  border: `2px dashed ${over ? '#C0392B' : ORANGE}`,
                  bgcolor: over ? '#FDEDEC' : '#FFFFFF',
                }}
              >
                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={1.5}
                  alignItems={{ xs: 'stretch', sm: 'center' }}
                >
                  <Typography fontWeight={800} sx={{ minWidth: 120 }}>
                    {cat}
                  </Typography>
                  <TextField
                    label="Límite mensual"
                    type="number"
                    value={limits[cat] || ''}
                    onChange={(e) =>
                      setLimits((prev) => ({ ...prev, [cat]: Number(e.target.value) }))
                    }
                    inputProps={{ min: 0, step: '0.01' }}
                    size="small"
                  />
                  <Typography sx={{ ml: 'auto' }}>
                    Total: <b>${totals[cat].toFixed(2)}</b>{' '}
                    {limits[cat] > 0 && (
                      <Typography
                        component="span"
                        color={over ? 'error.main' : 'success.main'}
                        fontWeight={700}
                      >
                        {over ? ' sobre el límite' : ' dentro del límite'}
                      </Typography>
                    )}
                  </Typography>
                </Stack>

                <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 1 }}>
                  {byCat[cat].length === 0 && (
                    <Typography variant="caption" color="text.secondary">
                      Arrastra aquí tus gastos de {cat.toLowerCase()}.
                    </Typography>
                  )}
                  {byCat[cat].map((id) => {
                    const it = findItem(id);
                    return (
                      <Chip
                        key={id}
                        label={`${it.label} — $${it.amount}`}
                        onDelete={() =>
                          setByCat((prev) => ({
                            ...prev,
                            [cat]: prev[cat].filter((x) => x !== id),
                          }))
                        }
                        sx={{
                          m: 0.5,
                          borderColor: ORANGE,
                          borderWidth: 1,
                          borderStyle: 'solid',
                          bgcolor: '#FFF',
                        }}
                      />
                    );
                  })}
                </Stack>
              </Paper>
            );
          })}
        </Stack>
      </Box>
    </LessonShell>
  );
}
