export type EngineLine = {
  depth: number;
  score: number; // centipawns or mate (if mate, usually a special format)
  mate: number | null;
  pv: string; // space separated moves like "e2e4 e7e5"
  nodes?: number;
  nps?: number;
  time?: number;
};

export type EngineConfig = {
  depth: number;
  multiPv: number;
  threads: number;
  hash: number;
  skillLevel?: number; // 0-20 for AI play
};

// Use up to 4 threads (leaving some for the browser) if SharedArrayBuffer is supported (required for WASM threads)
const availableThreads = typeof navigator !== 'undefined' && typeof SharedArrayBuffer !== 'undefined'
  ? Math.max(1, Math.min(4, Math.floor((navigator.hardwareConcurrency || 2) / 2)))
  : 1;

const DEFAULT_CONFIG: EngineConfig = {
  depth: 20,
  multiPv: 3,
  threads: availableThreads,
  hash: 64, // Increased from 16 to 64 for faster deep search
};

export class Engine {
  private worker: Worker | null = null;
  private isReady = false;
  private onEvalCallback: ((score: number, mate: number | null, depth: number) => void) | null = null;
  private onLinesCallback: ((lines: EngineLine[]) => void) | null = null;
  private onBestMoveCallback: ((bestMove: string, ponder?: string) => void) | null = null;
  private onReadyCallback: (() => void) | null = null;
  private lines: Record<number, EngineLine> = {}; // MultiPv lines
  private config: EngineConfig = { ...DEFAULT_CONFIG };
  private searching = false;
  private readyPromiseResolve: (() => void) | null = null;
  private readyPromise: Promise<void>;

  constructor() {
    this.readyPromise = new Promise((resolve) => {
      this.readyPromiseResolve = resolve;
    });

    if (typeof window !== "undefined") {
      try {
        this.worker = new Worker("/stockfish.js");
        this.worker.onmessage = this.handleMessage.bind(this);
        this.worker.postMessage("uci");
      } catch (e) {
        console.error("Failed to initialize Stockfish worker", e);
      }
    }
  }

  private handleMessage(e: MessageEvent) {
    const line = e.data;
    
    if (line === "uciok") {
      this.isReady = true;
      this.worker?.postMessage(`setoption name Threads value ${this.config.threads}`);
      this.worker?.postMessage(`setoption name MultiPV value ${this.config.multiPv}`);
      this.worker?.postMessage(`setoption name Hash value ${this.config.hash}`);
      this.worker?.postMessage("isready");
    }

    if (line === "readyok") {
      if (this.readyPromiseResolve) {
        this.readyPromiseResolve();
        this.readyPromiseResolve = null;
      }
      if (this.onReadyCallback) {
        this.onReadyCallback();
      }
    }

    if (line.startsWith("info depth")) {
      this.parseInfo(line);
    }

    if (line.startsWith("bestmove")) {
      this.searching = false;
      const parts = line.split(' ');
      const bestMove = parts[1] || '';
      const ponder = parts[3]; // "ponder e7e5" format
      if (this.onBestMoveCallback) {
        this.onBestMoveCallback(bestMove, ponder);
      }
    }
  }

  private lastUpdate = 0;

  public setOption(name: string, value: string) {
    if (this.worker) {
      this.worker.postMessage(`setoption name ${name} value ${value}`);
    }
  }

  private parseInfo(line: string) {
    const depthMatch = line.match(/depth (\d+)/);
    const scoreMatch = line.match(/score cp (-?\d+)/);
    const mateMatch = line.match(/score mate (-?\d+)/);
    const pvMatch = line.match(/pv (.+)/);
    const multiPvMatch = line.match(/multipv (\d+)/);
    const nodesMatch = line.match(/nodes (\d+)/);
    const npsMatch = line.match(/nps (\d+)/);
    const timeMatch = line.match(/time (\d+)/);

    if (depthMatch && pvMatch && (scoreMatch || mateMatch)) {
      const depth = parseInt(depthMatch[1], 10);
      const multiPv = multiPvMatch ? parseInt(multiPvMatch[1], 10) : 1;
      const pv = pvMatch[1];
      const score = scoreMatch ? parseInt(scoreMatch[1], 10) : 0;
      const mate = mateMatch ? parseInt(mateMatch[1], 10) : null;
      const nodes = nodesMatch ? parseInt(nodesMatch[1], 10) : undefined;
      const nps = npsMatch ? parseInt(npsMatch[1], 10) : undefined;
      const time = timeMatch ? parseInt(timeMatch[1], 10) : undefined;

      this.lines[multiPv] = { depth, score, mate, pv, nodes, nps, time };

      const now = typeof performance !== 'undefined' ? performance.now() : Date.now();
      
      // Throttle updates to ~10fps to prevent massive React UI lag
      // Also ignore very low depth scores (depth < 4) to prevent the eval bar from going "crazy" 
      // with wildly inaccurate initial centipawn calculations
      if (now - this.lastUpdate > 100 || depth >= this.config.depth) {
        this.lastUpdate = now;
        
        if (multiPv === 1 && this.onEvalCallback && (depth >= 4 || mate !== null)) {
          this.onEvalCallback(score, mate, depth);
        }

        if (this.onLinesCallback) {
          const linesArray = Object.keys(this.lines)
            .map((k) => this.lines[parseInt(k, 10)])
            .sort((a, b) => {
               if (a.mate !== null && b.mate !== null) {
                 if (a.mate > 0 && b.mate > 0) return a.mate - b.mate;
                 if (a.mate < 0 && b.mate < 0) return b.mate - a.mate;
                 return b.mate - a.mate;
               }
               if (a.mate !== null) return a.mate > 0 ? -1 : 1;
               if (b.mate !== null) return b.mate > 0 ? 1 : -1;
               return b.score - a.score;
            });
          this.onLinesCallback(linesArray);
        }
      }
    }
  }

  public async waitUntilReady(): Promise<void> {
    return this.readyPromise;
  }

  public setConfig(config: Partial<EngineConfig>) {
    this.config = { ...this.config, ...config };
    
    if (this.isReady) {
      if (config.threads !== undefined) {
        this.worker?.postMessage(`setoption name Threads value ${config.threads}`);
      }
      if (config.multiPv !== undefined) {
        this.worker?.postMessage(`setoption name MultiPV value ${config.multiPv}`);
      }
      if (config.hash !== undefined) {
        this.worker?.postMessage(`setoption name Hash value ${config.hash}`);
      }
      if (config.skillLevel !== undefined) {
        this.worker?.postMessage(`setoption name Skill Level value ${config.skillLevel}`);
      }
    }
  }

  public setOptions(options: Record<string, string | number>) {
    for (const [key, value] of Object.entries(options)) {
      this.worker?.postMessage(`setoption name ${key} value ${value}`);
    }
  }

  public evaluatePosition(fen: string, depth?: number) {
    this.lines = {};
    this.searching = true;
    this.worker?.postMessage("stop");
    this.worker?.postMessage(`position fen ${fen}`);
    this.worker?.postMessage(`go depth ${depth ?? this.config.depth}`);
  }

  public evaluateWithMoveTime(fen: string, moveTimeMs: number) {
    this.lines = {};
    this.searching = true;
    this.worker?.postMessage("stop");
    this.worker?.postMessage(`position fen ${fen}`);
    this.worker?.postMessage(`go movetime ${moveTimeMs}`);
  }

  public stop() {
    this.searching = false;
    this.worker?.postMessage("stop");
  }

  public newGame() {
    this.worker?.postMessage("ucinewgame");
    this.worker?.postMessage("isready");
  }

  public isSearching() {
    return this.searching;
  }

  public getConfig() {
    return { ...this.config };
  }

  public onEval(cb: (score: number, mate: number | null, depth: number) => void) {
    this.onEvalCallback = cb;
  }

  public onLines(cb: (lines: EngineLine[]) => void) {
    this.onLinesCallback = cb;
  }

  public onBestMove(cb: (bestMove: string, ponder?: string) => void) {
    this.onBestMoveCallback = cb;
  }

  public onReady(cb: () => void) {
    this.onReadyCallback = cb;
  }

  public destroy() {
    this.stop();
    this.worker?.terminate();
    this.worker = null;
  }
}
