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
      // Chess.com style accuracy maps WP drops much more sharply to penalize blunders and inaccuracies
      let moveAcc = 100;
      if (drop <= 0) moveAcc = 100;
      else if (drop <= 1.5) moveAcc = 100 - (drop * 2); // 0-1.5 -> 100-97
      else if (drop <= 4) moveAcc = 97 - ((drop - 1.5) * 4); // 1.5-4 -> 97-87
      else if (drop <= 9) moveAcc = 87 - ((drop - 4) * 3.4); // 4-9 -> 87-70
      else if (drop <= 20) moveAcc = 70 - ((drop - 9) * 4.5); // 9-20 -> 70-20
      else moveAcc = Math.max(0, 20 - (drop - 20) * 1); // >20 -> 20 to 0

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
