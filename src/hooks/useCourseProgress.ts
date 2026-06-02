import { useState, useEffect } from 'react';

const STORAGE_KEY = 'chessium_course_progress';

export function useCourseProgress(courseId: string) {
  // progress tracks which lesson IDs are completed
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        if (data[courseId] && Array.isArray(data[courseId])) {
          setCompletedLessons(data[courseId]);
        }
      }
    } catch (e) {
      console.error("Failed to load course progress", e);
    } finally {
      setIsLoaded(true);
    }
  }, [courseId]);

  const completeLesson = (lessonId: string) => {
    setCompletedLessons(prev => {
      if (prev.includes(lessonId)) return prev;
      
      const newProgress = [...prev, lessonId];
      
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        const data = stored ? JSON.parse(stored) : {};
        data[courseId] = newProgress;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      } catch (e) {
        console.error("Failed to save course progress", e);
      }
      
      return newProgress;
    });
  };

  const isCompleted = (lessonId: string) => {
    return completedLessons.includes(lessonId);
  };

  return {
    completedLessons,
    isLoaded,
    completeLesson,
    isCompleted
  };
}
