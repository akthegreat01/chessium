"use client";

import React from "react";
import { Chessboard } from "react-chessboard";

export function StaticBoard({ position, width, allowDragging = false }: { position: string, width?: number, allowDragging?: boolean }) {
  return (
    <Chessboard 
      boardWidth={width}
      options={{
        position,
        darkSquareStyle: { backgroundColor: '#779556' },
        lightSquareStyle: { backgroundColor: '#ebecd0' },
        allowDragging
      }}
    />
  );
}
