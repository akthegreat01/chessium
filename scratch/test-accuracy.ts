import { calculateAccuracy, classifyMove, winProbability } from "../src/lib/chess/analysis";
import type { MoveAnalysis, EvalData } from "../src/types/chess";
import { Chess } from "chess.js";

async function main() {
  console.log("=== Testing Win Probability ===");
  console.log("wp(0 cp):", winProbability(0));
  console.log("wp(100 cp):", winProbability(100));
  console.log("wp(-100 cp):", winProbability(-100));
  console.log("wp(300 cp):", winProbability(300));
  console.log("wp(-300 cp):", winProbability(-300));

  console.log("\n=== Testing Accuracy Calculation ===");
  // Simulate 10 moves: 8 are 'best' moves, 2 are 'blunders'
  const mockMoves: MoveAnalysis[] = [];
  const chess = new Chess();

  // Add 8 best moves for white
  for (let i = 0; i < 8; i++) {
    mockMoves.push({
      moveNumber: i + 1,
      san: "e4",
      uci: "e2e4",
      color: "w",
      fenBefore: "",
      fenAfter: "",
      evalBefore: { cp: 100, mate: null, depth: 12, pv: [] },
      evalAfter: { cp: 100, mate: null, depth: 12, pv: [] },
      bestMove: "e2e4",
      bestMoveSan: "e4",
      classification: "best",
      winProbBefore: winProbability(100),
      winProbAfter: winProbability(100),
      expectedPointsLoss: 0,
      isTopEngine: true
    });
  }

  // Add 2 blunders for white (win probability drop from 100 cp to -300 cp)
  const wpBefore = winProbability(100);
  const wpAfter = winProbability(-300);
  for (let i = 8; i < 10; i++) {
    mockMoves.push({
      moveNumber: i + 1,
      san: "Qxf7",
      uci: "d1f3",
      color: "w",
      fenBefore: "",
      fenAfter: "",
      evalBefore: { cp: 100, mate: null, depth: 12, pv: [] },
      evalAfter: { cp: -300, mate: null, depth: 12, pv: [] },
      bestMove: "e2e4",
      bestMoveSan: "e4",
      classification: "blunder",
      winProbBefore: wpBefore,
      winProbAfter: wpAfter,
      expectedPointsLoss: wpBefore - wpAfter,
      isTopEngine: false
    });
  }

  const whiteAccuracy = calculateAccuracy(mockMoves, 'w');
  console.log("White Accuracy (8 best moves, 2 blunders):", whiteAccuracy);
  console.log("Expected accuracy range should be in 70s or 80s instead of 95+.");
}

main();
