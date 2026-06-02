import Link from "next/link";
import React from "react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0a0a0b] flex flex-col relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full bg-[#81b64c] opacity-[0.03] blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 w-full p-6 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-[#81b64c] flex items-center justify-center text-white text-lg font-bold transition-transform group-hover:scale-105">
            ♞
          </div>
          <span className="text-lg font-bold tracking-tight text-white">
            CHESS<span className="text-[#81b64c]">IUM</span>
          </span>
        </Link>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-6 pb-24">
        {children}
      </main>
    </div>
  );
}
