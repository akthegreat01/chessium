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

export function calculateAccuracyFromLosses(whiteCPLosses: number[], blackCPLosses: number[]): { w: number, b: number } {
  // Accuracy = 103.1668 * exp(-0.04354 * avgCPLoss) - 3.1669
  // (Approximation of standard chess accuracy curves)
  
  const calc = (losses: number[]) => {
    if (losses.length === 0) return 100;
    const avgLoss = losses.reduce((a, b) => a + b, 0) / losses.length;
    // Cap loss at 1000 for extreme blunders so it doesn't skew average too hard
    const cappedAvg = Math.min(avgLoss, 1000); 
    const accuracy = 103.1668 * Math.exp(-0.004354 * cappedAvg) - 3.1669;
    return Math.max(0, Math.min(100, accuracy));
  };

  return {
    w: calc(whiteCPLosses),
    b: calc(blackCPLosses)
  };
}
