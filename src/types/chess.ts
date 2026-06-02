// ─── Move Classification ────────────────────────────────────────────────────

export type MoveClassification =
  | 'brilliant'
  | 'great'
  | 'best'
  | 'excellent'
  | 'good'
  | 'inaccuracy'
  | 'mistake'
  | 'blunder'
  | 'missed_win'
  | 'book';

// ─── Evaluation Data ────────────────────────────────────────────────────────

export interface EvalData {
  /** Centipawn evaluation from white's perspective */
  cp: number;
  /** Mate in N moves (positive = white mates, negative = black mates) */
  mate: number | null;
  /** Depth reached by the engine */
  depth: number;
  /** Principal variation (best line) */
  pv: string[];
  /** Number of nodes searched */
  nodes?: number;
  /** Time spent in ms */
  time?: number;
}

// ─── Move Analysis ──────────────────────────────────────────────────────────

export interface MoveAnalysis {
  /** Move number (1-based) */
  moveNumber: number;
  /** The move in SAN notation (e.g. "e4", "Nf3") */
  san: string;
  /** The move in UCI notation (e.g. "e2e4") */
  uci: string;
  /** Color who played the move */
  color: 'w' | 'b';
  /** FEN before the move */
  fenBefore: string;
  /** FEN after the move */
  fenAfter: string;
  /** Engine evaluation before the move */
  evalBefore: EvalData;
  /** Engine evaluation after the move */
  evalAfter: EvalData;
  /** The engine's best move in this position (UCI) */
  bestMove: string;
  /** The engine's best move in SAN */
  bestMoveSan: string;
  /** Classification of the move */
  classification: MoveClassification;
  /** Win probability before the move (0-1, from the moving side's perspective) */
  winProbBefore: number;
  /** Win probability after the move (0-1, from the moving side's perspective) */
  winProbAfter: number;
  /** Expected points loss (0-1) */
  expectedPointsLoss: number;
  /** Whether this move was the engine's top choice */
  isTopEngine: boolean;
  /** Opening name if in book */
  opening?: string;
}

// ─── Game Analysis ──────────────────────────────────────────────────────────

export interface GameAnalysis {
  /** All analyzed moves */
  moves: MoveAnalysis[];
  /** White's accuracy percentage (0-100) */
  whiteAccuracy: number;
  /** Black's accuracy percentage (0-100) */
  blackAccuracy: number;
  /** Indices of critical moments (largest eval swings) */
  criticalMoments: number[];
  /** Opening detected */
  opening: Opening | null;
  /** PGN headers from the game */
  headers: PGNHeaders;
  /** Total number of moves */
  totalMoves: number;
  /** Summary counts per classification for white */
  whiteSummary: Record<MoveClassification, number>;
  /** Summary counts per classification for black */
  blackSummary: Record<MoveClassification, number>;
}

// ─── Bot Configuration ──────────────────────────────────────────────────────

export interface BotConfig {
  /** Stockfish Skill Level (0-20) */
  skillLevel: number;
  /** Search depth */
  depth: number;
  /** UCI_Elo value */
  uciElo: number;
  /** Whether UCI_LimitStrength is enabled */
  limitStrength: boolean;
  /** Simulated response delay in milliseconds */
  responseDelay: { min: number; max: number };
  /** Number of threads to use */
  threads: number;
  /** Hash table size in MB */
  hash: number;
}

export interface BotPersonality {
  /** Internal ID */
  id: string;
  /** Display name */
  name: string;
  /** Short description */
  description: string;
  /** Emoji avatar */
  avatar: string;
  /** ELO rating of this bot */
  rating: number;
  /** Preferred opening moves (SAN, e.g. ["e4", "d4"]) */
  preferredOpenings: string[];
  /** Play style descriptor */
  style: 'aggressive' | 'positional' | 'tactical' | 'defensive' | 'balanced' | 'endgame';
  /** Engine configuration for this bot */
  config: BotConfig;
}

// ─── Imported Game ──────────────────────────────────────────────────────────

export interface ImportedGame {
  /** Unique ID (from the source platform or generated) */
  id: string;
  /** Source platform */
  source: 'chess.com' | 'lichess' | 'pgn_file' | 'manual';
  /** PGN text */
  pgn: string;
  /** Parsed headers */
  headers: PGNHeaders;
  /** White player name */
  white: string;
  /** Black player name */
  black: string;
  /** Result string */
  result: string;
  /** Date the game was played */
  date: string;
  /** Time control (e.g. "600+0") */
  timeControl?: string;
  /** URL to the game on the source platform */
  url?: string;
  /** White's rating */
  whiteRating?: number;
  /** Black's rating */
  blackRating?: number;
}

// ─── PGN Headers ────────────────────────────────────────────────────────────

export interface PGNHeaders {
  Event?: string;
  Site?: string;
  Date?: string;
  Round?: string;
  White?: string;
  Black?: string;
  Result?: string;
  WhiteElo?: string;
  BlackElo?: string;
  TimeControl?: string;
  ECO?: string;
  Opening?: string;
  Termination?: string;
  Link?: string;
  UTCDate?: string;
  UTCTime?: string;
  Variant?: string;
  FEN?: string;
  SetUp?: string;
  [key: string]: string | undefined;
}

// ─── Opening ────────────────────────────────────────────────────────────────

export interface Opening {
  /** ECO code (e.g. "B20") */
  eco: string;
  /** Opening name */
  name: string;
  /** Moves leading to this position in SAN */
  moves: string;
  /** FEN position key (first 4 fields) */
  fen?: string;
}

// ─── Chess.com / Lichess Profile ────────────────────────────────────────────

export interface ChessProfile {
  username: string;
  source: 'chess.com' | 'lichess';
  ratings: {
    bullet?: number;
    blitz?: number;
    rapid?: number;
    classical?: number;
    puzzle?: number;
  };
  gamesPlayed: number;
  joinedDate?: string;
  title?: string;
  avatar?: string;
  url: string;
}
