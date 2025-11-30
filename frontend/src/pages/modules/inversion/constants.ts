export type InvestmentLessonKind = 'content' | 'quiz' | 'simulator' | 'challenge' | 'feedback';

export type InvestmentLesson = {
  id:
    | 'L01'
    | 'L02'
    | 'L03'
    | 'L04'
    | 'L05'
    | 'L06'
    | 'L07'
    | 'L08'
    | 'L09'
    | 'L10'
    | 'L11'
    | 'L12'
    | 'L13'
    | 'L14'
    | 'L15';
  title: string;
  kind: InvestmentLessonKind;
};

export const INVESTMENT_LESSONS: InvestmentLesson[] = [
  { id: 'L01', title: '¿Qué es invertir?', kind: 'content' },
  { id: 'L02', title: 'Ahorro vs. inversión', kind: 'simulator' },
  { id: 'L03', title: 'Variables clave: rendimiento, riesgo, plazo y liquidez', kind: 'quiz' },
  { id: 'L04', title: 'Solo invierte tus excedentes', kind: 'simulator' },
  { id: 'L05', title: 'Mapa de instrumentos de inversión', kind: 'simulator' },
  { id: 'L06', title: 'Instrumentos de deuda: CETES, BONDES, PRLV', kind: 'content' },
  { id: 'L07', title: 'Instrumentos de renta variable: fondos y acciones', kind: 'content' },
  { id: 'L08', title: 'Perfil del inversionista', kind: 'quiz' },
  { id: 'L09', title: 'Diversificación inteligente', kind: 'simulator' },
  { id: 'L10', title: 'Fraudes y promesas irreales', kind: 'content' },
  { id: 'L11', title: 'Comisiones e impuestos', kind: 'simulator' },
  { id: 'L12', title: 'Inflación y rendimiento real', kind: 'simulator' },
  { id: 'L13', title: 'Plan de inversión personal', kind: 'challenge' },
  { id: 'L14', title: 'Retroalimentación con Finni', kind: 'feedback' },
  { id: 'L15', title: 'Reto final: tu primera inversión simulada', kind: 'challenge' }
];
