"use client";

interface SidebarAdProps {
  side: 'left' | 'right';
}

/**
 * SidebarAd component provides dedicated containers for real advertisements.
 * Use the provided IDs to target these slots with your ad scripts (AdSense, Carbon, etc).
 */
export default function SidebarAd({ side }: SidebarAdProps) {
  return (
    <div className={`hidden xl:flex flex-col gap-4 w-[160px] h-full py-4 ${side === 'left' ? 'items-end' : 'items-start'}`}>
      {/* Top Ad Slot */}
      <div 
        id={`ad-slot-${side}-top`}
        className="w-full flex-1 rounded-xl border border-white/[0.03] bg-white/[0.01] flex items-center justify-center relative min-h-[400px]"
      >
        <span className="absolute top-2 right-2 text-[8px] uppercase tracking-tighter text-gray-700 font-bold select-none">Ad Slot</span>
      </div>

      {/* Bottom Ad Slot (Fixed Height) */}
      <div 
        id={`ad-slot-${side}-bottom`}
        className="w-full h-[250px] rounded-xl border border-white/[0.03] bg-white/[0.01] flex items-center justify-center relative flex-shrink-0"
      >
        <span className="absolute top-2 right-2 text-[8px] uppercase tracking-tighter text-gray-700 font-bold select-none">Ad Slot</span>
      </div>
    </div>
  );
}
