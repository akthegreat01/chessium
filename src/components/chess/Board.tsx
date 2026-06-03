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
  
  const animDuration = settings.moveAnimation ? animationDuration : 0;

  // Generate custom square styles for all 64 squares based on theme colors
  const boardSquareStyles: Record<string, CSSProperties> = {};
  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      const square = `${files[i]}${8 - j}`;
      const isDark = (i + j) % 2 !== 0;
      boardSquareStyles[square] = { backgroundColor: isDark ? colors.dark : colors.light };
    }
  }

  // Merge the generated board styles with any custom styles provided via props
  const mergedSquareStyles = { ...boardSquareStyles, ...customSquareStyles };

  const boardOptions = useMemo(() => ({
    position: position,
    onPieceDrop: onPieceDrop 
      ? ({ piece, sourceSquare, targetSquare }: any) => {
          if (!sourceSquare || !targetSquare) return false;
          const pieceStr = piece?.pieceType || piece?.position || "wP";
          return onPieceDrop(sourceSquare, targetSquare, pieceStr);
        }
      : undefined,
    onSquareClick: onSquareClick
      ? ({ square }: any) => {
          onSquareClick(square);
        }
      : undefined,
    boardOrientation: boardOrientation,
    arrows: customArrows.map(arrow => ({ startSquare: arrow[0], endSquare: arrow[1], color: arrow[2] || "rgba(0, 0, 0, 0.2)" })),
    squareStyles: mergedSquareStyles,
    darkSquareStyle: { backgroundColor: colors.dark },
    lightSquareStyle: { backgroundColor: colors.light },
    dropSquareStyle: { boxShadow: "inset 0 0 1px 4px rgba(255, 255, 255, 0.5)" },
    animationDurationInMs: animDuration,
    allowDrawingArrows: areArrowsAllowed,
    allowDragging: arePiecesDraggable
  }), [position, onPieceDrop, onSquareClick, boardOrientation, customArrows, mergedSquareStyles, animDuration, areArrowsAllowed, arePiecesDraggable, colors]);

  return (
    <div className="w-full relative touch-none select-none" style={{ aspectRatio: "1 / 1" }}>
      <Chessboard key={activeTheme} options={boardOptions} />
    </div>
  );
}
