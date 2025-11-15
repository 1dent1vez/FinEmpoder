import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useProgress } from './progress';

export type Lesson = {
  id: string; // 'L01'..'L15'
  title: string;
  kind: 'content' | 'quiz' | 'simulator' | 'challenge';
  completed: boolean;
  score?: number; // 0..100
};

type State = {
  lessons: Lesson[];
  complete: (id: string, score?: number) => void;
  isUnlocked: (id: string) => boolean;
  moduleProgress: number;
};

const initial: Lesson[] = [
  { id: 'L01', title: '¿Por qué hacer un presupuesto?',                kind: 'content',   completed: false },
  { id: 'L02', title: 'Ingresos: fijos y variables',                    kind: 'quiz',      completed: false },
  { id: 'L03', title: 'Gastos fijos, variables y hormiga',              kind: 'simulator', completed: false },
  { id: 'L04', title: 'Cómo registrar ingresos y gastos',               kind: 'simulator', completed: false },
  { id: 'L05', title: 'Clasifica tus gastos (Drag & Drop)',             kind: 'simulator', completed: false },
  { id: 'L06', title: 'Cálculo de balance mensual (mini-calculadora)',  kind: 'simulator', completed: false },
  { id: 'L07', title: 'Ajuste del presupuesto (simulación de decisiones)', kind: 'simulator', completed: false },
  { id: 'L08', title: 'Fugas financieras y crisis (podcast interactivo)', kind: 'content',   completed: false },
  { id: 'L09', title: 'La regla 50-30-20 (infografía dinámica)',       kind: 'content',   completed: false },
  { id: 'L10', title: 'Plan de metas financieras SMART (reto guiado)',  kind: 'challenge', completed: false },
  { id: 'L11', title: 'Presupuesto familiar y app digital (tutorial)',  kind: 'content',   completed: false },
  { id: 'L12', title: 'Presupuesto en tiempos de crisis (simulación)',  kind: 'simulator', completed: false },
  { id: 'L13', title: 'Retroalimentación con Finni (micro-feedback)',   kind: 'content',   completed: false },
  { id: 'L14', title: 'Evaluación: ¿Controlas tus finanzas? (quiz)',    kind: 'quiz',      completed: false },
  { id: 'L15', title: 'Reto final: “Crea tu presupuesto real”',         kind: 'challenge', completed: false },
];

export const useLessons = create<State>()(
  persist(
    (set, get) => ({
      lessons: initial,
      moduleProgress: 0,

      complete: (id, score) => {
        const updated = get().lessons.map((l) =>
          l.id === id ? { ...l, completed: true, score: score ?? l.score ?? 100 } : l
        );
        const completedCount = updated.filter((l) => l.completed).length;
        const pct = Math.round((completedCount / updated.length) * 100);

        set({ lessons: updated, moduleProgress: pct });

        // Sincroniza con widget global + racha
        useProgress.getState().setModuleProgress('presupuesto', pct);
        useProgress.getState().recordActivity('presupuesto', 0);
      },

      isUnlocked: (id) => {
        const idx = get().lessons.findIndex((l) => l.id === id);
        if (idx <= 0) return true;
        return get().lessons[idx - 1]?.completed === true;
      },
    }),
    { name: 'fe_lessons_presupuesto' }
  )
);
