/**
 * Persistent Position Evaluation Cache
 * 
 * Stores FEN → evaluation mappings in localStorage.
 * The system "learns" with every analysis: positions that have been evaluated
 * before are instantly recalled, making repeated analyses dramatically faster.
 * 
 * Uses a simplified FEN key (without move counters) to maximize cache hits
 * across different game contexts.
 */

export interface CachedEval {
  score: number;      // centipawns from side-to-move perspective
  mate: number | null;
  bestMove: string;   // UCI
  pv: string;         // principal variation (UCI)
  depth: number;      // depth this was evaluated at
  ts: number;         // timestamp for LRU eviction
}

const CACHE_KEY = 'aura_position_cache';
const MAX_CACHE_SIZE = 15000; // max positions to store
const EVICT_BATCH = 2000;     // evict this many when full

// Normalize FEN: strip halfmove clock and fullmove number for better cache hits
// "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
// becomes "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq -"
function normalizeFen(fen: string): string {
  const parts = fen.split(' ');
  return parts.slice(0, 4).join(' ');
}

class PositionCache {
  private cache: Map<string, CachedEval>;
  private loaded = false;

  constructor() {
    this.cache = new Map();
  }

  private load() {
    if (this.loaded) return;
    this.loaded = true;
    if (typeof window === 'undefined') return;
    try {
      const raw = localStorage.getItem(CACHE_KEY);
      if (raw) {
        const entries: [string, CachedEval][] = JSON.parse(raw);
        this.cache = new Map(entries);
      }
    } catch {
      this.cache = new Map();
    }
  }

  private save() {
    if (typeof window === 'undefined') return;
    try {
      const entries = Array.from(this.cache.entries());
      localStorage.setItem(CACHE_KEY, JSON.stringify(entries));
    } catch {
      // localStorage full - evict aggressively
      this.evict(EVICT_BATCH * 2);
      try {
        const entries = Array.from(this.cache.entries());
        localStorage.setItem(CACHE_KEY, JSON.stringify(entries));
      } catch { /* give up */ }
    }
  }

  private evict(count: number) {
    // LRU eviction: remove oldest entries by timestamp
    const entries = Array.from(this.cache.entries());
    entries.sort((a, b) => a[1].ts - b[1].ts);
    const toRemove = entries.slice(0, count);
    for (const [key] of toRemove) {
      this.cache.delete(key);
    }
  }

  /**
   * Look up a cached eval. Returns the cached result if the position
   * was previously evaluated at a depth >= minDepth.
   */
  get(fen: string, minDepth: number = 8): CachedEval | null {
    this.load();
    const key = normalizeFen(fen);
    const entry = this.cache.get(key);
    if (entry && entry.depth >= minDepth) {
      // Update timestamp for LRU
      entry.ts = Date.now();
      return entry;
    }
    return null;
  }

  /**
   * Store an evaluation. Only overwrites if the new eval is deeper.
   */
  set(fen: string, eval_: CachedEval) {
    this.load();
    const key = normalizeFen(fen);
    const existing = this.cache.get(key);
    if (existing && existing.depth >= eval_.depth) return; // don't downgrade

    this.cache.set(key, { ...eval_, ts: Date.now() });

    // Evict if too large
    if (this.cache.size > MAX_CACHE_SIZE) {
      this.evict(EVICT_BATCH);
    }
  }

  /**
   * Persist to localStorage. Call this at the end of an analysis session.
   */
  persist() {
    this.save();
  }

  /**
   * Get cache stats
   */
  stats(): { size: number; maxSize: number } {
    this.load();
    return { size: this.cache.size, maxSize: MAX_CACHE_SIZE };
  }

  /**
   * Clear the entire cache
   */
  clear() {
    this.cache = new Map();
    if (typeof window !== 'undefined') {
      localStorage.removeItem(CACHE_KEY);
    }
  }
}

// Singleton instance
export const positionCache = new PositionCache();
