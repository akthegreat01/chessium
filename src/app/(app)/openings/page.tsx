import React from "react";
import { BookOpen, Search, ChevronRight } from "lucide-react";
import Link from "next/link";
import { StaticBoard } from "@/components/chess/StaticBoard";
import { OPENINGS } from "@/lib/data/openings";

export default function OpeningsPage() {
  return (
    <div className="p-4 md:p-8 max-w-[1200px] mx-auto min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-3">
            <BookOpen className="w-7 h-7 text-primary" />
            Openings
          </h1>
          <p className="text-secondary-foreground text-[16px]">Explore and master opening theory.</p>
        </div>
        <div className="relative w-64 hidden md:block">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-secondary-foreground" />
          <input 
            type="text" 
            placeholder="Search openings..." 
            className="w-full h-10 bg-white/[0.02] border border-white/5 backdrop-blur-md rounded-xl pl-10 pr-4 text-[13px] focus:outline-none focus:border-primary/50 focus:bg-white/[0.04] transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {OPENINGS.map((op, i) => {
          return (
            <Link href={`/openings/${op.slug}`} key={i} className="group bg-white/[0.01] backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden hover:border-white/20 hover:bg-white/[0.03] transition-all flex flex-col shadow-lg hover:shadow-2xl hover:-translate-y-1">
              <div className="aspect-square bg-black/20 border-b border-white/5 p-5 relative pointer-events-none flex items-center justify-center">
                <div className="w-full h-full rounded shadow-[0_0_20px_rgba(0,0,0,0.5)] overflow-hidden">
                  <StaticBoard position={op.fen} />
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-[16px] group-hover:text-primary transition-colors">{op.name}</h3>
                    <span className="text-[11px] text-secondary-foreground font-mono bg-white/5 px-2 py-1 rounded-md border border-white/5">{op.eco}</span>
                  </div>
                  <p className="text-secondary-foreground text-[13px] font-mono mb-4 bg-black/20 px-3 py-1.5 rounded-lg inline-block">{op.movesText}</p>
                </div>
                <div className="flex items-center text-[13px] font-bold text-primary opacity-80 group-hover:opacity-100 transition-opacity">
                  Study Opening <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
