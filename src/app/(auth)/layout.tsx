import React from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="absolute top-8 left-8 z-10">
        <Link href="/" className="inline-flex items-center text-secondary-foreground hover:text-foreground font-medium transition-colors">
          <ChevronLeft className="w-5 h-5 mr-1" />
          Back to Chessium
        </Link>
      </div>
      
      <div className="flex-1 flex items-center justify-center p-6 z-10">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  );
}
