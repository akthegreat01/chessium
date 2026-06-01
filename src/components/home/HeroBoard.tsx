"use client";

import React from "react";
import dynamic from "next/dynamic";
const Chessboard = dynamic(() => import("react-chessboard").then(mod => mod.Chessboard), { ssr: false, loading: () => <div className="w-full aspect-square bg-white/5 animate-pulse rounded" /> });

import { useBoardTheme } from "./../chess/ThemeContext";

export default function HeroBoard() {
  const { boardTheme } = useBoardTheme();

  return (
    <div className="w-full aspect-square pointer-events-none">
      <Chessboard
        position="r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4"
        customDarkSquareStyle={boardTheme.darkSquareStyle}
        customLightSquareStyle={boardTheme.lightSquareStyle}
        arePiecesDraggable={false}
      />
    </div>
  );
}
