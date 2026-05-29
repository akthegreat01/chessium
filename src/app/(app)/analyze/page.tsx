import Analyzer from "@/components/chess/Analyzer";
import { Suspense } from "react";

export default function AnalyzePage() {
  return (
    <div className="flex-1 w-full h-full min-h-screen bg-background">
      <Suspense fallback={<div className="flex items-center justify-center h-full text-secondary-foreground">Loading Analyzer...</div>}>
        <Analyzer />
      </Suspense>
    </div>
  );
}
