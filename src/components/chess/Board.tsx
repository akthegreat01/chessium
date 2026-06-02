"use client";

import { Chessboard } from "react-chessboard";
import { CSSProperties } from "react";
import { useSettings } from "@/contexts/SettingsContext";

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
  theme?: string;
}

const THEME_COLORS = {
  classic: { light: "#f0d9b5", dark: "#b58863" },
  green: { light: "#ebecd0", dark: "#739552" },
  blue: { light: "#dee3e6", dark: "#8ca2ad" },
  purple: { light: "#e8daf0", dark: "#9370db" },
  neon: { light: "#1a1a2e", dark: "#0f3460" },
  ocean: { light: "#dee3e6", dark: "#8ca2ad" },
  walnut: { light: "#e6d5b8", dark: "#855e42" },
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
  theme,
}: BoardProps) {
  const { settings } = useSettings();
  const activeTheme = theme || settings.boardTheme;
  const colors = THEME_COLORS[activeTheme as keyof typeof THEME_COLORS] || THEME_COLORS.green;
  
  // Choose piece set mapping if needed. Currently react-chessboard only supports classic built-in 
  // without extensive custom piece images, but we can respect moveAnimation.
  const animDuration = settings.moveAnimation ? animationDuration : 0;

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
          animationDurationInMs: animDuration,
          allowDrawingArrows: areArrowsAllowed,
          allowDragging: arePiecesDraggable,
        }}
      />
    </div>
  );
}
