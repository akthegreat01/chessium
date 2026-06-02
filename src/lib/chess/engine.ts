'use client';

import type { EvalData } from '@/types/chess';

// ─── Types ──────────────────────────────────────────────────────────────────

export interface AnalysisRequest {
  fen: string;
  depth: number;
  multiPv?: number;
}

interface QueuedRequest {
  request: AnalysisRequest;
  resolve: (result: AnalysisResult) => void;
  reject: (error: Error) => void;
}

export interface AnalysisResult {
  bestMove: string;
  ponder?: string;
  evaluation: EvalData;
  lines: EvalData[];
}

type EngineState = 'uninitialized' | 'initializing' | 'ready' | 'analyzing' | 'terminated';

// ─── Stockfish Engine Class ─────────────────────────────────────────────────

export class StockfishEngine {
  private worker: Worker | null = null;
  private state: EngineState = 'uninitialized';
  private queue: QueuedRequest[] = [];
  private currentResolve: ((result: AnalysisResult) => void) | null = null;
  private currentReject: ((error: Error) => void) | null = null;
  private initResolve: (() => void) | null = null;
  private initReject: ((error: Error) => void) | null = null;

  // Accumulated analysis data for the current request
  private currentLines: Map<number, EvalData> = new Map();
  private currentBestDepth = 0;
  private requestedMultiPv = 1;

  // Engine path
  private readonly enginePath: string;

  constructor(enginePath = '/stockfish/stockfish-16.1-lite-single.js') {
    this.enginePath = enginePath;
  }

  // ─── Lifecycle ──────────────────────────────────────────────────────────

  async init(): Promise<void> {
    if (this.state === 'ready' || this.state === 'analyzing') {
      return;
    }

    if (this.state === 'initializing') {
      return new Promise<void>((resolve, reject) => {
        const prevResolve = this.initResolve;
        const prevReject = this.initReject;
        this.initResolve = () => {
          prevResolve?.();
          resolve();
        };
        this.initReject = (err) => {
          prevReject?.(err);
          reject(err);
        };
      });
    }

    this.state = 'initializing';

    return new Promise<void>((resolve, reject) => {
      this.initResolve = resolve;
      this.initReject = reject;

      try {
        this.worker = new Worker(this.enginePath);
        this.worker.onmessage = this.handleMessage.bind(this);
        this.worker.onerror = (e) => {
          const error = new Error(`Stockfish worker error: ${e.message}`);
          if (this.state === 'initializing') {
            this.state = 'uninitialized';
            this.initReject?.(error);
            this.initResolve = null;
            this.initReject = null;
          } else {
            this.currentReject?.(error);
            this.currentResolve = null;
            this.currentReject = null;
          }
        };

        this.sendCommand('uci');
      } catch (err) {
        this.state = 'uninitialized';
        reject(err instanceof Error ? err : new Error(String(err)));
      }
    });
  }

  terminate(): void {
    if (this.worker) {
      this.sendCommand('quit');
      this.worker.terminate();
      this.worker = null;
    }

    // Reject any pending requests
    this.currentReject?.(new Error('Engine terminated'));
    this.currentResolve = null;
    this.currentReject = null;

    for (const queued of this.queue) {
      queued.reject(new Error('Engine terminated'));
    }
    this.queue = [];

    this.state = 'terminated';
  }

  getState(): EngineState {
    return this.state;
  }

  // ─── Commands ───────────────────────────────────────────────────────────

  private sendCommand(cmd: string): void {
    this.worker?.postMessage(cmd);
  }

  /** Set a UCI option */
  setOption(name: string, value: string | number | boolean): void {
    this.sendCommand(`setoption name ${name} value ${value}`);
  }

  /** Send a new game signal */
  newGame(): void {
    this.sendCommand('ucinewgame');
  }

  /** Stop the current search */
  stop(): void {
    this.sendCommand('stop');
  }

  // ─── Analysis ───────────────────────────────────────────────────────────

  async analyze(request: AnalysisRequest): Promise<AnalysisResult> {
    if (this.state === 'terminated') {
      throw new Error('Engine has been terminated');
    }

    if (this.state === 'uninitialized') {
      await this.init();
    }

    return new Promise<AnalysisResult>((resolve, reject) => {
      this.queue.push({ request, resolve, reject });
      this.processQueue();
    });
  }

  private processQueue(): void {
    if (this.state !== 'ready' || this.queue.length === 0) {
      return;
    }

    const next = this.queue.shift()!;
    this.state = 'analyzing';
    this.currentResolve = next.resolve;
    this.currentReject = next.reject;
    this.currentLines.clear();
    this.currentBestDepth = 0;
    this.requestedMultiPv = next.request.multiPv ?? 1;

    if (this.requestedMultiPv > 1) {
      this.setOption('MultiPV', this.requestedMultiPv);
    }

    this.sendCommand(`position fen ${next.request.fen}`);
    this.sendCommand('isready');
    // The actual "go" command is sent after "readyok" in handleMessage
    this.pendingGoDepth = next.request.depth;
  }

  private pendingGoDepth = 0;

  // ─── Message Parsing ───────────────────────────────────────────────────

  private handleMessage(event: MessageEvent): void {
    const line: string = typeof event.data === 'string' ? event.data : String(event.data);

    // UCI initialization
    if (line === 'uciok') {
      this.sendCommand('isready');
      return;
    }

    // Engine ready
    if (line === 'readyok') {
      if (this.state === 'initializing') {
        this.state = 'ready';
        this.initResolve?.();
        this.initResolve = null;
        this.initReject = null;
        this.processQueue();
      } else if (this.state === 'analyzing' && this.pendingGoDepth > 0) {
        this.sendCommand(`go depth ${this.pendingGoDepth}`);
        this.pendingGoDepth = 0;
      }
      return;
    }

    // Info lines (intermediate analysis)
    if (line.startsWith('info') && line.includes('score')) {
      this.parseInfoLine(line);
      return;
    }

    // Best move result
    if (line.startsWith('bestmove')) {
      this.handleBestMove(line);
      return;
    }
  }

  private parseInfoLine(line: string): void {
    const depth = this.extractInt(line, 'depth');
    const multiPvIndex = this.extractInt(line, 'multipv') ?? 1;
    const nodes = this.extractInt(line, 'nodes');
    const time = this.extractInt(line, 'time');

    // Parse score
    let cp = 0;
    let mate: number | null = null;

    const scoreCpMatch = line.match(/score cp (-?\d+)/);
    const scoreMateMatch = line.match(/score mate (-?\d+)/);

    if (scoreMateMatch) {
      mate = parseInt(scoreMateMatch[1], 10);
      // Convert mate to large cp for ordering
      cp = mate > 0 ? 100000 - mate * 100 : -100000 - mate * 100;
    } else if (scoreCpMatch) {
      cp = parseInt(scoreCpMatch[1], 10);
    }

    // Parse PV
    const pvMatch = line.match(/ pv (.+)$/);
    const pv = pvMatch ? pvMatch[1].split(' ') : [];

    if (depth !== null && depth >= this.currentBestDepth) {
      this.currentBestDepth = depth;
    }

    const evalData: EvalData = {
      cp,
      mate,
      depth: depth ?? 0,
      pv,
      nodes: nodes ?? undefined,
      time: time ?? undefined,
    };

    this.currentLines.set(multiPvIndex, evalData);
  }

  private handleBestMove(line: string): void {
    const parts = line.split(' ');
    const bestMove = parts[1] ?? '';
    const ponder = parts[3]; // "bestmove e2e4 ponder e7e5"

    // Build the result from accumulated lines
    const linesSorted: EvalData[] = [];
    for (let i = 1; i <= this.requestedMultiPv; i++) {
      const lineData = this.currentLines.get(i);
      if (lineData) {
        linesSorted.push(lineData);
      }
    }

    const bestLine = linesSorted[0] ?? {
      cp: 0,
      mate: null,
      depth: 0,
      pv: [bestMove],
    };

    const result: AnalysisResult = {
      bestMove,
      ponder,
      evaluation: bestLine,
      lines: linesSorted,
    };

    // Reset multi PV if it was changed
    if (this.requestedMultiPv > 1) {
      this.setOption('MultiPV', 1);
    }

    this.state = 'ready';
    const resolve = this.currentResolve;
    this.currentResolve = null;
    this.currentReject = null;
    this.currentLines.clear();
    this.currentBestDepth = 0;

    resolve?.(result);

    // Process next in queue
    this.processQueue();
  }

  // ─── Helpers ────────────────────────────────────────────────────────────

  private extractInt(line: string, key: string): number | null {
    const regex = new RegExp(`\\b${key} (\\d+)`);
    const match = line.match(regex);
    return match ? parseInt(match[1], 10) : null;
  }
}

// ─── Singleton helper ───────────────────────────────────────────────────────

let engineInstance: StockfishEngine | null = null;

export function getEngine(): StockfishEngine {
  if (!engineInstance) {
    engineInstance = new StockfishEngine();
  }
  return engineInstance;
}

export function destroyEngine(): void {
  if (engineInstance) {
    engineInstance.terminate();
    engineInstance = null;
  }
}
