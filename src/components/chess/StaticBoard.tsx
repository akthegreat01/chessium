"use client";

import React from "react";
import dynamic from "next/dynamic";
const Chessboard = dynamic(() => import("react-chessboard").then(mod => mod.Chessboard), { ssr: false });
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
