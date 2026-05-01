/**
 * Game History System
 * 
 * Stores analyzed games in localStorage with full metadata and analysis results.
 * Allows users to revisit past analyses instantly.
 */

import { AnalysisResult } from './analyzer';

export interface GameHistoryEntry {
  id: string;
  pgn: string;
  white: string;
  black: string;
  result: string;
  date: string;
  analyzedAt: number; // timestamp
  totalMoves: number;
  accuracy: { white: number; black: number };
  // We store the full analysis so it can be loaded instantly
  analysisResult: AnalysisResult;
}

const HISTORY_KEY = 'aura_game_history';
const MAX_HISTORY = 30; // max games to keep

export function loadGameHistory(): GameHistoryEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch { /* corrupted */ }
  return [];
}

export function saveGameToHistory(entry: GameHistoryEntry) {
  if (typeof window === 'undefined') return;
  const history = loadGameHistory();

  // Don't duplicate: remove any existing entry with the same PGN
  const filtered = history.filter(h => h.pgn !== entry.pgn);
  filtered.unshift(entry); // add to beginning (most recent)

  // Trim to max
  const trimmed = filtered.slice(0, MAX_HISTORY);

  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmed));
  } catch {
    // localStorage full - keep fewer
    const small = trimmed.slice(0, 10);
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(small));
    } catch { /* give up */ }
  }
}

export function deleteGameFromHistory(id: string) {
  if (typeof window === 'undefined') return;
  const history = loadGameHistory();
  const filtered = history.filter(h => h.id !== id);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(filtered));
}

export function clearGameHistory() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(HISTORY_KEY);
}

export function generateGameId(): string {
  return `game_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
}
