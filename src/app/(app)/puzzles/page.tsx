import { getDailyPuzzle } from "@/lib/puzzles/data";
import PuzzleClient from "./ClientPage";

export default function PuzzlesPage() {
  const puzzle = getDailyPuzzle();

  return (
    <div className="flex-1 w-full min-h-screen bg-background">
      <PuzzleClient puzzle={puzzle} />
    </div>
  );
}
