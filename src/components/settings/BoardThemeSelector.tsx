"use client";

import React from "react";
import { useBoardTheme, themes, BoardThemeName } from "@/components/chess/ThemeContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function BoardThemeSelector() {
  const { boardTheme, setBoardThemeName } = useBoardTheme();

  return (
    <div className="flex justify-between items-center">
      <div>
        <div className="text-[14px] font-medium mb-1">Board Theme</div>
        <div className="text-[12px] text-secondary-foreground">Change the visual appearance of the chessboard.</div>
      </div>
      <Select value={boardTheme.name} onValueChange={(val) => setBoardThemeName(val as BoardThemeName)}>
        <SelectTrigger className="w-[140px] h-9 border-border bg-background">
          <SelectValue placeholder="Select theme" />
        </SelectTrigger>
        <SelectContent>
          {Object.values(themes).map((theme) => (
            <SelectItem key={theme.name} value={theme.name}>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-sm flex overflow-hidden border border-border">
                  <div className="w-1/2 h-full" style={theme.lightSquareStyle} />
                  <div className="w-1/2 h-full" style={theme.darkSquareStyle} />
                </div>
                {theme.label}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
