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
  
  init() {
    if (typeof window !== 'undefined' && !this.worker) {
      this.worker = new Worker('/stockfish/stockfish.js');
      this.worker.onmessage = this.onMessage.bind(this);
      this.worker.postMessage('uci');
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
          this.currentEval.score = parseInt(cpMatch[1], 10);
          this.currentEval.mate = null;
        }
      } else if (msg.includes('score mate')) {
        const mateMatch = msg.match(/score mate (-?\d+)/);
        if (mateMatch) {
          this.currentEval.mate = parseInt(mateMatch[1], 10);
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
    
    this.worker.postMessage('ucinewgame');
    this.worker.postMessage(`position fen ${fen}`);
    this.worker.postMessage(`go depth ${depth}`);
  }

  stop() {
    if (this.worker && this.isAnalyzing) {
      this.worker.postMessage('stop');
      this.isAnalyzing = false;
    }
  }

  terminate() {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
  }
}
