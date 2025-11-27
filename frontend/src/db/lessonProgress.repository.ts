// src/db/lessonProgress.repository.ts

import { db } from './finempoderDb';
import type { LessonProgress } from './finempoderDb';

export const lessonProgressRepository = {
  async setCompleted(moduleId: string, lessonId: string) {
    const existing = await db.lessonProgress
      .where({ moduleId, lessonId })
      .first();

    const now = new Date().toISOString();

    if (existing) {
      await db.lessonProgress.update(existing.id!, {
        completed: true,
        completedAt: now
      });
      return;
    }

    const record: LessonProgress = {
      moduleId,
      lessonId,
      completed: true,
      completedAt: now
    };

    await db.lessonProgress.add(record);
  },

  async isCompleted(moduleId: string, lessonId: string): Promise<boolean> {
    const existing = await db.lessonProgress
      .where({ moduleId, lessonId })
      .first();

    return !!existing?.completed;
  },

  async getModuleProgress(moduleId: string): Promise<LessonProgress[]> {
    return db.lessonProgress.where('moduleId').equals(moduleId).toArray();
  }
};
