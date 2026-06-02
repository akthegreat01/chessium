import { useState, useEffect, useCallback } from 'react';

export function useCourseProgress() {
  const [completedCourses, setCompletedCourses] = useState<string[]>([]);

  useEffect(() => {
    // Load from local storage on client side
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('chessium_completed_courses');
      if (stored) {
        try {
          setCompletedCourses(JSON.parse(stored));
        } catch (e) {
          console.error("Failed to parse course progress", e);
        }
      }
    }
  }, []);

  const markCompleted = useCallback((courseId: string) => {
    setCompletedCourses(prev => {
      if (prev.includes(courseId)) return prev;
      const next = [...prev, courseId];
      if (typeof window !== 'undefined') {
        localStorage.setItem('chessium_completed_courses', JSON.stringify(next));
      }
      return next;
    });
  }, []);

  const isCompleted = useCallback((courseId: string) => {
    return completedCourses.includes(courseId);
  }, [completedCourses]);

  return {
    completedCourses,
    markCompleted,
    isCompleted
  };
}
