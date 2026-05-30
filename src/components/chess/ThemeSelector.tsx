"use client";

import React, { useState } from "react";
import { useBoardTheme, themes, BoardThemeName } from "@/components/chess/ThemeContext";
import { Paintbrush, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ThemeSelector() {
  const { boardTheme, setBoardThemeName } = useBoardTheme();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative w-full">
      <Button 
        variant="ghost" 
        onClick={() => setOpen(!open)}
        className="w-full justify-center md:justify-start gap-3 h-9 rounded px-3 text-[13px] transition-all hover:bg-white/5 text-secondary-foreground hover:text-foreground font-medium"
      >
        <Paintbrush className="w-[18px] h-[18px]" />
        <span className="hidden md:inline-block">Board Theme</span>
      </Button>

      {open && (
        <div className="absolute left-full bottom-0 ml-2 w-48 bg-surface border border-border rounded shadow-2xl p-2 z-50">
          <div className="text-[10px] font-bold text-secondary-foreground mb-2 px-2 uppercase tracking-widest">Select Theme</div>
          <div className="flex flex-col gap-[2px]">
            {(Object.keys(themes) as BoardThemeName[]).map(themeKey => (
              <button
                key={themeKey}
                onClick={() => {
                  setBoardThemeName(themeKey);
                  setOpen(false);
                }}
                className={`flex items-center justify-between px-3 py-2 rounded text-[12px] transition-colors ${
                  boardTheme.name === themeKey ? "bg-white/10 text-foreground font-bold" : "hover:bg-white/5 text-secondary-foreground hover:text-foreground"
                }`}
              >
                {themes[themeKey].label}
                {boardTheme.name === themeKey && <Check className="w-[14px] h-[14px]" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
