import React from "react";

export function AdUnit({ className = "" }: { className?: string }) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <span className="text-[9px] font-bold text-secondary-foreground/50 absolute top-2 left-2 uppercase tracking-widest z-10 pointer-events-none">
        Advertisement
      </span>
      {/* Fake ad box for now, will be replaced with real AdSense if desired, or we just render an empty box that takes up space */}
      <div className="w-full h-full min-h-[100px] flex items-center justify-center bg-white/[0.02] border border-border/50 rounded-xl">
        <span className="text-xs text-secondary-foreground/30 font-medium">Ad Space</span>
      </div>
      {/* 
      <ins className="adsbygoogle"
           style={{ display: "block", width: "100%", height: "100%" }}
           data-ad-client="ca-pub-9046932302377091"
           data-ad-slot="1234567890"
           data-ad-format="auto"
           data-full-width-responsive="true"></ins> 
      */}
    </div>
  );
}
