"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Crown, Swords, Brain, Sparkles, Target, Clock, ArrowRight, ChevronDown } from 'lucide-react';
import Link from 'next/link';

const CATEGORIES = ["All", "Tactics", "Strategy", "Endgame", "History", "Psychology"];

const ARTICLES = [
  {
    id: "brilliant-moves",
    title: "The 10 Most Brilliant Moves in Chess History",
    category: "Tactics",
    readTime: "8 min",
    emoji: "💎",
    preview: "From Kasparov's legendary Rxf6 to Tal's sacrificial fireworks, these are the moves that transcended calculation and entered the realm of pure genius.",
    content: `Chess brilliance isn't just about finding the best move — it's about seeing what nobody else can see. Throughout history, certain moves have transcended mere calculation to become works of art.

**1. Kasparov vs Topalov, 1999 — Rxd4!!**
In what many consider the greatest game ever played, Kasparov unleashed a rook sacrifice that led to a forced winning sequence 15 moves deep. The computer era had arrived, but this was pure human creativity.

**2. Tal vs Larsen, 1965 — Rxg7!!**
Mikhail Tal, the "Magician from Riga," sacrificed his rook for a devastating attack. The combination that followed involved every piece on the board.

**3. Morphy vs Duke of Brunswick, 1858 — Qb8+!!**
Paul Morphy's Opera Game queen sacrifice is perhaps the most famous in chess history. It demonstrated perfect development and piece coordination.

**4. Fischer vs Byrne, 1956 — Be6!!**
A 13-year-old Bobby Fischer played what became known as "The Game of the Century" with this stunning bishop sacrifice.

**5. Carlsen vs Anand, 2013 — Rxe7!!**
Magnus Carlsen's precision in the World Championship demonstrated that brilliance can also be quiet and positional.`
  },
  {
    id: "underpromotion-guide",
    title: "The Complete Guide to Underpromotion",
    category: "Tactics",
    readTime: "12 min",
    emoji: "♞",
    preview: "When a queen isn't the answer. Master the art of promoting to knights, rooks, and bishops — the rarest and most beautiful tactical pattern in chess.",
    content: `Underpromotion is perhaps the most elegant concept in chess tactics. It occurs when a pawn reaches the eighth rank and the player deliberately chooses not to promote it to a queen.

**Why Would You NOT Want a Queen?**

There are three main reasons:
1. **Stalemate avoidance** — A queen might leave the opponent with no legal moves
2. **Knight forks** — A knight can attack two pieces simultaneously in ways a queen cannot
3. **Specific piece geometry** — Sometimes only a rook or bishop creates the right threats

**Knight Underpromotion**
The most common type. Knights have a unique movement pattern that no other piece replicates. A pawn promoting to a knight can deliver immediate forks against the king and queen, or create discovered attacks.

**Famous Example: Timman vs Velimirović, 1979**
After a spectacular combinative struggle, the game was decided by a knight underpromotion that forked the king and rook — the only way to win the game.

**Rook Underpromotion**
Almost always used to avoid stalemate. If your opponent's king is trapped and a queen would leave no legal moves, promoting to a rook maintains the winning advantage without stalemate.`
  },
  {
    id: "sacrifices",
    title: "Most Insane Sacrifices That Changed Chess",
    category: "Tactics",
    readTime: "7 min",
    emoji: "🔥",
    preview: "Queen sacrifices, exchange sacrifices, and total piece immolation. The moves that broke every rule and rewrote chess theory.",
    content: `In chess, a sacrifice means giving up material for a greater advantage — usually an attack. But some sacrifices go so far beyond normal that they redefine what's possible.

**The Queen Sacrifice**
The most dramatic type. Giving up your strongest piece for a devastating attack requires absolute precision.

**The Exchange Sacrifice**
Trading a rook for a minor piece. Petrosian was the master of this, often sacrificing the exchange for positional compensation that only became clear 20 moves later.

**Total Piece Immolation**
The rarest form — sacrificing multiple pieces. Tal once sacrificed a knight, then a bishop, then a rook, creating an unstoppable attack with just his queen and pawns.

Understanding sacrifices is crucial for chess improvement. They teach you that material isn't everything — piece activity, king safety, and initiative often matter more.`
  },
  {
    id: "ai-chess",
    title: "AI vs Human: The New Era of Chess",
    category: "History",
    readTime: "10 min",
    emoji: "🤖",
    preview: "From Deep Blue to AlphaZero to Stockfish NNUE — how artificial intelligence transformed chess forever and what it means for human players.",
    content: `The relationship between humans and computers in chess is one of the most fascinating stories in technology.

**1997: Deep Blue Defeats Kasparov**
IBM's Deep Blue became the first computer to defeat a reigning world champion in a match. Kasparov won the first game but lost the match 3.5-2.5. He accused IBM of using human assistance.

**2017: AlphaZero Revolutionizes Chess**
Google DeepMind's AlphaZero learned chess from scratch in just 4 hours and then defeated the world's strongest engine, Stockfish 8. Its playing style was described as "alien" — creative, aggressive, and unlike any engine before.

**2020: Stockfish NNUE**
Stockfish integrated neural network evaluation (NNUE), combining traditional alpha-beta search with machine learning. This made it even stronger than AlphaZero in practical play.

**What This Means for Human Players**
Engines haven't killed chess — they've enriched it. Players now use engines for training, preparation, and analysis. The key is to use them as tools for understanding, not as crutches.`
  },
  {
    id: "endgames",
    title: "Greatest Endgames Ever Played",
    category: "Endgame",
    readTime: "9 min",
    emoji: "👑",
    preview: "The art of converting advantages in the final phase. From Capablanca's technique to Carlsen's endgame wizardry.",
    content: `The endgame is where chess mastery truly reveals itself. While openings can be memorized and middlegames can be intuited, endgames demand precise calculation and deep understanding.

**Capablanca: The Endgame Machine**
José Raúl Capablanca was perhaps the greatest endgame player in history. His technique was so precise that opponents would resign in positions that looked equal to amateurs.

**Carlsen's Modern Endgame Mastery**
Magnus Carlsen has elevated endgame play to new heights. His ability to squeeze wins from drawish positions has earned him the nickname "The Endgame Grinder."

**Key Endgame Principles**
1. King activity becomes crucial
2. Pawn structure determines the outcome
3. Piece coordination is more important than material
4. Patience and technique matter more than brilliance`
  },
  {
    id: "psychology",
    title: "Psychological Warfare on the Chessboard",
    category: "Psychology",
    readTime: "6 min",
    emoji: "🧠",
    preview: "How grandmasters use psychology, time pressure, and intimidation to gain advantages beyond the board.",
    content: `Chess is not just a battle of minds on the board — it's a psychological war. The greatest players have always understood that managing emotions, time, and opponent psychology is as important as calculation.

**Fischer's Psychological Dominance**
Bobby Fischer was famous for his pre-game psychological tactics. He would make unreasonable demands, arrive late, and project an aura of invincibility.

**Kasparov's Intimidation**
Garry Kasparov was known for his intense stare and aggressive body language. Opponents often felt defeated before the game began.

**Time Pressure as a Weapon**
Many grandmasters deliberately play quickly in the opening to put psychological pressure on opponents, then slow down for critical decisions.

**Practical Tips**
1. Stay calm under pressure
2. Don't show emotion after blunders  
3. Use your body language deliberately
4. Trust your preparation`
  },
];

export default function LearnContent() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [expandedArticle, setExpandedArticle] = useState<string | null>(null);

  const filtered = activeCategory === "All" ? ARTICLES : ARTICLES.filter(a => a.category === activeCategory);

  return (
    <div className="min-h-[calc(100vh-4rem)] py-20 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black tracking-[0.2em] uppercase mb-4" style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.2)', color: '#d4af37' }}>
            <BookOpen className="w-3 h-3" /> Educational Content
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-4" style={{ letterSpacing: '-0.02em' }}>
            Learn <span className="text-gradient-gold">Chess</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
            Deep-dive articles on tactics, strategy, psychology, and the most memorable moments in chess history. 
            Written for players of all levels.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                activeCategory === cat 
                  ? 'bg-[#d4af37]/15 text-[#d4af37] border border-[#d4af37]/30' 
                  : 'bg-white/[0.03] text-gray-500 border border-white/[0.05] hover:text-white hover:bg-white/[0.06]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Articles */}
        <div className="space-y-6">
          {filtered.map((article, i) => (
            <motion.article
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="glass-panel rounded-2xl overflow-hidden group"
            >
              <button
                onClick={() => setExpandedArticle(expandedArticle === article.id ? null : article.id)}
                className="w-full p-6 md:p-8 text-left"
              >
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <span className="text-4xl">{article.emoji}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full" style={{ background: 'rgba(212,175,55,0.08)', color: '#d4af37' }}>{article.category}</span>
                      <span className="text-[10px] text-gray-500 flex items-center gap-1"><Clock className="w-3 h-3" />{article.readTime}</span>
                    </div>
                    <h2 className="text-xl font-black text-white group-hover:text-[#d4af37] transition-colors mb-2">{article.title}</h2>
                    <p className="text-gray-400 text-sm leading-relaxed">{article.preview}</p>
                  </div>
                  <ChevronDown className={`w-5 h-5 text-gray-500 flex-shrink-0 transition-transform duration-300 ${expandedArticle === article.id ? 'rotate-180' : ''}`} />
                </div>
              </button>

              {expandedArticle === article.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  transition={{ duration: 0.4 }}
                  className="px-6 md:px-8 pb-8 border-t border-white/[0.04]"
                >
                  <div className="pt-6 text-gray-300 text-sm leading-relaxed whitespace-pre-line max-w-3xl">
                    {article.content}
                  </div>
                  <div className="mt-6">
                    <Link href="/analysis" className="btn-gold-outline px-5 py-2 rounded-lg text-xs font-bold inline-flex items-center gap-2">
                      Try Analysis Board <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </motion.div>
              )}
            </motion.article>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-gray-500 text-sm mb-4">Want to put your knowledge into practice?</p>
          <Link href="/analysis" className="btn-primary px-8 py-3 rounded-xl text-sm uppercase tracking-[0.15em] font-black inline-flex items-center gap-2">
            Start Analyzing <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
