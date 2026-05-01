import { create } from 'zustand';

interface UserState {
  xp: number;
  level: number;
  streak: number;
  maxStreak: number;
  addXp: (amount: number) => void;
  incrementStreak: () => void;
  resetStreak: () => void;
}

export const useUserStore = create<UserState>((set) => {
  // Load initial state from localStorage if available
  let initialXp = 0;
  let initialStreak = 0;
  let initialMaxStreak = 0;

  if (typeof window !== 'undefined') {
    initialXp = parseInt(localStorage.getItem('chessium_xp') || '0', 10);
    initialMaxStreak = parseInt(localStorage.getItem('chessium_max_streak') || '0', 10);
  }

  const calculateLevel = (xp: number) => Math.floor(Math.pow(xp / 100, 0.7)) + 1;

  return {
    xp: initialXp,
    level: calculateLevel(initialXp),
    streak: initialStreak,
    maxStreak: initialMaxStreak,

    addXp: (amount: number) => set((state) => {
      const newXp = state.xp + amount;
      const newLevel = calculateLevel(newXp);
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('chessium_xp', newXp.toString());
      }
      
      return { xp: newXp, level: newLevel };
    }),

    incrementStreak: () => set((state) => {
      const newStreak = state.streak + 1;
      const newMax = Math.max(state.maxStreak, newStreak);
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('chessium_max_streak', newMax.toString());
      }
      
      return { streak: newStreak, maxStreak: newMax };
    }),

    resetStreak: () => set({ streak: 0 }),
  };
});
