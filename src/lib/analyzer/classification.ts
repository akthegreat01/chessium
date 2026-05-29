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

  // Convert evals so that Positive always means "Advantage for the player who just moved"
  const multiplier = turn === 'w' ? 1 : -1;
  const scoreBefore = evalBefore * multiplier;
  const scoreAfter = evalAfter * multiplier;
  
  // The drop in evaluation caused by the move
  const evalDrop = scoreBefore - scoreAfter;

  if (isBestMove) {
    if (isCapture && evalDrop < -100 && scoreAfter > 200) {
      return "Brilliant"; // Crude proxy for brilliant: Sacrifice/Capture that dramatically improves an already winning/equal position
    }
    if (evalDrop < -50) return "Great Move";
    return "Best Move";
  }

  // Blunders are severe drops in evaluation (e.g. losing 2 pawns of value)
  if (evalDrop >= 200) {
    // If the position was already massively winning, losing 2 pawns might just be a mistake, not a blunder
    if (scoreBefore > 500 && scoreAfter > 300) return "Mistake"; 
    return "Blunder";
  }

  // Mistakes are moderate drops
  if (evalDrop >= 100) return "Mistake";

  // Inaccuracies are minor drops
  if (evalDrop >= 50) return "Inaccuracy";

  // If the engine eval only dropped slightly, it's still a good move
  if (evalDrop >= 20) return "Good";
  
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
