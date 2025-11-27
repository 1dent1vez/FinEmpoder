// src/db/finempoderDb.ts
//import Dexie, { Table } from 'dexie';
import Dexie, { type Table } from 'dexie';
// TIPOS EXPORTADOS
export interface LessonProgress {
  id?: number;
  moduleId: string;       // 'presupuesto' | 'ahorro' | 'inversion' | etc.
  lessonId: string;       // 'L01', 'L02', ...
  completed: boolean;
  completedAt?: string;   // ISO string
}

export interface Streak {
  id?: number;
  date: string;           // 'YYYY-MM-DD'
  count: number;
}

export interface PendingAction {
  id?: number;
  type: 'CREATE' | 'UPDATE' | 'DELETE';
  resource: 'budget' | 'saving' | 'investment' | string;
  payload: unknown;
  createdAt: string;
}

// BASE DE DATOS DEXIE
export class FinempoderDB extends Dexie {
  lessonProgress!: Table<LessonProgress, number>;
  streaks!: Table<Streak, number>;
  pendingActions!: Table<PendingAction, number>;

  constructor() {
    super('FinempoderDB');

    this.version(1).stores({
      lessonProgress: '++id, moduleId, lessonId, completed',
      streaks: '++id, date',
      pendingActions: '++id, type, resource'
    });
  }
}

// INSTANCIA ÚNICA
export const db = new FinempoderDB();
