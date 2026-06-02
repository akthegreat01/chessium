import { MoveClassification } from "./classification";

export interface GameAccuracy {
  whiteAccuracy: number;
  blackAccuracy: number;
  whiteStats: {
    brilliant: number;
    great: number;
    best: number;
    excellent: number;
    good: number;
    inaccuracy: number;
    mistake: number;
    blunder: number;
    miss: number;
  };
  blackStats: {
    brilliant: number;
    great: number;
    best: number;
    excellent: number;
    good: number;
    inaccuracy: number;
    mistake: number;
    blunder: number;
    miss: number;
  };
}

export const createEmptyStats = () => ({
  brilliant: 0,
  great: 0,
  best: 0,
  excellent: 0,
  good: 0,
  inaccuracy: 0,
  mistake: 0,
  blunder: 0,
  miss: 0,
});

export function calculateAccuracyFromLosses(whiteWPLosses: number[], blackWPLosses: number[]): { w: number, b: number } {
  // Move accuracy = 100 - (WP_loss) * weight (Chess.com maps WP loss heavily)
  // Overall accuracy is average of move accuracies.
  const calc = (wpDrops: number[]) => {
    if (wpDrops.length === 0) return 100;
    
    const moveAccuracies = wpDrops.map(drop => {
      // Chess.com style accuracy maps WP drops less aggressively
      let moveAcc = 100;
      if (drop <= 0) moveAcc = 100;
      else if (drop <= 2) moveAcc = 99; // Best/Great
      else if (drop <= 5) moveAcc = 95 - (drop - 2) * 1.5; // Good
      else if (drop <= 10) moveAcc = 90 - (drop - 5) * 2; // Inaccuracy
      else if (drop <= 20) moveAcc = 80 - (drop - 10) * 2.5; // Mistake
      else moveAcc = Math.max(0, 55 - (drop - 20) * 1.5); // Blunder

      return Math.max(0, Math.min(100, moveAcc));
    });

    const sum = moveAccuracies.reduce((a, b) => a + b, 0);
    return sum / moveAccuracies.length;
  };

  return {
    w: calc(whiteWPLosses),
    b: calc(blackWPLosses)
  };
}
