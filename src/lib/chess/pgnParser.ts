import { Chess } from 'chess.js';

/**
 * Aggressively sanitizes a PGN string by stripping clocks, evaluations, 
 * comments, and other metadata that can crash chess.js.
 */
export function cleanPgnString(raw: string): string {
  return raw
    .replace(/\{[^}]*\}/g, '')       // Remove all {comments} including {[%clk ...]}
    .replace(/;[^\n]*/g, '')          // Remove semicolon comments
    .replace(/\d+\.{3}/g, '')         // Remove move-number ellipsis like "1..."
    .replace(/\$\d+/g, '')            // Remove NAGs (Numeric Annotation Glyphs) like $1
    .replace(/\s+/g, ' ')             // Collapse whitespace
    .trim();
}

/**
 * Robustly parses a PGN into a chess.js instance using a fallback tier system.
 * Returns the populated Chess instance if successful, or throws an error.
 */
export function robustLoadPgn(pgnData: string): Chess {
  const game = new Chess();

  // Tier 1: Try raw standard PGN
  try {
    game.loadPgn(pgnData);
    return game;
  } catch (e1) {
    // Tier 2: Try with cleaned PGN (strips inline annotations)
    try {
      game.loadPgn(cleanPgnString(pgnData));
      return game;
    } catch (e2) {
      // Tier 3: Absolute last resort - strip headers entirely and just try movetext
      try {
        const rawMoves = cleanPgnString(pgnData.replace(/\[.*?\]\s*/g, ''));
        game.loadPgn(rawMoves);
        return game;
      } catch (e3) {
        throw new Error("Failed to parse PGN even after aggressive sanitization.");
      }
    }
  }
}
