import { useMemo, useState } from 'react';
import {
  Box, Paper, Stack, Typography, Slider, Chip, ToggleButton, ToggleButtonGroup,
  Alert, Divider, LinearProgress, Button
} from '@mui/material';
import LessonShell from '../LessonShell';

const ORANGE = '#F5B041';

type DecisionKey = 'cutLux' | 'renegotiate' | 'increaseIncome' | 'pauseDebt' | 'useEmergency';
type Decision = {
  key: DecisionKey;
  label: string;
  options: { value: string; label: string; impact: number }[];
  help?: string;
};

// pequeña utilidad para formatear %
const pct = (n: number) => `${Math.round(n)}%`;

export default function L12() {
  // Escenario base (puedes enlazar esto al backend más adelante)
  const baseIncome = 100;   // 100% ingreso
  const baseFixed   = 55;   // renta/servicios/transporte
  const baseVariable= 30;   // ocio, suscripciones, extras
  const baseDebt    = 10;   // pagos de deuda
  const baseSave    = 5;    // ahorro

  // Choques de crisis (ej.: inflación/menos horas de trabajo)
  const shockIncome = -10;  // ingreso cae 10%
  const shockFixed  = +5;   // fijos suben 5%
  const shockVar    = +5;   // variables tienden a subir si no se controlan
  const shockDebt   = 0;

  // Controles de usuario: % de recorte o ajuste
  const [cutVarPct, setCutVarPct] = useState(20);   // recorte en variables
  const [cutFixedPct, setCutFixedPct] = useState(5); // ahorro en fijos (eficiencia)

  // Decisiones discretas (todas deben responderse para completar)
  const decisions = useMemo<Decision[]>(
    () => [
      {
        key: 'cutLux',
        label: 'Caprichos/ocio',
        help: 'Reduce comidas fuera, delivery, apps de transporte, microcompras.',
        options: [
          { value: 'low',  label: 'Recorte leve (10%)',    impact:  -10 },
          { value: 'mid',  label: 'Recorte medio (25%)',   impact:  -25 },
          { value: 'high', label: 'Recorte fuerte (50%)',  impact:  -50 },
        ],
      },
      {
        key: 'renegotiate',
        label: 'Renegocia servicios',
        help: 'Llama a tu proveedor, cambia de plan, elimina extras.',
        options: [
          { value: 'none', label: 'Sin cambios', impact: 0 },
          { value: 'plan', label: 'Plan más barato (-5%)', impact: -5 },
          { value: 'swap', label: 'Cambio proveedor (-8%)', impact: -8 },
        ],
      },
      {
        key: 'increaseIncome',
        label: 'Ingreso alterno',
        help: 'Horas extra, freelance, vender algo que no uses.',
        options: [
          { value: 'none', label: 'Nada',  impact: 0 },
          { value: 'small',label: 'Pequeño (+5%)', impact: +5 },
          { value: 'mid',  label: 'Medio (+10%)',  impact: +10 },
        ],
      },
      {
        key: 'pauseDebt',
        label: 'Deuda',
        help: 'Pregunta por reestructura o diferimiento con tu banco.',
        options: [
          { value: 'keep', label: 'Mantener pagos',    impact: 0 },
          { value: 're',   label: 'Reestructurar (-30% pago temporal)', impact: -30 },
        ],
      },
      {
        key: 'useEmergency',
        label: 'Fondo de emergencia',
        help: 'Solo si es necesario y con plan de reposición.',
        options: [
          { value: 'no',  label: 'No usar',       impact: 0 },
          { value: 'yes', label: 'Usar 5% mensual', impact: +5 }, // suma al ingreso efectivo
        ],
      },
    ],
    []
  );

  const [answers, setAnswers] = useState<Record<DecisionKey, string | null>>({
    cutLux: null, renegotiate: null, increaseIncome: null, pauseDebt: null, useEmergency: null
  });

  const allAnswered = Object.values(answers).every(v => v !== null);

  // Aplica choques
  const incomeAfterShock = baseIncome + shockIncome; // 90
  let fixedAfterShock    = baseFixed   + shockFixed; // 60
  let varAfterShock      = baseVariable+ shockVar;   // 35
  let debtAfterShock     = baseDebt    + shockDebt;  // 10
  const saveAfterShock   = baseSave;                 // 5


  // Aplica sliders
  fixedAfterShock = fixedAfterShock * (1 - cutFixedPct/100);
  varAfterShock   = varAfterShock   * (1 - cutVarPct/100);

  // Aplica decisiones discretas
  const getImpact = (key: DecisionKey) =>
    decisions.find(d => d.key === key)?.options.find(o => o.value === answers[key])?.impact ?? 0;

  // impactos
  const luxImpact   = getImpact('cutLux');        // % sobre variables
  const renegImpact = getImpact('renegotiate');   // % sobre fijos
  const incImpact   = getImpact('increaseIncome'); // % sobre ingreso
  const debtImpact  = getImpact('pauseDebt');     // % sobre pago de deuda
  const emeImpact   = getImpact('useEmergency');  // % que suma a ingreso

  // aplicar impactos
  varAfterShock   = varAfterShock * (1 + luxImpact/100);
  fixedAfterShock = fixedAfterShock * (1 + renegImpact/100);
  debtAfterShock  = debtAfterShock * (1 + debtImpact/100);

  const effectiveIncome = incomeAfterShock * (1 + incImpact/100) + (incomeAfterShock * (emeImpact/100));

  const totalGastos = fixedAfterShock + varAfterShock + debtAfterShock + saveAfterShock;
  const balance = effectiveIncome - totalGastos; // >0 superávit, <0 déficit

  const viability = balance >= 0;                 // condición para “plan viable”
  const progress  = Math.round(
    // 70% por responder todo + 30% por lograr viabilidad
    (allAnswered ? 70 : (Object.values(answers).filter(Boolean).length / 5) * 70)
    + (viability ? 30 : 0)
  );

  return (
    <LessonShell
      id="L12"
      title="Presupuesto en tiempos de crisis (Simulación)"
      completeWhen={allAnswered && viability}
      nextPath="/app/presupuesto/lesson/L13"
      overviewPath="/app/presupuesto"
    >
      <Box sx={{ p:1 }}>
        <Paper sx={{ p:2, borderRadius:3, borderLeft:`6px solid ${ORANGE}`, bgcolor:'#FFF8E1', mb:2 }}>
          <Typography fontWeight={800} sx={{ mb: .5 }}>Escenario</Typography>
          <Typography variant="body2" color="text.secondary">
            Tu ingreso cae 10% y tus gastos fijos suben 5%. Ajusta tu presupuesto para volver a equilibrio.
            Completa todas las decisiones y logra un plan <b>viable</b> (superávit ≥ 0).
          </Typography>
        </Paper>

        {/* Sliders de ajuste fino */}
        <Paper sx={{ p:2, borderRadius:3, mb:2 }}>
          <Typography fontWeight={800} sx={{ mb:1 }}>Ajustes rápidos</Typography>
          <Stack spacing={2}>
            <Stack>
              <Typography variant="body2">Recorte en gastos variables: <b>{pct(cutVarPct)}</b></Typography>
              <Slider value={cutVarPct} onChange={(_,v)=>setCutVarPct(v as number)} step={5} min={0} max={60}
                sx={{ '& .MuiSlider-thumb':{ bgcolor: ORANGE }, '& .MuiSlider-track':{ bgcolor: ORANGE } }} />
            </Stack>
            <Stack>
              <Typography variant="body2">Eficiencia en gastos fijos (ahorro de consumo): <b>{pct(cutFixedPct)}</b></Typography>
              <Slider value={cutFixedPct} onChange={(_,v)=>setCutFixedPct(v as number)} step={1} min={0} max={20}
                sx={{ '& .MuiSlider-thumb':{ bgcolor: ORANGE }, '& .MuiSlider-track':{ bgcolor: ORANGE } }} />
            </Stack>
          </Stack>
        </Paper>

        {/* Decisiones discretas */}
        <Stack spacing={1.5} sx={{ mb:2 }}>
          {decisions.map(d => (
            <Paper key={d.key} sx={{ p:1.5, borderRadius:3 }}>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb:.5 }}>
                <Chip label={d.label} size="small" />
                {d.help && <Typography variant="caption" color="text.secondary">{d.help}</Typography>}
              </Stack>
              <ToggleButtonGroup
                exclusive
                size="small"
                value={answers[d.key]}
                onChange={(_, val) => setAnswers(a => ({ ...a, [d.key]: val }))}
              >
                {d.options.map(o => (
                  <ToggleButton key={o.value} value={o.value} sx={{ textTransform:'none' }}>
                    {o.label}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
            </Paper>
          ))}
        </Stack>

        {/* Resumen numérico */}
        <Paper sx={{ p:2, borderRadius:3, mb:2 }}>
          <Typography fontWeight={800} sx={{ mb:1 }}>Resumen</Typography>
          <Stack direction="row" spacing={2} flexWrap="wrap">
            <Chip label={`Ingreso efectivo: ${pct(effectiveIncome)}`} />
            <Chip label={`Fijos: ${pct(fixedAfterShock)}`} />
            <Chip label={`Variables: ${pct(varAfterShock)}`} />
            <Chip label={`Deuda: ${pct(debtAfterShock)}`} />
            <Chip label={`Ahorro: ${pct(saveAfterShock)}`} />
          </Stack>
          <Divider sx={{ my:1 }} />
          {viability ? (
            <Alert severity="success">¡Plan viable! Tienes {pct(balance)} de superávit.</Alert>
          ) : (
            <Alert severity="warning">Aún hay déficit de {pct(Math.abs(balance))}. Ajusta un poco más.</Alert>
          )}
          <LinearProgress
            value={progress}
            variant="determinate"
            sx={{ mt:1.5, height:8, borderRadius:6,
              '& .MuiLinearProgress-bar':{ bgcolor: ORANGE } }}
          />
        </Paper>

        {/* Botones de navegación (por si no usas auto-avance de LessonShell) */}
        <Stack direction="row" spacing={1} justifyContent="flex-end">
          <Button variant="outlined" href="/app/presupuesto">Volver al módulo</Button>
          <Button variant="contained" disabled={!(allAnswered && viability)}
            href="/app/presupuesto/lesson/L13">
            Continuar
          </Button>
        </Stack>
      </Box>
    </LessonShell>
  );
}
