import { Chess, Move } from 'chess.js';
import { Engine } from './engine';
import { positionCache, CachedEval } from './positionCache';

export type MoveClassification = 'brilliant' | 'great' | 'best' | 'excellent' | 'good' | 'inaccuracy' | 'mistake' | 'blunder' | 'book' | 'forced';

export interface MoveAnalysis {
  classification: MoveClassification;
  eval: number;           // Eval AFTER this move (White's perspective)
  evalBefore: number;     // Eval BEFORE this move (White's perspective)
  bestMove: string;       // Engine's best move (UCI)
  bestMoveSan: string;    // Engine's best move (SAN)
  playedMove: string;     // Played move (SAN)
  cpLoss: number;         // Centipawn loss
  winPctLoss: number;     // Win percentage loss
  moveAccuracy: number;   // Move accuracy (0-100)
  depth: number;          // Analysis depth used
  bestLine: string;       // Engine's best line (SAN)
  bestLineUci?: string;   // Engine's best line (UCI)
  threat?: string;        // Threat description if any
  alternatives?: { san: string; eval: number }[]; // Top alternative moves
}

export interface AnalysisResult {
  classifications: MoveClassification[];
  moveAnalyses: MoveAnalysis[];
  accuracy: { white: number; black: number };
  evals: number[]; // Evaluation from White's perspective in centipawns
  counts: {
    white: Record<MoveClassification, number>;
    black: Record<MoveClassification, number>;
  };
  summary: {
    white: string;
    black: string;
  };
  cacheStats?: { hits: number; misses: number; totalPositions: number };
  timeTakenMs?: number;
}

// Win percentage formula: Lichess/Chess.com standard
function cpToWinPercent(cp: number): number {
  return 50 + 50 * (2 / (1 + Math.exp(-0.00368208 * cp)) - 1);
}

// Accuracy formula based on win percentage loss (Chess.com CAPS style)
function calculateMoveAccuracy(winPctBefore: number, winPctAfter: number): number {
  const loss = Math.max(0, winPctBefore - winPctAfter);
  const accuracy = 103.1668 * Math.exp(-0.04354 * loss) - 3.1669;
  return Math.max(0, Math.min(100, accuracy));
}

// Convert eval to a normalized white-perspective score for storage
function evalToWhiteScore(score: number, mate: number | null, isWhiteToMove: boolean): number {
  if (mate !== null) {
    const mateWhite = isWhiteToMove ? mate : -mate;
    return mateWhite > 0 ? 10000 - Math.abs(mateWhite) : -10000 + Math.abs(mateWhite);
  }
  return isWhiteToMove ? score : -score;
}

/**
 * Detect if a move involves a sacrifice (giving up material for positional/tactical gain).
 */
function isSacrifice(move: Move, evalBeforeForPlayer: number, evalAfterForPlayer: number): boolean {
  const pieceValues: Record<string, number> = { p: 100, n: 320, b: 330, r: 500, q: 900, k: 0 };
  const capturedValue = move.captured ? pieceValues[move.captured] : 0;
  const movedValue = pieceValues[move.piece];
  
  if (move.captured) {
    // Quality trade-down: Queen for anything less than a Queen, or Rook for Minor/Pawn
    if (movedValue === 900 && capturedValue <= 500) return true;
    if (movedValue === 500 && capturedValue <= 100) return true; // Rook for Pawn
  }
  
  return false;
}

/**
 * Adaptive move time based on position complexity.
 * Complex positions (many pieces, tactical tension) get more time.
 */
function getAdaptiveMoveTime(fen: string, baseTimeMs: number): number {
  const parts = fen.split(' ');
  const position = parts[0];
  
  // Count pieces for complexity estimation
  let pieceCount = 0;
  for (const c of position) {
    if (c.match(/[pnbrqkPNBRQK]/)) pieceCount++;
  }
  
  // Simpler positions (fewer pieces) need less time
  if (pieceCount <= 6) return Math.round(baseTimeMs * 0.3);
  if (pieceCount <= 10) return Math.round(baseTimeMs * 0.5);
  if (pieceCount >= 28) return Math.round(baseTimeMs * 0.6); // Opening positions are well-cached
  
  return baseTimeMs;
}

function classifyMove(
  evalBeforeWhite: number,
  evalAfterWhite: number,
  isWhite: boolean,
  moveIndex: number,
  isForced: boolean,
  isBestMove: boolean,
  move: Move,
  winPctLoss: number
): MoveClassification {
  const evalBeforeForPlayer = isWhite ? evalBeforeWhite : -evalBeforeWhite;
  const evalAfterForPlayer = isWhite ? evalAfterWhite : -evalAfterWhite;
  const cpLoss = Math.max(0, evalBeforeForPlayer - evalAfterForPlayer);

  if (isForced) return 'forced';

  // Opening book detection
  if (moveIndex < 10 && cpLoss < 15 && winPctLoss < 1.5) return 'book';

  if (isBestMove) {
    // Brilliant: A move that is the best move, involves a sacrifice, 
    // and leads to a clearly winning position (eval > 200).
    const isCaptureSacrifice = isSacrifice(move, evalBeforeForPlayer, evalAfterForPlayer);
    if (isCaptureSacrifice && evalAfterForPlayer > 200 && cpLoss < 5) return 'brilliant';
    
    // Great: Finding a winning move from an equal position
    const wasEqual = Math.abs(evalBeforeForPlayer) < 50;
    const nowWinning = evalAfterForPlayer > 180;
    if (wasEqual && nowWinning) return 'great';

    // Great: Finding a crushing blow in a winning position
    if (evalBeforeForPlayer > 100 && evalAfterForPlayer - evalBeforeForPlayer > 200) return 'great';

    return 'best';
  }

  // Non-best moves
  if (winPctLoss < 0.5) return 'best'; // Practically the same as best
  if (winPctLoss < 1.5) return 'excellent';
  if (winPctLoss < 4.0) return 'good';
  if (winPctLoss < 9.0) return 'inaccuracy';
  if (winPctLoss < 18.0) return 'mistake';
  return 'blunder';
}

function generateSummary(accuracy: number, counts: Record<MoveClassification, number>): string {
  const blunders = counts.blunder;
  const mistakes = counts.mistake;
  const brilliancies = counts.brilliant;
  const bestMoves = counts.best;

  if (accuracy >= 95) {
    return brilliancies > 0
      ? `Masterclass performance with ${brilliancies} brilliant move${brilliancies > 1 ? 's' : ''}! Near-perfect accuracy.`
      : 'Engine-level accuracy. Virtually flawless play throughout.';
  } else if (accuracy >= 90) {
    const extra = bestMoves > 5 ? ` Found ${bestMoves} best moves.` : '';
    return blunders === 0
      ? `Excellent game with very precise calculation.${extra}`
      : `Strong play overall, but ${blunders} blunder${blunders > 1 ? 's' : ''} cost material.`;
  } else if (accuracy >= 80) {
    return `Very good play. ${mistakes + blunders} notable error${(mistakes + blunders) > 1 ? 's' : ''}. Strong positional understanding.`;
  } else if (accuracy >= 70) {
    return `Solid play with ${mistakes + blunders} notable error${(mistakes + blunders) > 1 ? 's' : ''}. Room for tactical improvement.`;
  } else if (accuracy >= 50) {
    return `${blunders + mistakes} critical error${(blunders + mistakes) > 1 ? 's' : ''} impacted the game. Focus on tactics training.`;
  } else {
    return `Many errors detected. Recommend puzzle training to improve pattern recognition.`;
  }
}

function uciToSan(fen: string, uci: string): string {
  if (!uci || uci.length < 4 || uci === '(none)') return uci;
  try {
    const tempGame = new Chess(fen);
    const from = uci.substring(0, 2);
    const to = uci.substring(2, 4);
    const promotion = uci.length > 4 ? uci[4] : undefined;
    const moveObj = tempGame.move({ from, to, promotion });
    return moveObj ? moveObj.san : uci;
  } catch {
    return uci;
  }
}

function pvToSan(fen: string, pv: string): string {
  if (!pv) return '';
  try {
    const tempGame = new Chess(fen);
    const uciMoves = pv.split(' ').filter(Boolean);
    const sanMoves: string[] = [];
    for (const uci of uciMoves) {
      if (uci.length < 4) break;
      const from = uci.substring(0, 2);
      const to = uci.substring(2, 4);
      const promotion = uci.length > 4 ? uci[4] : undefined;
      const moveObj = tempGame.move({ from, to, promotion });
      if (moveObj) sanMoves.push(moveObj.san);
      else break;
    }
    return sanMoves.join(' ');
  } catch {
    return pv;
  }
}

type EvalResult = { score: number; mate: number | null; bestMove: string; depth: number; pv: string };

/**
 * Main analysis function with position cache integration.
 * Positions that have been analyzed before are recalled instantly,
 * making re-analyses and common opening positions blazing fast.
 * 
 * Optimizations:
 * - Adaptive move time based on position complexity
 * - Position cache with depth-aware lookups
 * - Faster time allocation for simple/forced positions
 */
export async function analyzeGameFull(
  pgn: string,
  analysisDepth: number = 18,
  progressCallback?: (progress: number) => void,
  cachedResult?: AnalysisResult | null,
  cachedHistoryLength?: number
): Promise<AnalysisResult> {
  const startTime = Date.now();
  const game = new Chess();
  game.loadPgn(pgn);
  const history = game.history({ verbose: true });

  const classifications: MoveClassification[] = new Array(history.length).fill('book');
  const evals: number[] = new Array(history.length + 1).fill(0);
  const moveAnalyses: MoveAnalysis[] = [];

  let startIndex = 0;
  if (cachedResult && cachedHistoryLength !== undefined) {
    startIndex = Math.min(cachedHistoryLength, history.length);
    for (let i = 0; i < startIndex; i++) {
      classifications[i] = cachedResult.classifications[i];
      evals[i] = cachedResult.evals[i];
      moveAnalyses.push(cachedResult.moveAnalyses[i]);
    }
    if (startIndex < evals.length && startIndex < cachedResult.evals.length) {
      evals[startIndex] = cachedResult.evals[startIndex];
    }
  }

  // Create a dedicated engine instance for analysis
  const engine = new Engine();
  await engine.waitUntilReady();
  engine.setConfig({ multiPv: 1, depth: analysisDepth });

  if (progressCallback) progressCallback(0.01);

  // Base time allocation per move (Optimized for speed while maintaining quality)
  let baseMoveTimeMs = 600;
  if (analysisDepth <= 10) baseMoveTimeMs = 150;
  else if (analysisDepth <= 14) baseMoveTimeMs = 300;
  else if (analysisDepth <= 18) baseMoveTimeMs = 600;
  else baseMoveTimeMs = 1000;

  // Minimum depth required to use a cached eval
  const minCacheDepth = Math.max(8, analysisDepth - 4);

  let cacheHits = 0;
  let cacheMisses = 0;

  // Evaluate a position, checking the cache first
  const evaluatePosition = async (fen: string): Promise<EvalResult> => {
    // Check the position cache first
    const cached = positionCache.get(fen, minCacheDepth);
    if (cached) {
      cacheHits++;
      return {
        score: cached.score,
        mate: cached.mate,
        bestMove: cached.bestMove,
        depth: cached.depth,
        pv: cached.pv,
      };
    }

    cacheMisses++;

    // Adaptive move time based on position complexity
    const moveTimeMs = getAdaptiveMoveTime(fen, baseMoveTimeMs);

    // Engine evaluation with promise
    return new Promise((resolve) => {
      let lastScore = 0;
      let lastMate: number | null = null;
      let lastDepth = 0;
      let lastPv = '';

      engine.onEval((score, mate, d) => {
        lastScore = score;
        lastMate = mate;
        lastDepth = d;
      });

      engine.onLines((lines) => {
        if (lines.length > 0) {
          lastPv = lines[0].pv;
          lastScore = lines[0].score;
          lastMate = lines[0].mate;
          lastDepth = lines[0].depth;
        }
      });

      engine.onBestMove((bestMove) => {
        // Store in cache for future use (the "learning" part)
        positionCache.set(fen, {
          score: lastScore,
          mate: lastMate,
          bestMove,
          pv: lastPv,
          depth: lastDepth,
          ts: Date.now(),
        });

        resolve({
          score: lastScore,
          mate: lastMate,
          bestMove,
          depth: lastDepth,
          pv: lastPv,
        });
      });

      engine.evaluateWithMoveTime(fen, moveTimeMs);
    });
  };

  // Build game state up to startIndex
  const evalGame = new Chess();
  const fenHeader = game.header().FEN;
  if (fenHeader) {
    evalGame.load(fenHeader);
  }
  for (let i = 0; i < startIndex; i++) {
    try { evalGame.move(history[i].san); } catch { /* skip */ }
  }

  // Get eval for the starting position
  let preEval: EvalResult;
  if (evalGame.isGameOver()) {
    preEval = { score: 0, mate: evalGame.isCheckmate() ? -1 : null, bestMove: '(none)', depth: 0, pv: '' };
  } else {
    preEval = await evaluatePosition(evalGame.fen());
  }

  if (startIndex === 0) {
    const isWhiteToMove = evalGame.turn() === 'w';
    evals[0] = evalToWhiteScore(preEval.score, preEval.mate, isWhiteToMove);
  }

  let whiteAccuracySum = 0;
  let blackAccuracySum = 0;
  let whiteMovesCount = 0;
  let blackMovesCount = 0;

  if (startIndex > 0) {
    for (let i = 0; i < startIndex; i++) {
      if (i % 2 === 0) {
        whiteAccuracySum += moveAnalyses[i].moveAccuracy;
        whiteMovesCount++;
      } else {
        blackAccuracySum += moveAnalyses[i].moveAccuracy;
        blackMovesCount++;
      }
    }
  }

  for (let i = startIndex; i < history.length; i++) {
    const move = history[i];
    const isWhite = i % 2 === 0;
    const fenBefore = evalGame.fen();
    const isWhiteToMoveBefore = evalGame.turn() === 'w';

    const legalMoves = evalGame.moves();
    const isForced = legalMoves.length === 1;

    const engineBestMove = preEval.bestMove;
    const enginePv = preEval.pv;
    const evalBeforeWhite = evalToWhiteScore(preEval.score, preEval.mate, isWhiteToMoveBefore);

    const engineBestSan = uciToSan(fenBefore, engineBestMove);
    const engineBestLineSan = pvToSan(fenBefore, enginePv);

    // Play the move
    try {
      evalGame.move(move.san);
    } catch (e) {
      console.warn("Analyzer: Could not play move", move.san, e);
      moveAnalyses.push({
        classification: 'book',
        eval: evalBeforeWhite,
        evalBefore: evalBeforeWhite,
        bestMove: '',
        bestMoveSan: '',
        playedMove: move.san,
        cpLoss: 0,
        winPctLoss: 0,
        moveAccuracy: 100,
        depth: 0,
        bestLine: '',
        bestLineUci: '',
      });
      evals[i + 1] = evalBeforeWhite;
      classifications[i] = 'book';
      if (progressCallback) progressCallback((i + 1) / history.length);
      continue;
    }

    // For forced moves, skip engine eval and just quickly evaluate
    if (isForced) {
      const evaluation = preEval;
      const winPctBefore = cpToWinPercent(isWhite ? evalBeforeWhite : -evalBeforeWhite);
      
      if (evalGame.isGameOver()) {
        if (evalGame.isCheckmate()) {
          preEval = { score: 0, mate: -1, bestMove: '(none)', depth: 0, pv: '' };
        } else {
          preEval = { score: 0, mate: null, bestMove: '(none)', depth: 0, pv: '' };
        }
      } else {
        preEval = await evaluatePosition(evalGame.fen());
      }

      const isWhiteToMoveAfter = evalGame.turn() === 'w';
      const evalAfter = evalToWhiteScore(preEval.score, preEval.mate, isWhiteToMoveAfter);
      evals[i + 1] = evalAfter;
      
      const winPctAfter = cpToWinPercent(isWhite ? evalAfter : -evalAfter);
      const bestLineSan = pvToSan(fenBefore, evaluation.pv);

      moveAnalyses.push({
        classification: 'forced',
        eval: evalAfter,
        evalBefore: evalBeforeWhite,
        bestMove: evaluation.bestMove,
        bestMoveSan: uciToSan(fenBefore, evaluation.bestMove),
        playedMove: move.san,
        cpLoss: 0,
        winPctLoss: 0,
        moveAccuracy: 100,
        depth: evaluation.depth,
        bestLine: bestLineSan,
        bestLineUci: evaluation.pv,
      });

      if (isWhite) { whiteAccuracySum += 100; whiteMovesCount++; }
      else { blackAccuracySum += 100; blackMovesCount++; }

      if (progressCallback) progressCallback((i + 1) / history.length);
      continue;
    }

    // Evaluate position AFTER the move
    if (evalGame.isGameOver()) {
      if (evalGame.isCheckmate()) {
        preEval = { score: 0, mate: -1, bestMove: '(none)', depth: 0, pv: '' };
      } else {
        preEval = { score: 0, mate: null, bestMove: '(none)', depth: 0, pv: '' };
      }
    } else {
      preEval = await evaluatePosition(evalGame.fen());
    }

    const isWhiteToMoveAfter = evalGame.turn() === 'w';
    const evalAfterWhite = evalToWhiteScore(preEval.score, preEval.mate, isWhiteToMoveAfter);

    evals[i + 1] = evalAfterWhite;

    const evalBeforeForPlayer = isWhite ? evalBeforeWhite : -evalBeforeWhite;
    const evalAfterForPlayer = isWhite ? evalAfterWhite : -evalAfterWhite;
    const cpLoss = Math.max(0, evalBeforeForPlayer - evalAfterForPlayer);

    const prevWinPct = cpToWinPercent(evalBeforeForPlayer);
    const newWinPct = cpToWinPercent(evalAfterForPlayer);
    const winPctLoss = Math.max(0, prevWinPct - newWinPct);
    const moveAccuracy = calculateMoveAccuracy(prevWinPct, newWinPct);

    if (isWhite) {
      whiteAccuracySum += moveAccuracy;
      whiteMovesCount++;
    } else {
      blackAccuracySum += moveAccuracy;
      blackMovesCount++;
    }

    const playedUci = move.from + move.to + (move.promotion || '');
    const isBestMove = playedUci === engineBestMove;

    const classification = classifyMove(
      evalBeforeWhite, evalAfterWhite, isWhite, i,
      isForced, isBestMove, move, winPctLoss
    );

    classifications[i] = classification;

    moveAnalyses.push({
      classification,
      eval: evalAfterWhite,
      evalBefore: evalBeforeWhite,
      bestMove: engineBestMove,
      bestMoveSan: engineBestSan,
      playedMove: move.san,
      cpLoss,
      winPctLoss,
      moveAccuracy,
      depth: preEval.depth,
      bestLine: engineBestLineSan,
    });

    if (progressCallback) {
      progressCallback((i + 1) / history.length);
    }
  }

  engine.stop();
  engine.destroy();

  // Persist the position cache to localStorage (the "learning" step)
  positionCache.persist();

  const counts = {
    white: { brilliant: 0, great: 0, best: 0, excellent: 0, good: 0, inaccuracy: 0, mistake: 0, blunder: 0, book: 0, forced: 0 },
    black: { brilliant: 0, great: 0, best: 0, excellent: 0, good: 0, inaccuracy: 0, mistake: 0, blunder: 0, book: 0, forced: 0 }
  };

  classifications.forEach((c, i) => {
    if (i % 2 === 0) counts.white[c]++;
    else counts.black[c]++;
  });

  const whiteAccuracy = whiteMovesCount > 0 ? whiteAccuracySum / whiteMovesCount : 0;
  const blackAccuracy = blackMovesCount > 0 ? blackAccuracySum / blackMovesCount : 0;

  return {
    classifications,
    moveAnalyses,
    evals,
    accuracy: {
      white: whiteAccuracy,
      black: blackAccuracy,
    },
    counts,
    summary: {
      white: generateSummary(whiteAccuracy, counts.white),
      black: generateSummary(blackAccuracy, counts.black),
    },
    cacheStats: {
      hits: cacheHits,
      misses: cacheMisses,
      totalPositions: positionCache.stats().size,
    },
    timeTakenMs: Date.now() - startTime,
  };
}

/**
 * Instantly analyze a single move played as a variation.
 * Uses the position cache for speed.
 */
export async function analyzeInstantMove(
  fenBefore: string,
  fenAfter: string,
  move: Move,
  moveIndex: number,
  evalBeforeWhite: number,
): Promise<MoveAnalysis> {
  const engine = new Engine();
  await engine.waitUntilReady();
  engine.setConfig({ multiPv: 1 });

  const evaluateOnce = (fen: string, timeMs: number): Promise<EvalResult> => {
    // Check cache first
    const cached = positionCache.get(fen, 8);
    if (cached) {
      return Promise.resolve({
        score: cached.score,
        mate: cached.mate,
        bestMove: cached.bestMove,
        depth: cached.depth,
        pv: cached.pv,
      });
    }

    return new Promise((resolve) => {
      let lastScore = 0;
      let lastMate: number | null = null;
      let lastDepth = 0;
      let lastPv = '';

      engine.onEval((score, mate, d) => { lastScore = score; lastMate = mate; lastDepth = d; });
      engine.onLines((lines) => { if (lines.length > 0) { lastPv = lines[0].pv; lastScore = lines[0].score; lastMate = lines[0].mate; lastDepth = lines[0].depth; } });
      engine.onBestMove((bestMove) => {
        positionCache.set(fen, { score: lastScore, mate: lastMate, bestMove, pv: lastPv, depth: lastDepth, ts: Date.now() });
        resolve({ score: lastScore, mate: lastMate, bestMove, depth: lastDepth, pv: lastPv });
      });
      engine.evaluateWithMoveTime(fen, timeMs);
    });
  };

  // Get best move from position before
  const preResult = await evaluateOnce(fenBefore, 800);

  // Get eval after the played move
  const postGame = new Chess(fenAfter);
  let postResult: EvalResult;

  if (postGame.isGameOver()) {
    postResult = { score: 0, mate: postGame.isCheckmate() ? -1 : null, bestMove: '(none)', depth: 0, pv: '' };
  } else {
    postResult = await evaluateOnce(fenAfter, 800);
  }

  engine.stop();
  engine.destroy();
  positionCache.persist();

  const isWhite = moveIndex % 2 === 0;
  const isWhiteToMoveAfter = new Chess(fenAfter).turn() === 'w';
  const evalAfterWhite = evalToWhiteScore(postResult.score, postResult.mate, isWhiteToMoveAfter);

  const evalBeforeForPlayer = isWhite ? evalBeforeWhite : -evalBeforeWhite;
  const evalAfterForPlayer = isWhite ? evalAfterWhite : -evalAfterWhite;
  const cpLoss = Math.max(0, evalBeforeForPlayer - evalAfterForPlayer);

  const prevWinPct = cpToWinPercent(evalBeforeForPlayer);
  const newWinPct = cpToWinPercent(evalAfterForPlayer);
  const winPctLoss = Math.max(0, prevWinPct - newWinPct);
  const moveAccuracy = calculateMoveAccuracy(prevWinPct, newWinPct);

  const playedUci = move.from + move.to + (move.promotion || '');
  const isBestMove = playedUci === preResult.bestMove;
  const legalMoves = new Chess(fenBefore).moves();
  const isForced = legalMoves.length === 1;

  const classification = classifyMove(
    evalBeforeWhite, evalAfterWhite, isWhite, moveIndex,
    isForced, isBestMove, move, winPctLoss
  );

  return {
    classification,
    eval: evalAfterWhite,
    evalBefore: evalBeforeWhite,
    bestMove: preResult.bestMove,
    bestMoveSan: uciToSan(fenBefore, preResult.bestMove),
    playedMove: move.san,
    cpLoss,
    winPctLoss,
    moveAccuracy,
    depth: postResult.depth,
    bestLine: pvToSan(fenBefore, preResult.pv),
    bestLineUci: preResult.pv,
  };
}
