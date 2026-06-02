"use client";

import { Chessboard } from "react-chessboard";
import { CSSProperties } from "react";

interface BoardProps {
  position: string;
  onPieceDrop?: (sourceSquare: string, targetSquare: string, piece: string) => boolean;
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
    <div className="w-full max-w-full aspect-square rounded-lg overflow-hidden shadow-card border border-[#2a2a30]">
      <Chessboard
        id="chessium-board"
        position={position}
        onPieceDrop={onPieceDrop}
        boardOrientation={boardOrientation}
        customArrows={customArrows}
        customSquareStyles={customSquareStyles}
        animationDuration={animationDuration}
        areArrowsAllowed={areArrowsAllowed}
        arePiecesDraggable={arePiecesDraggable}
        customDarkSquareStyle={{ backgroundColor: colors.dark }}
        customLightSquareStyle={{ backgroundColor: colors.light }}
        customDropSquareStyle={{ boxShadow: "inset 0 0 1px 4px rgba(255, 255, 255, 0.5)" }}
      />
    </div>
  );
}
