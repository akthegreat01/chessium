export type MoveClassification = 
  | "Brilliant" 
  | "Great Move" 
  | "Best Move" 
  | "Excellent" 
  | "Good" 
  | "Book" 
  | "Inaccuracy" 
  | "Mistake" 
  | "Miss" 
  | "Blunder"
  | "Forced";

export function calculateWinProbability(pawns: number): number {
  // Win probability formula mapping pawns to a 0-100 win probability for White
  // Based on standard chess engine modeling
  return 50 + 50 * (2 / (1 + Math.exp(-0.368208 * pawns)) - 1);
}

// Engine scores are in centipawns. Positive is good for white.
// We must convert score relative to the player to move.
export function classifyMove(
  evalBefore: number, // CP, positive = white advantage
  evalAfter: number,  // CP, positive = white advantage
  turn: 'w' | 'b',
  isBestMove: boolean,
  isBook: boolean,
  isCapture: boolean
): MoveClassification {
  
  if (isBook) return "Book";

  const wpBefore = calculateWinProbability(evalBefore);
  const wpAfter = calculateWinProbability(evalAfter);
  
  // Calculate the drop in Win Probability for the player who moved
  const wpDrop = turn === 'w' ? wpBefore - wpAfter : wpAfter - wpBefore;

  // Best/Brilliant Logic
  if (isBestMove) {
    // If it's a capture that drops less than 2% WP but leaves the player highly winning, call it brilliant
    if (isCapture && wpDrop <= 2 && (turn === 'w' ? wpAfter > 80 : wpAfter < 20)) {
      return "Brilliant";
    }
    // A Great Move is a best move that was the ONLY move to prevent a massive drop (wpDrop would be > 20 for other moves)
    // Since we don't have the 2nd best move eval, we'll just restrict Great Move to rare engine cases or huge swings.
    // For now, default to Best Move.
    return "Best Move";
  }

  // Blunders are severe drops in win probability
  if (wpDrop >= 20) return "Blunder";

  // Mistakes are moderate drops
  if (wpDrop >= 10) return "Mistake";

  // Inaccuracies are minor drops
  if (wpDrop >= 5) return "Inaccuracy";

  // Small drops are still good/excellent
  if (wpDrop >= 2) return "Good";
  
  return "Excellent";
}

export function getClassificationColor(cls: MoveClassification): string {
  switch (cls) {
    case "Brilliant": return "text-[#1cb0f6] bg-[#1cb0f6]/10"; // Cyan/Blue
    case "Great Move": return "text-[#1cb0f6] bg-[#1cb0f6]/10";
    case "Best Move": return "text-success bg-success/10";
    case "Excellent": return "text-success/80 bg-success/10";
    case "Good": return "text-success/60 bg-success/10";
    case "Book": return "text-[#c3a47d] bg-[#c3a47d]/10";
    case "Inaccuracy": return "text-warning bg-warning/10"; // Yellow
    case "Mistake": return "text-orange-500 bg-orange-500/10";
    case "Miss": return "text-orange-500 bg-orange-500/10";
    case "Blunder": return "text-destructive bg-destructive/10"; // Red
    default: return "text-secondary-foreground bg-white/5";
  }
}

export function getClassificationExplanation(cls: MoveClassification): string {
  switch (cls) {
    case "Brilliant": return "A brilliant sacrifice or tactical sequence that the engine deeply approves of.";
    case "Great Move": return "An exceptionally strong move that significantly improves your position.";
    case "Best Move": return "The optimal move according to the engine.";
    case "Excellent": return "A very strong move, nearly as good as the best move.";
    case "Good": return "A solid move, though slightly sub-optimal.";
    case "Book": return "A standard opening move.";
    case "Inaccuracy": return "A slightly passive or sub-optimal move that gives up a small advantage.";
    case "Mistake": return "A poor move that significantly worsens your position.";
    case "Miss": return "A missed opportunity to gain an advantage or win material.";
    case "Blunder": return "A critical error that severely damages your position or loses material.";
    default: return "A standard move.";
  }
}
