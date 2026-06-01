import { puzzles, getDailyPuzzle } from "@/lib/puzzles/data";
import PuzzleClient from "./ClientPage";

export default function PuzzlesPage() {
  const dailyPuzzle = getDailyPuzzle();

  return (
    <div className="flex-1 w-full min-h-screen bg-background">
      <PuzzleClient initialPuzzle={dailyPuzzle} allPuzzles={puzzles} />
    </div>
  );
}
