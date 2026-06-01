"use client";

import React, { useEffect } from "react";

export function AdSenseBanner({ className = "" }: { className?: string }) {
  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error("AdSense error:", err);
    }
  }, []);

  return (
    <div className={`w-full bg-surface/50 border border-border p-6 rounded-[32px] flex flex-col items-center justify-center min-h-[250px] shadow-lg relative overflow-hidden ${className}`}>
      <span className="text-[10px] font-bold text-secondary-foreground absolute top-4 left-4 uppercase tracking-widest z-10">Advertisement</span>
      <ins className="adsbygoogle"
           style={{ display: "block", width: "100%", minHeight: "200px" }}
           data-ad-client="ca-pub-9046932302377091"
           data-ad-slot="1234567890"
           data-ad-format="auto"
           data-full-width-responsive="true"></ins>
    </div>
  );
}
