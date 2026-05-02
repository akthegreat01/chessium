"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useChessStore } from "@/lib/chessStore";
import { MessageSquare, Lightbulb } from "lucide-react";

export default function BotChat({ isTop }: { isTop?: boolean }) {
  const { botMessage, aiLevel, playingAI } = useChessStore();

  if (!playingAI || !botMessage) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: isTop ? 10 : -10, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: isTop ? 10 : -10, scale: 0.9 }}
        className={`absolute left-0 z-50 w-64 ${isTop ? 'top-full mt-4' : 'bottom-full mb-4'}`}
      >
        <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 shadow-2xl shadow-black/50">
          {/* Arrow */}
          <div className={`absolute left-6 w-4 h-4 bg-white/10 border-white/20 rotate-45 ${
            isTop ? '-top-2 border-l border-t' : '-bottom-2 border-r border-b'
          }`} />
          
          <div className="flex items-start gap-3">
            <div className={`p-2 rounded-xl flex-shrink-0 ${
              botMessage.type === 'coach' ? 'bg-blue-500/20' : 'bg-red-500/20'
            }`}>
              {botMessage.type === 'coach' ? (
                <Lightbulb className="w-4 h-4 text-blue-400" />
              ) : (
                <MessageSquare className="w-4 h-4 text-red-400" />
              )}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-black text-white/40 uppercase tracking-widest">
                  {aiLevel.name}
                </span>
              </div>
              <p className="text-sm font-medium text-white leading-relaxed">
                {botMessage.text}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
