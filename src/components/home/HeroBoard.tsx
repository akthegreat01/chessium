// @ts-nocheck
"use client";

import React from "react";
import dynamic from "next/dynamic";
const Chessboard = dynamic(() => import("react-chessboard").then(mod => mod.Chessboard as any), { ssr: false, loading: () => <div className="w-full aspect-square bg-white/5 animate-pulse rounded" /> });

import { useBoardTheme } from "./../chess/ThemeContext";

export default function HeroBoard() {
  const { boardTheme } = useBoardTheme();

  return (
    <div className="w-full aspect-square pointer-events-none">
      <Chessboard
        customDarkSquareStyle={boardTheme.darkSquareStyle}
        customLightSquareStyle={boardTheme.lightSquareStyle}
        arePiecesDraggable={false}
      />
    </div>
  );
}
