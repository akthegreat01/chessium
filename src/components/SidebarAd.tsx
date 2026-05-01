"use client";

import { Info } from 'lucide-react';

interface SidebarAdProps {
  side: 'left' | 'right';
}

export default function SidebarAd({ side }: SidebarAdProps) {
  return (
    <div className={`hidden xl:flex flex-col gap-4 w-[160px] h-full py-4 ${side === 'left' ? 'items-end' : 'items-start'}`}>
      <div className="w-full flex-1 glass-panel relative overflow-hidden flex flex-col border border-white/[0.03] bg-white/[0.01] hover:bg-white/[0.02] transition-colors group">
        {/* Ad Label */}
        <div className="absolute top-0 right-0 p-1 flex items-center gap-1 opacity-20 group-hover:opacity-40 transition-opacity">
          <span className="text-[8px] uppercase tracking-tighter text-gray-400 font-bold">Advertisement</span>
          <Info className="w-2 h-2 text-gray-500" />
        </div>

        {/* Ad Content Placeholder */}
        <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500/10 to-purple-500/10 flex items-center justify-center mb-3 border border-white/5">
            <span className="text-xl">✨</span>
          </div>
          <div className="space-y-1">
            <div className="h-2 w-16 bg-white/5 rounded mx-auto" />
            <div className="h-1.5 w-12 bg-white/[0.03] rounded mx-auto" />
          </div>
        </div>

        {/* Bottom Call to Action */}
        <div className="p-3 border-t border-white/[0.03] bg-black/20">
          <div className="w-full h-8 rounded-md bg-gradient-to-r from-blue-600/20 to-indigo-600/20 border border-blue-500/20 flex items-center justify-center text-[10px] font-black uppercase tracking-wider text-blue-400 hover:from-blue-600/30 transition-all cursor-pointer">
            Explore
          </div>
        </div>
      </div>

      <div className="w-full h-[250px] glass-panel relative overflow-hidden flex flex-col border border-white/[0.03] bg-white/[0.01] hover:bg-white/[0.02] transition-colors group">
        <div className="absolute top-0 right-0 p-1 flex items-center gap-1 opacity-20">
          <span className="text-[8px] uppercase tracking-tighter text-gray-400 font-bold">Ad</span>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center p-4">
           <div className="w-full aspect-square rounded-lg bg-gradient-to-tr from-orange-500/5 to-red-500/5 border border-white/5 flex items-center justify-center">
              <span className="text-2xl grayscale opacity-20 group-hover:grayscale-0 group-hover:opacity-100 transition-all">🎯</span>
           </div>
        </div>
      </div>
    </div>
  );
}
