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

function classifyMove(
  evalBeforeWhite: number,
  evalAfterWhite: number,
  isWhite: boolean,
  moveIndex: number,
  isForced: boolean,
  isBestMove: boolean,
  move: Move,
  winPctLoss: number,
): MoveClassification {
  const evalBeforeForPlayer = isWhite ? evalBeforeWhite : -evalBeforeWhite;
  const evalAfterForPlayer = isWhite ? evalAfterWhite : -evalAfterWhite;
  const cpLoss = Math.max(0, evalBeforeForPlayer - evalAfterForPlayer);

  if (isForced) return 'forced';

  // Opening book detection: first 4 full moves with very small loss
  if (moveIndex < 8 && cpLoss < 20 && winPctLoss < 2) return 'book';

  if (isBestMove) {
    // Brilliant: turning a losing/equal position into a winning one
    const wasLosing = evalBeforeForPlayer < -50;
    const nowWinning = evalAfterForPlayer > 150;
    if (wasLosing && nowWinning) return 'brilliant';
    
    // Great: finding a crushing move from an equal position
    const wasEqual = Math.abs(evalBeforeForPlayer) < 50;
    if (wasEqual && nowWinning) return 'great';

    return 'best';
  }

  // Use win percentage loss for classification (more perceptually accurate than raw cp)
  if (winPctLoss < 1) return 'excellent';
  if (winPctLoss < 2) return 'excellent';
  if (winPctLoss < 5) return 'good';
  if (winPctLoss < 10) return 'inaccuracy';
  if (winPctLoss < 20) return 'mistake';
  return 'blunder';
}

function generateSummary(accuracy: number, counts: Record<MoveClassification, number>): string {
  const blunders = counts.blunder;
  const mistakes = counts.mistake;
  const brilliancies = counts.brilliant;

  if (accuracy >= 95) {
    return brilliancies > 0
      ? `Masterclass performance with ${brilliancies} brilliant move${brilliancies > 1 ? 's' : ''}! Near-perfect accuracy.`
      : 'Engine-level accuracy. Virtually flawless play throughout.';
  } else if (accuracy >= 85) {
    return blunders === 0
      ? 'Excellent game with very precise calculation.'
      : `Strong play overall, but ${blunders} blunder${blunders > 1 ? 's' : ''} cost material.`;
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
 */
export async function analyzeGameFull(
  pgn: string,
  analysisDepth: number = 18,
  progressCallback?: (progress: number) => void,
  cachedResult?: AnalysisResult | null,
  cachedHistoryLength?: number
): Promise<AnalysisResult> {
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

  // Time allocation per move
  let moveTimeMs = 1500;
  if (analysisDepth <= 10) moveTimeMs = 500;
  else if (analysisDepth <= 14) moveTimeMs = 1000;
  else if (analysisDepth <= 18) moveTimeMs = 1500;
  else moveTimeMs = 2500;

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
        bestMove: engineBestMove,
        bestMoveSan: engineBestSan,
        playedMove: move.san,
        cpLoss: 0,
        winPctLoss: 0,
        moveAccuracy: 100,
        depth: 0,
        bestLine: engineBestLineSan,
      });
      evals[i + 1] = evalBeforeWhite;
      classifications[i] = 'book';
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
  const preResult = await evaluateOnce(fenBefore, 1000);

  // Get eval after the played move
  const postGame = new Chess(fenAfter);
  let postResult: EvalResult;

  if (postGame.isGameOver()) {
    postResult = { score: 0, mate: postGame.isCheckmate() ? -1 : null, bestMove: '(none)', depth: 0, pv: '' };
  } else {
    postResult = await evaluateOnce(fenAfter, 1000);
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
  };
}
