import Analyzer from "@/components/chess/Analyzer";
import { Suspense } from "react";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Chess Game Analyzer | Stockfish 18 Evaluation",
  description: "Analyze your chess games for free using the latest Stockfish 18 engine. Import PGNs, review mistakes, and find brilliant moves instantly.",
  openGraph: {
    title: "Free Chess Game Analyzer | Stockfish 18 Evaluation",
    description: "Analyze your chess games for free using the latest Stockfish 18 engine.",
    url: "https://chessium.in/analyze",
  }
};

export default function AnalyzePage() {
  return (
    <div className="flex-1 w-full h-full min-h-screen bg-background">
      <Suspense fallback={<div className="flex items-center justify-center h-full text-secondary-foreground">Loading Analyzer...</div>}>
        <Analyzer />
      </Suspense>
    </div>
  );
}
