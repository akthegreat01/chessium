import React from "react";
import { Search } from "lucide-react";
import { AdUnit } from "@/components/ui/AdUnit";

export default function VisionPage() {
  return (
    <div className="flex-1 w-full min-h-[calc(100vh-80px)] p-6 bg-background">
      <div className="max-w-[1200px] mx-auto h-full flex flex-col gap-6">
        <div className="flex items-center gap-4 bg-surface p-6 rounded-[24px] border border-border">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
            <Search className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Board Vision Training</h1>
            <p className="text-secondary-foreground text-sm mt-1">
              Master the chessboard coordinates and improve your tactical awareness.
            </p>
          </div>
        </div>

        <div className="flex-1 flex flex-col lg:flex-row gap-6">
          <div className="flex-1 bg-surface border border-border rounded-[24px] p-8 flex flex-col items-center justify-center text-center">
            <h2 className="text-xl font-bold text-foreground mb-4">Coming Soon</h2>
            <p className="text-secondary-foreground max-w-md">
              We are building a highly interactive board vision training tool that will flash coordinates, lines, and diagonals to help you instantly recognize board patterns without thinking.
            </p>
          </div>
          <div className="w-full lg:w-[300px] shrink-0">
            <AdUnit className="w-full min-h-[300px] rounded-[24px]" />
          </div>
        </div>
      </div>
    </div>
  );
}
