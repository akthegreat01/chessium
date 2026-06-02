import { Chess } from 'chess.js';
import type {
  MoveClassification,
  MoveAnalysis,
  GameAnalysis,
  EvalData,
  PGNHeaders,
} from '@/types/chess';
import { StockfishEngine } from './engine';
import { detectOpening } from './openings';
import { parsePGN } from './pgn-parser';

// ─── Win Probability ────────────────────────────────────────────────────────

/**
 * Convert centipawn evaluation to win probability.
 * Uses the logistic model: wp = 1 / (1 + exp(-K * cp))
 * where K ≈ 0.00368208 (Lichess CAPS model).
 */
export function winProbability(cp: number): number {
  return 1 / (1 + Math.exp(-0.00368208 * cp));
}

/**
 * Convert mate score to effective centipawn value for win probability.
 */
function mateToCP(mate: number): number {
  if (mate > 0) return 100000 - Math.abs(mate) * 100;
  if (mate < 0) return -100000 + Math.abs(mate) * 100;
  return 0;
}

/**
 * Get the effective centipawn value from an EvalData, handling mate scores.
 */
function effectiveCP(evalData: EvalData): number {
  if (evalData.mate !== null) {
    return mateToCP(evalData.mate);
  }
  return evalData.cp;
}

/**
 * Standardize engine evaluation to always be from White's perspective.
 */
function toWhitePerspective(evalData: EvalData, fen: string): EvalData {
  const isWhiteToMove = fen.split(' ')[1] === 'w';
  if (isWhiteToMove) return evalData;
  return {
    ...evalData,
    cp: -evalData.cp,
    mate: evalData.mate !== null ? -evalData.mate : null,
  };
}

// ─── Move Classification ────────────────────────────────────────────────────

/**
 * Classify a move based on expected points loss and heuristics.
 *
 * Expected points loss = WP(before) - WP(after), from the moving side's perspective.
 */
export function classifyMove(
  evalBefore: EvalData,
  evalAfter: EvalData,
  color: 'w' | 'b',
  isTopEngine: boolean,
  moveSan: string,
  chess: Chess,
): MoveClassification {
  const cpBefore = effectiveCP(evalBefore);
  const cpAfter = effectiveCP(evalAfter);

  // Eval from moving side's perspective
  const sideFactor = color === 'w' ? 1 : -1;
  const cpBeforeSide = cpBefore * sideFactor;
  const cpAfterSide = cpAfter * sideFactor;

  const wpBefore = winProbability(cpBeforeSide);
  const wpAfter = winProbability(cpAfterSide);
  const epLoss = wpBefore - wpAfter;

  // ─── Missed Win ───────────────────────────────────────────────────────
  if (cpBeforeSide > 500 && cpAfterSide < 100) {
    return 'missed_win';
  }

  // ─── Brilliant ────────────────────────────────────────────────────────
  // Sacrifice leading to forced advantage: a capture was possible on the
  // piece that moved, the move is the engine's top choice, and the eval
  // is significantly better than second line.
  if (isTopEngine && epLoss <= 0.001) {
    // Check if the move was a sacrifice (moved piece is attacked)
    const isSacrifice = detectSacrifice(moveSan, chess);
    if (isSacrifice && cpAfterSide > 200) {
      return 'brilliant';
    }
  }

  // ─── Great ────────────────────────────────────────────────────────────
  // Best move in a complex position (many legal moves, position is tense)
  if (isTopEngine && epLoss <= 0.001) {
    const legalMoves = chess.moves().length;
    if (legalMoves >= 30 && Math.abs(cpBeforeSide) < 200) {
      return 'great';
    }
  }

  // ─── Standard classifications by EP loss ──────────────────────────────
  if (epLoss <= 0.001) return 'best';
  if (epLoss <= 0.02) return 'excellent';
  if (epLoss <= 0.05) return 'good';
  if (epLoss <= 0.10) return 'inaccuracy';
  if (epLoss <= 0.20) return 'mistake';
  return 'blunder';
}

/**
 * Heuristic: detect if a move is a sacrifice.
 * A sacrifice is when the player moves a piece to a square where it can be captured.
 */
function detectSacrifice(moveSan: string, chess: Chess): boolean {
  // After the move, check if opponent can recapture on the destination square
  const history = chess.history({ verbose: true });
  if (history.length === 0) return false;

  const lastMove = history[history.length - 1];
  const destSquare = lastMove.to;

  // Check if any opponent piece can capture on the destination square
  const opponentMoves = chess.moves({ verbose: true });
  const recaptures = opponentMoves.filter(
    (m) => m.to === destSquare && m.isCapture()
  );

  // It's a sacrifice if the moved piece is a higher-value piece and can be captured
  if (recaptures.length > 0) {
    const pieceValues: Record<string, number> = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 };
    const movedPieceValue = pieceValues[lastMove.piece] ?? 0;
    const wasCapture = lastMove.captured != null;
    const capturedValue = wasCapture ? (pieceValues[lastMove.captured!] ?? 0) : 0;

    // It's a sacrifice if the piece put in danger is worth more than what was captured
    return movedPieceValue > capturedValue + 1;
  }

  // Also check if the move itself ignores a capture opportunity (quiet sacrifice)
  return moveSan.includes('!') || false;
}

// ─── Accuracy Calculation ───────────────────────────────────────────────────

/**
 * Calculate CAPS-style accuracy for a sequence of moves.
 * Accuracy = average of per-move accuracy scores.
 * Per-move accuracy = min(1, WP_after / WP_before) * 100
 *
 * Uses the harmonic mean approach for better balance.
 */
export function calculateAccuracy(moves: MoveAnalysis[], color: 'w' | 'b'): number {
  const playerMoves = moves.filter((m) => m.color === color);

  if (playerMoves.length === 0) return 100;

  let totalAccuracy = 0;
  let count = 0;

  for (const move of playerMoves) {
    if (move.classification === 'book') continue;

    // Accuracy based on win probability preservation
    const wpBefore = move.winProbBefore;
    const wpAfter = move.winProbAfter;

    let accuracy = 100;
    if (wpAfter < wpBefore) {
      const loss = wpBefore - wpAfter;
      accuracy = 100 * Math.pow(1 - loss, 2);
    }
    
    totalAccuracy += accuracy;
    count++;
  }

  if (count === 0) return 100;

  return Math.round((totalAccuracy / count) * 10) / 10;
}

// ─── Full Game Analysis ─────────────────────────────────────────────────────

export interface AnalyzeGameOptions {
  depth?: number;
  onProgress?: (current: number, total: number) => void;
}

/**
 * Analyze a complete game from PGN.
 * Replays all moves, evaluates each position with the engine.
 */
export async function analyzeGame(
  pgn: string,
  engine: StockfishEngine,
  options: AnalyzeGameOptions = {},
): Promise<GameAnalysis> {
  const { depth = 18, onProgress } = options;

  // Parse PGN
  const { headers, moves: moveSans } = parsePGN(pgn);

  // Set up chess instance
  const tempChess = new Chess();
  tempChess.loadPgn(pgn);
  const moveSansArray = tempChess.history();
  
  const chess = new Chess();
  try {
    chess.loadPgn(pgn);
  } catch (e) {
    console.error("Invalid PGN provided to analyzeGame", e);
  }
  while (chess.undo()) {
    // rewind to start position
  }

  // Detect opening
  const opening = detectOpening(moveSansArray);

  // Analyze initial position
  const initialFen = chess.fen();
  const initialEvalRaw = await engine.analyze({ fen: initialFen, depth });
  const initialEvalWhite = toWhitePerspective(initialEvalRaw.evaluation, initialFen);

  const analyzedMoves: MoveAnalysis[] = [];
  let prevEvalWhite: EvalData = initialEvalWhite;

  // Track opening book moves
  const openingMoveCount = opening ? opening.moves.split(/\s+/).filter((m) => !m.includes('.')).length : 0;

  for (let i = 0; i < moveSansArray.length; i++) {
    const san = moveSansArray[i];
    const color: 'w' | 'b' = chess.turn();
    const fenBefore = chess.fen();
    const moveNumber = Math.floor(i / 2) + 1;

    // Get the best move for this position from the engine
    const bestResultRaw = await engine.analyze({ fen: fenBefore, depth });

    // Play the actual move
    let move;
    try {
      move = chess.move(san);
    } catch (e) {
      console.warn(`Invalid move ${san} at position ${fenBefore}, skipping...`, e);
      continue;
    }
    if (!move) {
      console.warn(`Invalid move ${san} at position ${fenBefore}, skipping...`);
      continue;
    }

    const fenAfter = chess.fen();

    // Evaluate position after the move
    const afterResultRaw = await engine.analyze({ fen: fenAfter, depth });
    const evalAfterWhite = toWhitePerspective(afterResultRaw.evaluation, fenAfter);

    // Calculate win probabilities from the moving side's perspective
    const sideFactor = color === 'w' ? 1 : -1;
    const wpBefore = winProbability(effectiveCP(prevEvalWhite) * sideFactor);
    const wpAfter = winProbability(effectiveCP(evalAfterWhite) * sideFactor);
    const epLoss = Math.max(0, wpBefore - wpAfter);

    // Is this move in the opening book?
    const isBook = i < openingMoveCount;
    const isTopEngine = move.lan === bestResultRaw.bestMove;

    // Classify
    const classification: MoveClassification = isBook
      ? 'book'
      : classifyMove(prevEvalWhite, evalAfterWhite, color, isTopEngine, san, chess);

    // Build best move SAN
    let bestMoveSan = bestResultRaw.bestMove;
    try {
      const tempChess = new Chess(fenBefore);
      const bestMoveObj = tempChess.move({
        from: bestResultRaw.bestMove.substring(0, 2),
        to: bestResultRaw.bestMove.substring(2, 4),
        promotion: bestResultRaw.bestMove.length > 4 ? bestResultRaw.bestMove[4] : undefined,
      });
      if (bestMoveObj) bestMoveSan = bestMoveObj.san;
    } catch {
      // Keep UCI notation if SAN conversion fails
    }

    analyzedMoves.push({
      moveNumber,
      san,
      uci: move.lan,
      color,
      fenBefore,
      fenAfter,
      evalBefore: prevEvalWhite,
      evalAfter: evalAfterWhite,
      bestMove: bestResultRaw.bestMove,
      bestMoveSan,
      classification,
      winProbBefore: wpBefore,
      winProbAfter: wpAfter,
      expectedPointsLoss: epLoss,
      isTopEngine,
      opening: isBook ? opening?.name : undefined,
    });

    // Next iteration
    prevEvalWhite = evalAfterWhite;

    onProgress?.(i + 1, moveSansArray.length);
  }

  // Calculate accuracies
  const whiteAccuracy = calculateAccuracy(analyzedMoves, 'w');
  const blackAccuracy = calculateAccuracy(analyzedMoves, 'b');

  // Detect critical moments
  const criticalMoments = detectCriticalMoments(analyzedMoves);

  // Build summaries
  const whiteSummary = buildSummary(analyzedMoves, 'w');
  const blackSummary = buildSummary(analyzedMoves, 'b');

  return {
    moves: analyzedMoves,
    whiteAccuracy,
    blackAccuracy,
    criticalMoments,
    opening: opening ?? null,
    headers: headers as PGNHeaders,
    totalMoves: moveSans.length,
    whiteSummary,
    blackSummary,
  };
}

// ─── Critical Moments ───────────────────────────────────────────────────────

/**
 * Detect critical moments: positions where the evaluation swung the most.
 * Returns indices into the moves array, sorted by magnitude of eval swing.
 */
export function detectCriticalMoments(
  moves: MoveAnalysis[],
  topN = 5,
): number[] {
  const swings: { index: number; magnitude: number }[] = [];

  for (let i = 0; i < moves.length; i++) {
    const move = moves[i];
    const magnitude = Math.abs(move.winProbBefore - move.winProbAfter);
    swings.push({ index: i, magnitude });
  }

  swings.sort((a, b) => b.magnitude - a.magnitude);

  return swings.slice(0, topN).map((s) => s.index);
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function buildSummary(
  moves: MoveAnalysis[],
  color: 'w' | 'b',
): Record<MoveClassification, number> {
  const summary: Record<MoveClassification, number> = {
    brilliant: 0,
    great: 0,
    best: 0,
    excellent: 0,
    good: 0,
    inaccuracy: 0,
    mistake: 0,
    blunder: 0,
    missed_win: 0,
    book: 0,
  };

  for (const move of moves) {
    if (move.color === color) {
      summary[move.classification]++;
    }
  }

  return summary;
}
