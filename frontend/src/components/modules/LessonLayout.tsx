import { useEffect, useState } from 'react';
import { lessonProgressRepository } from '../../db/lessonProgress.repository';

interface LessonLayoutProps {
  moduleId: string;
  lessonId: string;
  title: string;
  children: React.ReactNode;
  onComplete?: () => void;
}

export default function LessonLayout({
  moduleId,
  lessonId,
  title,
  children,
  onComplete
}: LessonLayoutProps) {
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    lessonProgressRepository
      .isCompleted(moduleId, lessonId)
      .then(setCompleted);
  }, [moduleId, lessonId]);

  const handleFinish = async () => {
    await lessonProgressRepository.setCompleted(moduleId, lessonId);
    setCompleted(true);

    if (onComplete) onComplete();
  };

  return (
    <div style={{ padding: 24 }}>
      <h1>{title}</h1>

      {children}

      {!completed && (
        <button
          onClick={handleFinish}
          style={{
            marginTop: 24,
            padding: '12px 20px',
            borderRadius: 8,
            background: '#ff8a3d',
            color: '#fff',
            fontWeight: 'bold',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          Terminar lección
        </button>
      )}

      {completed && (
        <p style={{ marginTop: 24, color: 'green', fontWeight: 600 }}>
          Lección completada
        </p>
      )}
    </div>
  );
}
