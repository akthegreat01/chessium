import { puzzles, getDailyPuzzle } from "@/lib/puzzles/data";
import PuzzleClient from "./ClientPage";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Chess Tactics & Daily Puzzles | Train Your Vision",
  description: "Improve your chess vision with thousands of free interactive chess puzzles. Master forks, pins, skewers, and checkmates.",
  openGraph: {
    title: "Free Chess Tactics & Daily Puzzles",
    description: "Improve your chess vision with thousands of free interactive chess puzzles.",
    url: "https://chessium.in/puzzles",
  }
};

export default function PuzzlesPage() {
  const dailyPuzzle = getDailyPuzzle();

  return (
    <div className="flex-1 w-full min-h-screen bg-background">
      <PuzzleClient initialPuzzle={dailyPuzzle} allPuzzles={puzzles} />
    </div>
  );
}
