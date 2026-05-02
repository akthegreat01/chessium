import { create } from 'zustand';

export type UserRank = 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond' | 'Grandmaster';

export function getRankFromLevel(level: number): { name: UserRank, color: string } {
  if (level >= 50) return { name: 'Grandmaster', color: 'from-red-500 to-yellow-500' };
  if (level >= 30) return { name: 'Diamond', color: 'from-cyan-400 to-blue-500' };
  if (level >= 20) return { name: 'Platinum', color: 'from-teal-400 to-emerald-500' };
  if (level >= 10) return { name: 'Gold', color: 'from-yellow-400 to-orange-500' };
  if (level >= 5) return { name: 'Silver', color: 'from-gray-300 to-gray-500' };
  return { name: 'Bronze', color: 'from-orange-700 to-amber-900' };
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: number;
  progress?: number;
  maxProgress?: number;
}

const ALL_ACHIEVEMENTS: Achievement[] = [
  { id: 'first_analysis', title: 'First Steps', description: 'Analyze your first game', icon: '🔍', maxProgress: 1 },
  { id: 'five_analyses', title: 'Student', description: 'Analyze 5 games', icon: '📚', maxProgress: 5 },
  { id: 'twenty_analyses', title: 'Scholar', description: 'Analyze 20 games', icon: '🎓', maxProgress: 20 },
  { id: 'accuracy_90', title: 'Precision', description: 'Score 90+ accuracy in a game', icon: '🎯' },
  { id: 'accuracy_95', title: 'Engine Mind', description: 'Score 95+ accuracy in a game', icon: '🤖' },
  { id: 'brilliant_move', title: 'Brilliant!', description: 'Play a brilliant move', icon: '💎' },
  { id: 'no_blunders', title: 'Clean Sheet', description: 'Play a game with zero blunders', icon: '🛡️' },
  { id: 'streak_3', title: 'On Fire', description: 'Get a 3-day analysis streak', icon: '🔥', maxProgress: 3 },
  { id: 'streak_7', title: 'Dedicated', description: 'Get a 7-day analysis streak', icon: '⚡', maxProgress: 7 },
  { id: 'puzzles_10', title: 'Puzzle Solver', description: 'Solve 10 mistake puzzles', icon: '🧩', maxProgress: 10 },
  { id: 'puzzles_50', title: 'Puzzle Master', description: 'Solve 50 mistake puzzles', icon: '🏆', maxProgress: 50 },
  { id: 'beat_bot', title: 'Bot Slayer', description: 'Win a game against a bot', icon: '⚔️' },
  { id: 'level_5', title: 'Rising Star', description: 'Reach Level 5', icon: '⭐', maxProgress: 5 },
  { id: 'level_10', title: 'Grandmaster Path', description: 'Reach Level 10', icon: '👑', maxProgress: 10 },
];

interface UserState {
  xp: number;
  level: number;
  streak: number;
  maxStreak: number;
  totalAnalyses: number;
  totalPuzzlesSolved: number;
  achievements: Achievement[];
  pendingNotifications: { type: 'xp' | 'level' | 'achievement' | 'brilliant'; message: string; icon?: string }[];
  celebration: 'levelUp' | 'brilliant' | null;
  lastAnalysisDate: string | null;
  dailyStreak: number;
  
  addXp: (amount: number) => void;
  incrementStreak: () => void;
  resetStreak: () => void;
  recordAnalysis: (accuracy?: number, hasBrilliant?: boolean, noBlunders?: boolean) => void;
  recordPuzzleSolved: () => void;
  recordBotWin: () => void;
  checkDailyStreak: () => void;
  dismissNotification: () => void;
  clearCelebration: () => void;
  triggerCelebration: (type: 'levelUp' | 'brilliant') => void;
  getAchievements: () => Achievement[];
}

export const useUserStore = create<UserState>((set, get) => {
  // Load initial state from localStorage if available
  let initialXp = 0;
  let initialStreak = 0;
  let initialMaxStreak = 0;
  let initialTotalAnalyses = 0;
  let initialTotalPuzzles = 0;
  let initialAchievements: string[] = [];
  let initialLastDate: string | null = null;
  let initialDailyStreak = 0;

  if (typeof window !== 'undefined') {
    initialXp = parseInt(localStorage.getItem('chessium_xp') || '0', 10);
    initialMaxStreak = parseInt(localStorage.getItem('chessium_max_streak') || '0', 10);
    initialTotalAnalyses = parseInt(localStorage.getItem('chessium_total_analyses') || '0', 10);
    initialTotalPuzzles = parseInt(localStorage.getItem('chessium_total_puzzles') || '0', 10);
    initialLastDate = localStorage.getItem('chessium_last_analysis_date');
    initialDailyStreak = parseInt(localStorage.getItem('chessium_daily_streak') || '0', 10);
    try {
      initialAchievements = JSON.parse(localStorage.getItem('chessium_achievements') || '[]');
    } catch { /* ignore */ }
  }

  const calculateLevel = (xp: number) => Math.floor(Math.pow(xp / 100, 0.7)) + 1;

  const saveAchievements = (ids: string[]) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('chessium_achievements', JSON.stringify(ids));
    }
  };

  const buildAchievements = (unlockedIds: string[], totalAnalyses: number, totalPuzzles: number, dailyStreak: number, level: number): Achievement[] => {
    return ALL_ACHIEVEMENTS.map(a => {
      const unlocked = unlockedIds.includes(a.id);
      let progress = 0;
      if (a.id === 'five_analyses' || a.id === 'twenty_analyses' || a.id === 'first_analysis') {
        progress = Math.min(totalAnalyses, a.maxProgress || 1);
      } else if (a.id === 'puzzles_10' || a.id === 'puzzles_50') {
        progress = Math.min(totalPuzzles, a.maxProgress || 1);
      } else if (a.id === 'streak_3' || a.id === 'streak_7') {
        progress = Math.min(dailyStreak, a.maxProgress || 1);
      } else if (a.id === 'level_5' || a.id === 'level_10') {
        progress = Math.min(level, a.maxProgress || 1);
      }
      return {
        ...a,
        unlockedAt: unlocked ? 1 : undefined,
        progress: a.maxProgress ? progress : undefined,
      };
    });
  };

  const checkAndUnlock = (id: string, notifications: typeof initialState.pendingNotifications, currentIds: string[]): string[] => {
    if (!currentIds.includes(id)) {
      currentIds = [...currentIds, id];
      const ach = ALL_ACHIEVEMENTS.find(a => a.id === id);
      if (ach) {
        notifications.push({ type: 'achievement', message: `${ach.icon} ${ach.title} Unlocked!`, icon: ach.icon });
      }
      saveAchievements(currentIds);
    }
    return currentIds;
  };

  const initialState = {
    xp: initialXp,
    level: calculateLevel(initialXp),
    streak: initialStreak,
    maxStreak: initialMaxStreak,
    totalAnalyses: initialTotalAnalyses,
    totalPuzzlesSolved: initialTotalPuzzles,
    achievements: buildAchievements(initialAchievements, initialTotalAnalyses, initialTotalPuzzles, initialDailyStreak, calculateLevel(initialXp)),
    pendingNotifications: [] as { type: 'xp' | 'level' | 'achievement' | 'brilliant'; message: string; icon?: string }[],
    celebration: null,
    lastAnalysisDate: initialLastDate,
    dailyStreak: initialDailyStreak,
  };

  return {
    ...initialState,

    addXp: (amount: number) => set((state) => {
      const newXp = state.xp + amount;
      const oldLevel = state.level;
      const newLevel = calculateLevel(newXp);
      const notifications = [...state.pendingNotifications];

      if (newLevel > oldLevel) {
        notifications.push({ type: 'level', message: `Level Up! You are now Level ${newLevel}`, icon: '⬆️' });
        set({ celebration: 'levelUp' });
      }
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('chessium_xp', newXp.toString());
      }

      // Check level achievements
      let unlockedIds = state.achievements.filter(a => a.unlockedAt).map(a => a.id);
      if (newLevel >= 5) unlockedIds = checkAndUnlock('level_5', notifications, unlockedIds);
      if (newLevel >= 10) unlockedIds = checkAndUnlock('level_10', notifications, unlockedIds);
      
      return { 
        xp: newXp, 
        level: newLevel, 
        pendingNotifications: notifications,
        achievements: buildAchievements(unlockedIds, state.totalAnalyses, state.totalPuzzlesSolved, state.dailyStreak, newLevel),
      };
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

    recordAnalysis: (accuracy?: number, hasBrilliant?: boolean, noBlunders?: boolean) => set((state) => {
      const newTotal = state.totalAnalyses + 1;
      const notifications = [...state.pendingNotifications];
      let unlockedIds = state.achievements.filter(a => a.unlockedAt).map(a => a.id);

      // Analysis count achievements
      if (newTotal >= 1) unlockedIds = checkAndUnlock('first_analysis', notifications, unlockedIds);
      if (newTotal >= 5) unlockedIds = checkAndUnlock('five_analyses', notifications, unlockedIds);
      if (newTotal >= 20) unlockedIds = checkAndUnlock('twenty_analyses', notifications, unlockedIds);

      // Accuracy achievements
      if (accuracy && accuracy >= 90) unlockedIds = checkAndUnlock('accuracy_90', notifications, unlockedIds);
      if (accuracy && accuracy >= 95) unlockedIds = checkAndUnlock('accuracy_95', notifications, unlockedIds);

      // Special achievements
      if (hasBrilliant) unlockedIds = checkAndUnlock('brilliant_move', notifications, unlockedIds);
      if (noBlunders) unlockedIds = checkAndUnlock('no_blunders', notifications, unlockedIds);

      // Daily streak
      const today = new Date().toISOString().split('T')[0];
      let newDailyStreak = state.dailyStreak;
      if (state.lastAnalysisDate !== today) {
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
        if (state.lastAnalysisDate === yesterday) {
          newDailyStreak = state.dailyStreak + 1;
        } else {
          newDailyStreak = 1;
        }
      }

      if (newDailyStreak >= 3) unlockedIds = checkAndUnlock('streak_3', notifications, unlockedIds);
      if (newDailyStreak >= 7) unlockedIds = checkAndUnlock('streak_7', notifications, unlockedIds);

      if (typeof window !== 'undefined') {
        localStorage.setItem('chessium_total_analyses', newTotal.toString());
        localStorage.setItem('chessium_last_analysis_date', today);
        localStorage.setItem('chessium_daily_streak', newDailyStreak.toString());
      }
      
      return { 
        totalAnalyses: newTotal, 
        pendingNotifications: notifications,
        achievements: buildAchievements(unlockedIds, newTotal, state.totalPuzzlesSolved, newDailyStreak, state.level),
        lastAnalysisDate: today,
        dailyStreak: newDailyStreak,
      };
    }),

    recordPuzzleSolved: () => set((state) => {
      const newTotal = state.totalPuzzlesSolved + 1;
      const notifications = [...state.pendingNotifications];
      let unlockedIds = state.achievements.filter(a => a.unlockedAt).map(a => a.id);

      if (newTotal >= 10) unlockedIds = checkAndUnlock('puzzles_10', notifications, unlockedIds);
      if (newTotal >= 50) unlockedIds = checkAndUnlock('puzzles_50', notifications, unlockedIds);

      if (typeof window !== 'undefined') {
        localStorage.setItem('chessium_total_puzzles', newTotal.toString());
      }
      
      return { 
        totalPuzzlesSolved: newTotal, 
        pendingNotifications: notifications,
        achievements: buildAchievements(unlockedIds, state.totalAnalyses, newTotal, state.dailyStreak, state.level),
      };
    }),

    recordBotWin: () => set((state) => {
      const notifications = [...state.pendingNotifications];
      let unlockedIds = state.achievements.filter(a => a.unlockedAt).map(a => a.id);
      unlockedIds = checkAndUnlock('beat_bot', notifications, unlockedIds);
      return { 
        pendingNotifications: notifications,
        achievements: buildAchievements(unlockedIds, state.totalAnalyses, state.totalPuzzlesSolved, state.dailyStreak, state.level),
      };
    }),

    checkDailyStreak: () => set((state) => {
      const today = new Date().toISOString().split('T')[0];
      if (state.lastAnalysisDate === today) return {};
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      if (state.lastAnalysisDate !== yesterday && state.lastAnalysisDate !== null) {
        // Streak broken
        if (typeof window !== 'undefined') {
          localStorage.setItem('chessium_daily_streak', '0');
        }
        return { dailyStreak: 0 };
      }
      return {};
    }),

    dismissNotification: () => set((state) => ({
      pendingNotifications: state.pendingNotifications.slice(1),
    })),

    clearCelebration: () => set({ celebration: null }),
    triggerCelebration: (type) => set({ celebration: type }),

    getAchievements: () => get().achievements,
  };
});
