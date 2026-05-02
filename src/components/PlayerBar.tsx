"use client";

import { useChessStore } from "@/lib/chessStore";
import { Chess } from "chess.js";
import BotChat from "./BotChat";

function getMaterial(fen: string) {
  const chess = new Chess(fen);
  const board = chess.board();
  
  const counts = {
    w: { p: 0, n: 0, b: 0, r: 0, q: 0, k: 0 },
    b: { p: 0, n: 0, b: 0, r: 0, q: 0, k: 0 }
  };
  
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      const piece = board[i][j];
      if (piece) {
        // @ts-ignore
        counts[piece.color][piece.type]++;
      }
    }
  }
  
  const values = { p: 1, n: 3, b: 3, r: 5, q: 9 };
  const wScore = counts.w.p * values.p + counts.w.n * values.n + counts.w.b * values.b + counts.w.r * values.r + counts.w.q * values.q;
  const bScore = counts.b.p * values.p + counts.b.n * values.n + counts.b.b * values.b + counts.b.r * values.r + counts.b.q * values.q;
  
  const wAdvantage = Math.max(0, wScore - bScore);
  const bAdvantage = Math.max(0, bScore - wScore);
  
  // Calculate captured pieces (what is missing from initial 8p, 2n, 2b, 2r, 1q)
  const getCaptured = (color: 'w' | 'b') => {
    const caps = [];
    const opp = color === 'w' ? 'b' : 'w'; // If we are white, we show black pieces we captured
    
    // We captured opponent's pieces if their count is less than starting
    const missingP = Math.max(0, 8 - counts[opp].p);
    const missingN = Math.max(0, 2 - counts[opp].n);
    const missingB = Math.max(0, 2 - counts[opp].b);
    const missingR = Math.max(0, 2 - counts[opp].r);
    const missingQ = Math.max(0, 1 - counts[opp].q);
    
    // Push in order of value: p, n, b, r, q
    for(let i=0; i<missingP; i++) caps.push('p');
    for(let i=0; i<missingN; i++) caps.push('n');
    for(let i=0; i<missingB; i++) caps.push('b');
    for(let i=0; i<missingR; i++) caps.push('r');
    for(let i=0; i<missingQ; i++) caps.push('q');
    
    return caps;
  };
  
  return {
    wAdvantage, bAdvantage,
    wCaptured: getCaptured('w'),
    bCaptured: getCaptured('b')
  };
}

const PieceIcon = ({ type, color }: { type: string, color: 'w'|'b' }) => {
  const iconMap: Record<string, string> = {
    'p': '♙', 'n': '♘', 'b': '♗', 'r': '♖', 'q': '♕'
  };
  // We'll use simple text for now, but style it to look decent
  return <span className={`text-[15px] leading-none ${color === 'w' ? 'text-white drop-shadow-sm' : 'text-gray-900 drop-shadow-[0_1px_1px_rgba(255,255,255,0.5)]'}`}>{iconMap[type]}</span>;
}

export default function PlayerBar({ color, isTop }: { color: 'w' | 'b', isTop?: boolean }) {
  const { fen, game, playingAI, aiLevel, playerColor } = useChessStore();
  const material = getMaterial(fen);
  
  const advantage = color === 'w' ? material.wAdvantage : material.bAdvantage;
  const captured = color === 'w' ? material.wCaptured : material.bCaptured;
  const oppColor = color === 'w' ? 'b' : 'w';
  
  const headers = game.header();
  
  let playerName = color === 'w' 
    ? (headers.White && headers.White !== '?' ? headers.White : 'White') 
    : (headers.Black && headers.Black !== '?' ? headers.Black : 'Black');
    
  let playerElo: string | undefined | null = color === 'w' ? headers.WhiteElo : headers.BlackElo;
  let avatar = color === 'w' ? '♙' : '♟';

  if (playingAI && aiLevel) {
    if (color === playerColor) {
      playerName = 'You';
      playerElo = undefined;
      avatar = '👤';
    } else {
      playerName = aiLevel.name;
      playerElo = aiLevel.elo?.toString();
      avatar = aiLevel.avatar;
    }
  }

  return (
    <div className="flex items-center justify-between h-9 md:h-10 px-1 py-1 w-full relative">
      <div className="flex items-center gap-2 md:gap-3 min-w-0">
        {/* Avatar Placeholder */}
        <div className="w-7 h-7 md:w-8 md:h-8 bg-gray-700/50 rounded-lg flex items-center justify-center overflow-hidden border border-white/10 shrink-0 shadow-inner relative">
           <span className="text-lg md:text-xl opacity-90 leading-none pb-0.5">{avatar}</span>
           
           {/* Bot chat bubble anchor */}
           {playingAI && color !== playerColor && <BotChat isTop={isTop} />}
        </div>
        
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-1.5 md:gap-2">
            <span className="text-xs md:text-sm font-bold text-gray-200 truncate max-w-[120px] md:max-w-none">
              {playerName}
            </span>
            {playerElo && playerElo !== '?' && (
              <span className="text-[10px] md:text-xs text-gray-500 font-mono">({playerElo})</span>
            )}
          </div>
          
          {/* Captured Pieces */}
          <div className="flex items-center gap-0.5 h-4">
            {captured.map((p, i) => (
              <PieceIcon key={i} type={p} color={oppColor} />
            ))}
            {advantage > 0 && (
              <span className="text-[10px] md:text-[11px] text-green-500 font-semibold ml-1">+{advantage}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
