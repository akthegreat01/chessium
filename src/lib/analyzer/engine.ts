export interface EngineEvaluation {
  score: number; // in centipawns (positive is white advantage)
  mate: number | null; // mate in X moves (positive is white mating)
  depth: number;
  bestMove: string;
  pv: string; // principal variation
}

export type EvaluationCallback = (evalData: EngineEvaluation) => void;

export class ChessEngine {
  private worker: Worker | null = null;
  private currentCallback: EvaluationCallback | null = null;
  private currentEval: EngineEvaluation = { score: 0, mate: null, depth: 0, bestMove: "", pv: "" };
  private isAnalyzing = false;
  private isBlackTurn = false;
  
  init() {
    if (typeof window !== 'undefined' && !this.worker) {
      this.worker = new Worker('/stockfish/stockfish.js');
      this.worker.onmessage = this.onMessage.bind(this);
      this.worker.postMessage('uci');
      // Set optimized options for performance
      // Remove threads option to prevent crash with single-threaded WASM builds
      this.worker.postMessage('setoption name Hash value 128');
    }
  }

  private onMessage(event: MessageEvent) {
    const msg = event.data;

    if (msg.startsWith('info depth')) {
      // Parse depth
      const depthMatch = msg.match(/depth (\d+)/);
      if (depthMatch) this.currentEval.depth = parseInt(depthMatch[1], 10);

      // Parse score or mate
      if (msg.includes('score cp')) {
        const cpMatch = msg.match(/score cp (-?\d+)/);
        if (cpMatch) {
          const rawScore = parseInt(cpMatch[1], 10) / 100; // Convert centipawns to pawns
          this.currentEval.score = this.isBlackTurn ? -rawScore : rawScore;
          this.currentEval.mate = null;
        }
      } else if (msg.includes('score mate')) {
        const mateMatch = msg.match(/score mate (-?\d+)/);
        if (mateMatch) {
          const rawMate = parseInt(mateMatch[1], 10);
          this.currentEval.mate = this.isBlackTurn ? -rawMate : rawMate;
          // High score for mate
          this.currentEval.score = this.currentEval.mate > 0 ? 10000 : -10000;
        }
      }

      // Parse pv
      const pvMatch = msg.match(/ pv (.*)/);
      if (pvMatch) {
        this.currentEval.pv = pvMatch[1];
        this.currentEval.bestMove = pvMatch[1].split(' ')[0];
      }

      if (this.currentCallback) {
        this.currentCallback({ ...this.currentEval });
      }
    }
    
    if (msg.startsWith('bestmove')) {
      const match = msg.match(/bestmove (\S+)/);
      if (match) {
        this.currentEval.bestMove = match[1];
      }
      this.isAnalyzing = false;
      if (this.currentCallback) {
        this.currentCallback({ ...this.currentEval });
      }
    }
  }

  evaluatePosition(fen: string, depth: number, callback: EvaluationCallback) {
    this.init();
    if (!this.worker) return;
    
    this.stop();
    this.currentCallback = callback;
    this.currentEval = { score: 0, mate: null, depth: 0, bestMove: "", pv: "" };
    this.isAnalyzing = true;
    
    this.isBlackTurn = fen.split(' ')[1] === 'b';
    this.worker.postMessage('ucinewgame');
    this.worker.postMessage(`position fen ${fen}`);
    this.worker.postMessage(`go depth ${depth}`);
  }

  private resolveCurrentPromise: ((val: EngineEvaluation) => void) | null = null;
  private evalTimeout: NodeJS.Timeout | null = null;

  evaluatePositionAsync(fen: string, depth: number, timeoutMs: number = 30000): Promise<EngineEvaluation> {
    return new Promise((resolve) => {
      this.init();
      if (!this.worker) return resolve({ score: 0, mate: null, depth: 0, bestMove: "", pv: "" });
      
      // If there's an existing promise, resolve it so it doesn't hang forever
      if (this.resolveCurrentPromise) {
        this.resolveCurrentPromise(this.currentEval);
      }
      
      this.stop();
      this.currentEval = { score: 0, mate: null, depth: 0, bestMove: "", pv: "" };
      this.isAnalyzing = true;
      this.resolveCurrentPromise = resolve;
      
      if (this.evalTimeout) clearTimeout(this.evalTimeout);
      this.evalTimeout = setTimeout(() => {
        if (this.isAnalyzing) {
          this.isAnalyzing = false;
          if (this.resolveCurrentPromise) {
            this.resolveCurrentPromise(this.currentEval);
            this.resolveCurrentPromise = null;
          }
        }
      }, timeoutMs);
      
      this.currentCallback = (data) => {
        if (!this.isAnalyzing) {
          if (this.evalTimeout) clearTimeout(this.evalTimeout);
          if (this.resolveCurrentPromise) {
            this.resolveCurrentPromise(data);
            this.resolveCurrentPromise = null;
          }
        }
      };

      this.isBlackTurn = fen.split(' ')[1] === 'b';
      this.worker.postMessage('ucinewgame');
      this.worker.postMessage(`position fen ${fen}`);
      this.worker.postMessage(`go depth ${depth}`);
    });
  }

  stop() {
    if (this.worker && this.isAnalyzing) {
      this.worker.postMessage('stop');
      this.isAnalyzing = false;
    }
    if (this.evalTimeout) clearTimeout(this.evalTimeout);
  }

  terminate() {
    this.stop();
    if (this.resolveCurrentPromise) {
      this.resolveCurrentPromise(this.currentEval);
      this.resolveCurrentPromise = null;
    }
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
  }
}
