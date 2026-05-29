"use client";

import React from "react";
import { Chessboard } from "react-chessboard";

export default function HeroBoard() {
  return (
    <div className="w-full max-w-[600px] aspect-square rounded-[2rem] overflow-hidden shadow-2xl shadow-black/80 border border-white/10 pointer-events-none transform -rotate-2 hover:rotate-0 transition-transform duration-700 ease-out">
      {/* @ts-ignore */}
      <Chessboard 
        options={{
          position: "r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/2N2N2/PPPP1PPP/R1BQK2R w KQkq - 4 5",
          darkSquareStyle: { backgroundColor: '#2d3748' },
          lightSquareStyle: { backgroundColor: '#e2e8f0' },
          allowDragging: false
        }}
      />
    </div>
  );
}
