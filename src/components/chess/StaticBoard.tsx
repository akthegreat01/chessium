"use client";

import React from "react";
import { Chessboard } from "react-chessboard";
import { useBoardTheme } from "./ThemeContext";

export function StaticBoard({ position, width, allowDragging = false }: { position: string, width?: number, allowDragging?: boolean }) {
  const { boardTheme } = useBoardTheme();
  
  return (
    <Chessboard 
      boardWidth={width}
      position={position}
      customDarkSquareStyle={boardTheme.darkSquareStyle}
      customLightSquareStyle={boardTheme.lightSquareStyle}
      arePiecesDraggable={allowDragging}
    />
  );
}
