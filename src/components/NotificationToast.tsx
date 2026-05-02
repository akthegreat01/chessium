"use client";

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUserStore } from '@/lib/userStore';
import { Star, Trophy, Sparkles } from 'lucide-react';

export default function NotificationToast() {
  const { pendingNotifications, dismissNotification } = useUserStore();
  const current = pendingNotifications[0];

  useEffect(() => {
    if (!current) return;
    const timer = setTimeout(() => {
      dismissNotification();
    }, 3500);
    return () => clearTimeout(timer);
  }, [current, dismissNotification]);

  return (
    <div className="fixed top-20 right-4 z-[300] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {current && (
          <motion.div
            key={current.message}
            initial={{ opacity: 0, x: 100, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="pointer-events-auto"
          >
            <div className={`flex items-center gap-3 px-5 py-3 rounded-2xl shadow-2xl border backdrop-blur-xl min-w-[240px] ${
              current.type === 'level' 
                ? 'bg-gradient-to-r from-purple-600/90 to-indigo-600/90 border-purple-400/30 shadow-purple-500/30'
                : current.type === 'achievement'
                ? 'bg-gradient-to-r from-yellow-600/90 to-orange-600/90 border-yellow-400/30 shadow-yellow-500/30'
                : 'bg-gradient-to-r from-blue-600/90 to-cyan-600/90 border-blue-400/30 shadow-blue-500/30'
            }`}>
              <div className="text-2xl">
                {current.type === 'level' && <Trophy className="w-6 h-6 text-yellow-300" />}
                {current.type === 'achievement' && <span>{current.icon || '🏆'}</span>}
                {current.type === 'xp' && <Star className="w-6 h-6 text-yellow-300 fill-yellow-300" />}
              </div>
              <div className="flex flex-col">
                <span className="text-white font-black text-sm tracking-wide">{current.message}</span>
                {current.type === 'level' && (
                  <span className="text-white/60 text-[10px] font-medium">Keep analyzing to unlock more!</span>
                )}
              </div>
              <Sparkles className="w-4 h-4 text-white/40 animate-pulse ml-auto" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
