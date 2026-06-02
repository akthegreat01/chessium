"use client";

import { Chessboard } from "react-chessboard";
import { CSSProperties } from "react";

interface BoardProps {
  position: string;
  onPieceDrop?: (sourceSquare: string, targetSquare: string, piece: string) => boolean;
  onSquareClick?: (square: string) => void;
  boardOrientation?: "white" | "black";
  customArrows?: string[][];
  customSquareStyles?: Record<string, CSSProperties>;
  animationDuration?: number;
  areArrowsAllowed?: boolean;
  arePiecesDraggable?: boolean;
  theme?: "classic" | "green" | "blue" | "purple" | "neon";
}

const THEME_COLORS = {
  classic: { light: "#f0d9b5", dark: "#b58863" },
  green: { light: "#ebecd0", dark: "#739552" },
  blue: { light: "#dee3e6", dark: "#8ca2ad" },
  purple: { light: "#e8daf0", dark: "#9370db" },
  neon: { light: "#1a1a2e", dark: "#0f3460" },
};

export default function Board({
  position,
  onPieceDrop,
  onSquareClick,
  boardOrientation = "white",
  customArrows = [],
  customSquareStyles = {},
  animationDuration = 200,
  areArrowsAllowed = true,
  arePiecesDraggable = true,
  theme = "green",
}: BoardProps) {
  const colors = THEME_COLORS[theme] || THEME_COLORS.green;

  return (
    <div className="w-full max-w-full aspect-square rounded-xl overflow-hidden shadow-card border border-[#2a2a30]">
      <Chessboard
        options={{
          position: position,
          onPieceDrop: onPieceDrop 
            ? ({ sourceSquare, targetSquare, piece }) => {
                if (!sourceSquare || !targetSquare || !piece) return false;
                return onPieceDrop(sourceSquare, targetSquare, piece.pieceType || "");
              }
            : undefined,
          onSquareClick: onSquareClick 
            ? ({ square }) => {
                onSquareClick(square);
              }
            : undefined,
          boardOrientation: boardOrientation,
          arrows: customArrows.map(arrow => ({ 
            startSquare: arrow[0], 
            endSquare: arrow[1], 
            color: arrow[2] || "rgba(0, 0, 0, 0.2)" 
          })),
          squareStyles: customSquareStyles,
          darkSquareStyle: { backgroundColor: colors.dark },
          lightSquareStyle: { backgroundColor: colors.light },
          dropSquareStyle: { boxShadow: "inset 0 0 1px 4px rgba(255, 255, 255, 0.5)" },
          animationDurationInMs: animationDuration,
          allowDrawingArrows: areArrowsAllowed,
          allowDragging: arePiecesDraggable,
        }}
      />
    </div>
  );
}
