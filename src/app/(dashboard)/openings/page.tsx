import React from "react";
import Link from "next/link";
import { OPENINGS_DB } from "@/lib/chess/openings-db";
import AdSlot from "@/components/ui/AdSlot";

export default function OpeningsDirectoryPage() {
  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-8 min-h-[calc(100vh-8rem)]">
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
          Chess Openings <span className="text-[#81b64c]">Encyclopedia</span>
        </h1>
        <p className="text-[#a0a0a8] max-w-2xl mx-auto text-lg">
          Master the opening phase of the game. Browse our comprehensive database of chess openings, study the theory, and practice the main lines.
        </p>
      </div>

      <div className="mb-4">
        <AdSlot format="horizontal" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {OPENINGS_DB.map((opening) => (
          <Link href={`/openings/${opening.eco}`} key={opening.eco} className="group block h-full">
            <div className="bg-[#141416] border border-[#2a2a30] rounded-2xl p-6 h-full shadow-elevated transition-all group-hover:-translate-y-1 group-hover:border-[#81b64c]/50 relative overflow-hidden flex flex-col">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <div className="text-8xl font-black italic">{opening.eco}</div>
              </div>
              
              <div className="flex items-start justify-between mb-4 relative z-10">
                <h2 className="text-2xl font-bold text-white group-hover:text-[#81b64c] transition-colors">{opening.name}</h2>
                <span className="px-2 py-1 bg-[#1a1a1f] text-[#81b64c] border border-[#2a2a30] rounded-md text-xs font-bold">
                  {opening.eco}
                </span>
              </div>
              
              <p className="text-[#8a8a93] text-sm leading-relaxed mb-6 flex-1 relative z-10">
                {opening.description}
              </p>

              <div className="mt-auto relative z-10">
                <div className="flex items-center gap-2 mb-3">
                  <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                    opening.difficulty === 'Beginner' ? 'bg-green-500/20 text-green-500' :
                    opening.difficulty === 'Intermediate' ? 'bg-yellow-500/20 text-yellow-500' :
                    'bg-red-500/20 text-red-500'
                  }`}>
                    {opening.difficulty}
                  </span>
                  <span className="text-[#6b6b75] text-xs font-medium font-mono truncate">
                    {opening.moves.split(' ').slice(0, 4).join(' ')}...
                  </span>
                </div>
                <div className="text-[#81b64c] text-sm font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
                  Study Theory <span>→</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
      
      <div className="mt-8 bg-[#1a1a1f] border border-[#2a2a30] rounded-2xl p-8 text-center shadow-elevated">
        <h3 className="text-xl font-bold text-white mb-2">Want to learn more?</h3>
        <p className="text-[#a0a0a8] mb-4">Our opening database is constantly expanding. Check back often for new theoretical novelties and deep dives.</p>
        <Link href="/courses" className="inline-block px-6 py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors">
          Browse Video Courses
        </Link>
      </div>
    </div>
  );
}
