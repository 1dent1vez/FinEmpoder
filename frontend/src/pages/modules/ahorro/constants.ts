export type SavingsLesson = {
  id: string;
  title: string;
  kind: 'content' | 'quiz' | 'simulator' | 'challenge';
};

export const SAVINGS_LESSONS: SavingsLesson[] = [
  { id: 'L01', title: 'Que significa ahorrar?', kind: 'content' },
  { id: 'L02', title: 'Ahorro informal vs. formal', kind: 'simulator' },
  { id: 'L03', title: 'Ventajas del ahorro formal', kind: 'content' },
  { id: 'L04', title: 'Define tu meta (SMART)', kind: 'simulator' },
  { id: 'L05', title: 'Metodo 50-30-20 aplicado al ahorro', kind: 'simulator' },
  { id: 'L06', title: 'Plan 1-3-6 (fondo de emergencia)', kind: 'simulator' },
  { id: 'L07', title: 'Ingresos variables: como ahorrar igual', kind: 'simulator' },
  { id: 'L08', title: 'Ahorro de emergencia en accion', kind: 'simulator' },
  { id: 'L09', title: 'Automatiza tu ahorro', kind: 'content' },
  { id: 'L10', title: 'Interes simple vs. compuesto', kind: 'simulator' },
  { id: 'L11', title: 'Micro-reto: tres depositos seguidos', kind: 'challenge' },
  { id: 'L12', title: 'Ahorro y seguros', kind: 'quiz' },
  { id: 'L13', title: 'Empujoncitos financieros (recordatorios)', kind: 'content' },
  { id: 'L14', title: 'Autoevaluacion del habito de ahorro', kind: 'quiz' },
  { id: 'L15', title: 'Reto final: tu meta alcanzable', kind: 'challenge' },
];
