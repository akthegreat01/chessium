"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Flame, TrendingUp, Star } from 'lucide-react';

const LEADERBOARD = [
  { rank: 1, name: "GrandmasterX", xp: 12450, level: 34, streak: 21, badge: "Diamond" },
  { rank: 2, name: "TacticalNinja", xp: 9800, level: 28, streak: 14, badge: "Platinum" },
  { rank: 3, name: "ChessWizard99", xp: 8200, level: 25, streak: 9, badge: "Platinum" },
  { rank: 4, name: "KnightRider", xp: 6500, level: 21, streak: 7, badge: "Gold" },
  { rank: 5, name: "PawnStorm", xp: 5100, level: 18, streak: 5, badge: "Gold" },
  { rank: 6, name: "BishopSniper", xp: 4200, level: 16, streak: 3, badge: "Gold" },
  { rank: 7, name: "RookEndgame", xp: 3400, level: 13, streak: 2, badge: "Silver" },
  { rank: 8, name: "QueenSacrifice", xp: 2800, level: 11, streak: 1, badge: "Silver" },
];

const BADGE_COLORS: Record<string, string> = {
  Diamond: 'text-cyan-400',
  Platinum: 'text-emerald-400',
  Gold: 'text-[#d4af37]',
  Silver: 'text-gray-400',
};

export default function LeaderboardSection() {
  return (
    <section className="relative py-24 md:py-32 px-4 overflow-hidden" id="leaderboard">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[1px]" style={{ background: 'linear-gradient(to right, transparent, rgba(212,175,55,0.2), transparent)' }} />

      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8 }} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black tracking-[0.2em] uppercase mb-4" style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.2)', color: '#d4af37' }}>
            <Medal className="w-3 h-3" /> Community
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4" style={{ letterSpacing: '-0.02em' }}>
            Top <span className="text-gradient-gold">Analysts</span>
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto text-lg">
            Compete with fellow chess enthusiasts. Earn XP through analysis, puzzles, and daily streaks.
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2 }}>
          <div className="glass-panel rounded-2xl overflow-hidden">
            {/* Table header */}
            <div className="grid grid-cols-[3rem_1fr_4rem_4rem_4rem_5rem] md:grid-cols-[3rem_1fr_5rem_5rem_5rem_6rem] gap-2 px-5 py-3 border-b border-white/[0.04] text-[10px] font-black uppercase tracking-widest text-gray-500">
              <span>#</span>
              <span>Player</span>
              <span className="text-right">XP</span>
              <span className="text-right">Lvl</span>
              <span className="text-right">Streak</span>
              <span className="text-right">Rank</span>
            </div>

            {/* Rows */}
            {LEADERBOARD.map((player, i) => (
              <motion.div
                key={player.name}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className={`grid grid-cols-[3rem_1fr_4rem_4rem_4rem_5rem] md:grid-cols-[3rem_1fr_5rem_5rem_5rem_6rem] gap-2 px-5 py-3 items-center border-b border-white/[0.02] hover:bg-white/[0.02] transition-colors ${i < 3 ? 'bg-white/[0.01]' : ''}`}
              >
                <span className="font-black text-sm">
                  {player.rank === 1 ? <span className="text-[#d4af37]">🥇</span> :
                   player.rank === 2 ? <span className="text-gray-300">🥈</span> :
                   player.rank === 3 ? <span className="text-amber-700">🥉</span> :
                   <span className="text-gray-500">{player.rank}</span>}
                </span>
                <span className="font-bold text-sm text-white truncate">{player.name}</span>
                <span className="text-right text-sm font-mono font-bold text-gray-400 tabular-nums">{player.xp.toLocaleString()}</span>
                <span className="text-right text-sm font-bold text-white">{player.level}</span>
                <span className="text-right text-sm font-bold flex items-center justify-end gap-1">
                  {player.streak > 0 && <Flame className="w-3 h-3 text-orange-500 fill-current" />}
                  <span className="text-orange-400">{player.streak}</span>
                </span>
                <span className={`text-right text-[10px] font-black uppercase tracking-wider ${BADGE_COLORS[player.badge]}`}>{player.badge}</span>
              </motion.div>
            ))}
          </div>

          <p className="text-center text-gray-600 text-xs mt-4">
            Rankings update daily. Start analyzing to climb the leaderboard!
          </p>
        </motion.div>
      </div>
    </section>
  );
}
