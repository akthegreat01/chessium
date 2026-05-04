import { create } from 'zustand';
import { Chess, Move } from 'chess.js';
import { Engine, EngineLine, EngineConfig } from './engine';
import { AnalysisResult, MoveAnalysis, analyzeGameFull, analyzeInstantMove } from './analyzer';
import { playMoveSound, playCaptureSound, playCheckSound, playCastleSound, playGameEndSound } from './sounds';
import { saveGameToHistory, generateGameId } from './gameHistory';
import { getBotResponse } from './botMessages';

export type GameData = {
  id?: string;
  pgn: string;
  white: string;
  black: string;
  date?: string;
};

export type BoardTheme = {
  id: string;
  name: string;
  light: string;
  dark: string;
};

export const BOARD_THEMES: BoardTheme[] = [
  { id: 'aura', name: 'Aura Dark', light: '#e2e8f0', dark: '#2a2d35' },
  { id: 'green', name: 'Classic Green', light: '#ebecd0', dark: '#739552' },
  { id: 'blue', name: 'Ocean Blue', light: '#dee3e6', dark: '#6992c2' },
  { id: 'wood', name: 'Natural Wood', light: '#f0d9b5', dark: '#b58863' },
  { id: 'cyber', name: 'Cyberpunk', light: '#323232', dark: '#00ff41' },
  { id: 'glass', name: 'Glassmorphism', light: 'rgba(255,255,255,0.2)', dark: 'rgba(0,0,0,0.3)' },
  { id: 'emerald', name: 'Emerald', light: '#d2f4d3', dark: '#2d5a27' },
  { id: 'midnight', name: 'Midnight', light: '#c8c8d0', dark: '#3a3a52' },
  { id: 'crimson', name: 'Crimson', light: '#f8d7da', dark: '#721c24' },
];

export type BotPersonality = {
  id: string;
  name: string;
  elo: number;
  avatar: string;
  description: string;
  style: 'balanced' | 'aggressive' | 'positional';
};

export const BOT_PERSONALITIES: BotPersonality[] = [
  { id: 'bot_martin', name: 'Martin', elo: 250, avatar: '👶', description: 'Martin is just learning how the pieces move.', style: 'balanced' },
  { id: 'bot_jimmy', name: 'Jimmy', elo: 600, avatar: '👦', description: 'Jimmy plays fast and loves to trade pieces.', style: 'aggressive' },
  { id: 'bot_nelson', name: 'Nelson', elo: 1300, avatar: '🤠', description: 'Nelson brings his queen out early and attacks aggressively.', style: 'aggressive' },
  { id: 'bot_antonio', name: 'Antonio', elo: 1500, avatar: '👨', description: 'Antonio plays a solid positional game.', style: 'positional' },
  { id: 'bot_isabel', name: 'Isabel', elo: 1600, avatar: '👩', description: 'Isabel loves tactics and will capitalize on your blunders.', style: 'aggressive' },
  { id: 'bot_wally', name: 'Wally', elo: 1800, avatar: '👴', description: 'Wally rarely makes mistakes and grinds out endgames.', style: 'positional' },
  { id: 'bot_hikaru', name: 'GM Hikaru', elo: 2800, avatar: '🥷', description: 'Plays at the highest level of human chess.', style: 'balanced' },
  { id: 'bot_stockfish', name: 'Stockfish 16', elo: 3200, avatar: '🤖', description: 'Maximum strength. Unbeatable machine.', style: 'balanced' },
];

interface ChessState {
  game: Chess;
  fen: string;
  history: Move[];
  currentMoveIndex: number; // -1 means starting position
  openingName: string | null;
  engineLines: EngineLine[];
  savedGames: GameData[];

  // Game Review
  analysisResult: AnalysisResult | null;
  mainLineHistory: Move[] | null;
  mainLineAnalysisResult: AnalysisResult | null;
  isAnalyzing: boolean;
  analysisProgress: number;
  analysisDepth: number;

  // Instant variation analysis for alternate moves
  variationAnalysis: MoveAnalysis | null;

  // Settings
  boardTheme: BoardTheme;
  boardFlipped: boolean;
  soundEnabled: boolean;
  zenMode: boolean;
  premovesEnabled: boolean;
  premove: { from: string; to: string; promotion?: string } | null;
  hintMove: string | null;

  // AI Play
  playingAI: boolean;
  aiLevel: BotPersonality;
  playerColor: 'w' | 'b';
  aiEngine: Engine | null;
  gameResult: string | null;
  botMessage: { text: string; type: 'trash' | 'coach' } | null;
  explainWhyLine: string[] | null; // For the "ghost" moves

  // Click-to-move state
  selectedSquare: string | null;
  legalMovesForSelected: string[];

  // Annotations
  userArrows: { startSquare: string; endSquare: string; color: string }[];
  userSquares: Record<string, { backgroundColor: string }>;

  // Engine config
  engineConfig: EngineConfig;

  // Actions
  initEngine: () => void;
  makeMove: (move: string | { from: string; to: string; promotion?: string }) => boolean;
  goToMove: (index: number) => void;
  goBack: () => void;
  goForward: () => void;
  loadPgn: (pgn: string) => void;
  loadFen: (fen: string) => void;
  resetGame: () => void;
  toggleZenMode: () => void;
  togglePremoves: () => void;
  setPremove: (move: { from: string; to: string; promotion?: string } | null) => void;
  clearPremove: () => void;
  setBotMessage: (msg: { text: string; type: 'trash' | 'coach' } | null) => void;
  setExplainWhyLine: (line: string[] | null) => void;
  saveGame: (data: GameData) => void;
  loadSavedGames: () => void;
  runGameReview: () => Promise<void>;
  setBoardTheme: (theme: BoardTheme) => void;
  flipBoard: () => void;
  toggleSound: () => void;
  showHintMove: () => void;
  hideHint: () => void;
  restoreMainLine: () => void;
  setAnalysisDepth: (depth: number) => void;
  setEngineConfig: (config: Partial<EngineConfig>) => void;
  selectSquare: (square: string | null) => void;
  setOpeningName: (name: string | null) => void;
  
  // Annotations
  setUserArrows: (arrows: { startSquare: string; endSquare: string; color: string }[]) => void;
  toggleUserSquare: (square: string, color: string) => void;
  clearAnnotations: () => void;

  // AI Play
  startAIGame: (level: BotPersonality, color: 'w' | 'b') => void;
  stopAIGame: () => void;
  resignGame: () => void;
}

function playMoveAudio(move: Move, game: Chess) {
  if (game.isCheckmate() || game.isStalemate() || game.isDraw()) {
    playGameEndSound();
  } else if (game.isCheck()) {
    playCheckSound();
  } else if (move.flags.includes('k') || move.flags.includes('q')) {
    playCastleSound();
  } else if (move.captured) {
    playCaptureSound();
  } else {
    playMoveSound();
  }
}

export const useChessStore = create<ChessState>((set, get) => ({
  game: new Chess(),
  fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
  history: [],
  currentMoveIndex: -1,
  openingName: null,
  engineLines: [],
  savedGames: [],
  analysisResult: null,
  mainLineHistory: null,
  mainLineAnalysisResult: null,
  isAnalyzing: false,
  analysisProgress: 0,
  analysisDepth: 18,
  variationAnalysis: null,
  boardTheme: BOARD_THEMES[1],
  boardFlipped: false,
  soundEnabled: true,
  showHint: false,
  hintMove: null,
  zenMode: false,
  premovesEnabled: true,
  premove: null,
  playingAI: false,
  aiLevel: BOT_PERSONALITIES[3],
  playerColor: 'w',
  aiEngine: null,
  gameResult: null,
  botMessage: null,
  explainWhyLine: null,
  selectedSquare: null,
  legalMovesForSelected: [],
  userArrows: [],
  userSquares: {},
  engineConfig: { depth: 20, multiPv: 3, threads: 1, hash: 16 },

  initEngine: () => {
    // No-op
  },

  setUserArrows: (arrows) => set({ userArrows: arrows }),
  toggleUserSquare: (square, color) => {
    const { userSquares } = get();
    const newSquares = { ...userSquares };
    if (newSquares[square]) {
      delete newSquares[square];
    } else {
      newSquares[square] = { backgroundColor: color };
    }
    set({ userSquares: newSquares });
  },
  clearAnnotations: () => set({ userArrows: [], userSquares: {} }),
  togglePremoves: () => {
    const newVal = !get().premovesEnabled;
    set({ premovesEnabled: newVal });
    if (typeof window !== "undefined") {
      localStorage.setItem('chess_premoves_enabled', String(newVal));
    }
  },
  setPremove: (move) => set({ premove: move }),
  clearPremove: () => set({ premove: null }),

  makeMove: (move) => {
    const { game, currentMoveIndex, history, soundEnabled, playingAI, playerColor, aiLevel, analysisResult } = get();
    try {
      const newGame = new Chess();
      const headers = game.header();
      for (const [key, value] of Object.entries(headers)) {
        if (typeof value === 'string') {
          newGame.header(key, value);
        }
      }
      
      const historyToReplay = history.slice(0, currentMoveIndex + 1);
      for (const h of historyToReplay) {
        newGame.move(h.san);
      }
      
      const moveObj = newGame.move(move);

      const newHistory = history.slice(0, currentMoveIndex + 1);
      let newMainLineHistory = get().mainLineHistory;
      let newMainLineAnalysis = get().mainLineAnalysisResult;

      if (currentMoveIndex < history.length - 1 && get().mainLineHistory === null) {
        newMainLineHistory = [...history];
        newMainLineAnalysis = get().analysisResult;
      }

      newHistory.push(moveObj);
      const newFen = newGame.fen();

      let result: string | null = null;
      if (newGame.isCheckmate()) {
        result = newGame.turn() === 'w' ? '0-1' : '1-0';
      } else if (newGame.isStalemate() || newGame.isDraw()) {
        result = '1/2-1/2';
      }

      const moveIndex = currentMoveIndex + 1;
      const cachedAnalysis = newMainLineAnalysis || analysisResult;
      let evalBeforeWhite: number | null = null;
      if (cachedAnalysis && cachedAnalysis.evals && moveIndex < cachedAnalysis.evals.length) {
        evalBeforeWhite = cachedAnalysis.evals[moveIndex];
      }

      set({
        game: newGame,
        fen: newFen,
        history: newHistory,
        currentMoveIndex: moveIndex,
        engineLines: [],
        mainLineHistory: newMainLineHistory,
        mainLineAnalysisResult: newMainLineAnalysis,
        showHint: false,
        hintMove: null,
        gameResult: result,
        playingAI: result ? false : playingAI,
        selectedSquare: null,
        legalMovesForSelected: [],
        variationAnalysis: null,
        userArrows: [], // Clear on move
        userSquares: {}, // Clear on move
      });

      analyzeInstantMove(game.fen(), newFen, moveObj, moveIndex, evalBeforeWhite || 0)
        .then(variationResult => {
          const currentState = get();
          if (currentState.currentMoveIndex === moveIndex) {
            set({ variationAnalysis: variationResult });
            if (playingAI && moveObj.color === playerColor && variationResult.classification) {
              const msg = getBotResponse(aiLevel, variationResult.classification, false);
              set({ botMessage: { text: msg, type: 'trash' } });
              setTimeout(() => set({ botMessage: null }), 5000);
            }
          }
        })
        .catch(err => {
          console.warn("Instant analysis failed", err);
        });

      if (result && !get().analysisResult && !get().isAnalyzing) {
        setTimeout(() => get().runGameReview(), 1000);
      }

      if (soundEnabled) {
        playMoveAudio(moveObj, newGame);
      }

      // Check opening name
      const { getOpeningName } = require('./openings');
      const opName = getOpeningName(newFen);
      if (opName) set({ openingName: opName });

      if (playingAI && !result && newGame.turn() !== playerColor) {
        setTimeout(() => {
          const state = get();
          if (!state.playingAI || state.gameResult) return;

          const aiEng = new Engine();
          aiEng.waitUntilReady().then(() => {
            if (aiLevel.elo < 3200) {
              aiEng.setOption('UCI_LimitStrength', 'true');
              aiEng.setOption('UCI_Elo', aiLevel.elo.toString());
            } else {
              aiEng.setOption('UCI_LimitStrength', 'false');
            }
            
            if (aiLevel.style === 'aggressive') {
              aiEng.setConfig({ multiPv: 3 });
            } else {
              aiEng.setConfig({ multiPv: 1 });
            }

            aiEng.onBestMove((bestMove: string) => {
              const currentState = get();
              if (!currentState.playingAI) { aiEng.destroy(); return; }
              const from = bestMove.substring(0, 2);
              const to = bestMove.substring(2, 4);
              const promotion = bestMove.length > 4 ? bestMove[4] : undefined;
              aiEng.destroy();
              get().makeMove({ from, to, promotion });
            });

            let moveTime = 1000;
            if (aiLevel.elo <= 600) moveTime = 300;
            else if (aiLevel.elo <= 1200) moveTime = 600;
            else if (aiLevel.elo >= 2500) moveTime = 2000;

            aiEng.evaluateWithMoveTime(state.fen, moveTime);
          });
        }, 300);
      }

      // Handle premove execution after a short delay
      const nextState = get();
      if (nextState.premovesEnabled && nextState.premove && nextState.game.turn() === nextState.playerColor && !result) {
        const pm = nextState.premove;
        // Check if the premove is legal in the NEW position
        const legalMoves = newGame.moves({ verbose: true });
        const isLegal = legalMoves.some(m => 
          m.from === pm.from && 
          m.to === pm.to && 
          (!pm.promotion || m.promotion === pm.promotion)
        );
        
        if (isLegal) {
          setTimeout(() => {
            // Re-verify it's still our turn and no result before executing
            const latestState = get();
            if (latestState.game.turn() === latestState.playerColor && !latestState.gameResult) {
              set({ premove: null });
              get().makeMove(pm);
            }
          }, 200);
        } else {
          set({ premove: null });
        }
      }

      return true;
    } catch (e) {
      console.warn("Invalid move", move, e);
      return false;
    }
  },

  goToMove: (index) => {
    const { history } = get();
    if (index < -1 || index >= history.length) return;

    const newGame = new Chess();
    for (let i = 0; i <= index; i++) {
      newGame.move(history[i].san);
    }

    const newFen = newGame.fen();
    set({
      game: newGame,
      fen: newFen,
      currentMoveIndex: index,
      engineLines: [],
      showHint: false,
      hintMove: null,
      selectedSquare: null,
      legalMovesForSelected: [],
      variationAnalysis: null,
      userArrows: [],
      userSquares: {},
    });

    const { analysisResult } = get();
    if (index >= 0 && (!analysisResult || index >= analysisResult.evals.length)) {
      analyzeInstantMove(newFen, newFen, history[index], index, 0)
        .then(result => {
          if (get().currentMoveIndex === index) {
            set({ variationAnalysis: result });
          }
        });
    }
  },

  goBack: () => {
    const { currentMoveIndex } = get();
    get().goToMove(currentMoveIndex - 1);
  },

  goForward: () => {
    const { currentMoveIndex } = get();
    get().goToMove(currentMoveIndex + 1);
  },

  restoreMainLine: () => {
    const { mainLineHistory, mainLineAnalysisResult } = get();
    if (!mainLineHistory) return;

    const newGame = new Chess();
    for (const move of mainLineHistory) {
      newGame.move(move.san);
    }

    set({
      game: newGame,
      fen: newGame.fen(),
      history: mainLineHistory,
      currentMoveIndex: mainLineHistory.length - 1,
      mainLineHistory: null,
      mainLineAnalysisResult: null,
      analysisResult: mainLineAnalysisResult,
      engineLines: [],
      variationAnalysis: null,
      userArrows: [],
      userSquares: {},
    });
  },

  loadPgn: (pgn) => {
    try {
      const newGame = new Chess();
      newGame.loadPgn(pgn);
      const history = newGame.history({ verbose: true });

      set({
        game: newGame,
        fen: newGame.fen(),
        history,
        currentMoveIndex: history.length - 1,
        engineLines: [],
        analysisResult: null,
        gameResult: null,
        playingAI: false,
        variationAnalysis: null,
        selectedSquare: null,
        legalMovesForSelected: [],
        userArrows: [],
        userSquares: {},
      });

      if (history.length > 0) {
        setTimeout(() => get().runGameReview(), 300);
      }
    } catch (e) {
      console.error("Failed to load PGN", e);
    }
  },

  loadFen: (fen) => {
    try {
      const newGame = new Chess(fen);
      set({
        game: newGame,
        fen: newGame.fen(),
        history: [],
        currentMoveIndex: -1,
        engineLines: [],
        analysisResult: null,
        gameResult: null,
        playingAI: false,
        variationAnalysis: null,
        selectedSquare: null,
        legalMovesForSelected: [],
        userArrows: [],
        userSquares: {},
      });
    } catch (e) {
      console.error("Failed to load FEN", e);
    }
  },

  resetGame: () => {
    const newGame = new Chess();
    set({
      game: newGame,
      fen: newGame.fen(),
      history: [],
      currentMoveIndex: -1,
      engineLines: [],
      analysisResult: null,
      gameResult: null,
      playingAI: false,
      showHint: false,
      hintMove: null,
      variationAnalysis: null,
      selectedSquare: null,
      legalMovesForSelected: [],
      userArrows: [],
      userSquares: {},
    });
  },

  saveGame: (data: GameData) => {
    const games = [...get().savedGames, data];
    set({ savedGames: games });
    if (typeof window !== "undefined") {
      localStorage.setItem('saved_chess_games', JSON.stringify(games));
    }
  },

  loadSavedGames: () => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem('saved_chess_games');
      if (saved) {
        set({ savedGames: JSON.parse(saved) });
      }

      const savedThemeId = localStorage.getItem('chess_board_theme');
      if (savedThemeId) {
        const theme = BOARD_THEMES.find(t => t.id === savedThemeId);
        if (theme) set({ boardTheme: theme });
      }

      const savedSound = localStorage.getItem('chess_sound_enabled');
      if (savedSound !== null) {
        set({ soundEnabled: savedSound === 'true' });
      }

      const savedDepth = localStorage.getItem('chess_analysis_depth');
      if (savedDepth) {
        set({ analysisDepth: parseInt(savedDepth, 10) });
      }

      const savedPremoves = localStorage.getItem('chess_premoves_enabled');
      if (savedPremoves !== null) {
        set({ premovesEnabled: savedPremoves === 'true' });
      }
    }
  },

  runGameReview: async () => {
    const { game, analysisDepth } = get();
    const pgn = game.pgn();
    if (!pgn) return;

    set({ isAnalyzing: true, analysisProgress: 0, analysisResult: null });

    try {
      const result = await analyzeGameFull(pgn, analysisDepth, (progress) => {
        set({ analysisProgress: Math.round(progress * 100) });
      });
      set({ analysisResult: result, isAnalyzing: false });

      const headers = game.header();
      const whiteName = headers.White && headers.White !== '?' ? headers.White : 'White';
      const blackName = headers.Black && headers.Black !== '?' ? headers.Black : 'Black';
      const gameResult = headers.Result || '*';
      saveGameToHistory({
        id: generateGameId(),
        pgn,
        white: whiteName,
        black: blackName,
        result: gameResult,
        date: headers.Date || new Date().toISOString().split('T')[0],
        analyzedAt: Date.now(),
        totalMoves: get().history.length,
        accuracy: result.accuracy,
        analysisResult: result,
      });
    } catch (e) {
      console.error("Game review failed", e);
      set({ isAnalyzing: false });
    }
  },

  setBoardTheme: (theme: BoardTheme) => {
    set({ boardTheme: theme });
    if (typeof window !== "undefined") {
      localStorage.setItem('chess_board_theme', theme.id);
    }
  },

  flipBoard: () => {
    set((state) => ({ boardFlipped: !state.boardFlipped }));
  },

  toggleSound: () => {
    const newVal = !get().soundEnabled;
    set({ soundEnabled: newVal });
    if (typeof window !== "undefined") {
      localStorage.setItem('chess_sound_enabled', String(newVal));
    }
  },

  showHintMove: () => {
    const { analysisResult, currentMoveIndex } = get();
    if (analysisResult) {
      const nextIndex = currentMoveIndex + 1;
      if (nextIndex < analysisResult.moveAnalyses.length) {
        const bestMove = analysisResult.moveAnalyses[nextIndex].bestMove;
        if (bestMove && bestMove !== '(none)') {
          set({ showHint: true, hintMove: bestMove });
        }
      }
    }
  },

  hideHint: () => {
    set({ showHint: false, hintMove: null });
  },

  setAnalysisDepth: (depth: number) => {
    set({ analysisDepth: depth });
    if (typeof window !== "undefined") {
      localStorage.setItem('chess_analysis_depth', String(depth));
    }
  },

  setEngineConfig: (config: Partial<EngineConfig>) => {
    const { engineConfig } = get();
    const newConfig = { ...engineConfig, ...config };
    set({ engineConfig: newConfig });
  },

  selectSquare: (square: string | null) => {
    if (!square) {
      set({ selectedSquare: null, legalMovesForSelected: [] });
      return;
    }

    const { selectedSquare, game } = get();
    const sq = square as import('chess.js').Square;

    if (selectedSquare) {
      const prevSq = selectedSquare as import('chess.js').Square;
      const piece = game.get(prevSq);
      const isPromotion = piece && (piece.type === 'p') &&
        (square[1] === '8' || square[1] === '1');
      const success = get().makeMove({
        from: selectedSquare,
        to: square,
        promotion: isPromotion ? 'q' : undefined,
      });
      if (success) return;
    }

    const piece = game.get(sq);
    if (piece && piece.color === game.turn()) {
      const moves = game.moves({ square: sq, verbose: true });
      set({
        selectedSquare: square,
        legalMovesForSelected: moves.map(m => m.to),
      });
    } else {
      set({ selectedSquare: null, legalMovesForSelected: [] });
    }
  },

  toggleZenMode: () => set((state) => ({ zenMode: !state.zenMode })),
  setBotMessage: (msg) => set({ botMessage: msg }),
  setExplainWhyLine: (line) => set({ explainWhyLine: line }),
  setOpeningName: (name) => set({ openingName: name }),

  startAIGame: (level, color) => {
    const newGame = new Chess();
    newGame.header('White', color === 'w' ? 'You' : level.name);
    newGame.header('Black', color === 'b' ? 'You' : level.name);
    newGame.header('Date', new Date().toISOString().split('T')[0]);
    
    set({
      game: newGame,
      fen: newGame.fen(),
      history: [],
      currentMoveIndex: -1,
      engineLines: [],
      analysisResult: null,
      playingAI: true,
      aiLevel: level,
      playerColor: color,
      gameResult: null,
      boardFlipped: color === 'b',
      variationAnalysis: null,
    });

    if (color === 'b') {
      setTimeout(() => {
        const state = get();
        if (!state.playingAI) return;
        const aiEng = new Engine();
        aiEng.waitUntilReady().then(() => {
          if (level.elo < 3200) {
            aiEng.setOption('UCI_LimitStrength', 'true');
            aiEng.setOption('UCI_Elo', level.elo.toString());
          } else {
            aiEng.setOption('UCI_LimitStrength', 'false');
          }
          if (level.style === 'aggressive') aiEng.setConfig({ multiPv: 3 });
          else aiEng.setConfig({ multiPv: 1 });

          aiEng.onBestMove((bestMove: string) => {
            const currentState = get();
            if (!currentState.playingAI) { aiEng.destroy(); return; }
            const from = bestMove.substring(0, 2);
            const to = bestMove.substring(2, 4);
            const promotion = bestMove.length > 4 ? bestMove[4] : undefined;
            aiEng.destroy();
            get().makeMove({ from, to, promotion });
          });

          let moveTime = 1000;
          if (level.elo <= 600) moveTime = 300;
          else if (level.elo <= 1200) moveTime = 600;
          else if (level.elo >= 2500) moveTime = 2000;
          aiEng.evaluateWithMoveTime(state.fen, moveTime);
        });
      }, 500);
    }
  },

  stopAIGame: () => set({ playingAI: false, gameResult: null }),
  resignGame: () => {
    const { playerColor, soundEnabled } = get();
    const result = playerColor === 'w' ? '0-1' : '1-0';
    set({ gameResult: result, playingAI: false });
    if (soundEnabled) playGameEndSound();
    setTimeout(() => get().runGameReview(), 1000);
  },
}));
