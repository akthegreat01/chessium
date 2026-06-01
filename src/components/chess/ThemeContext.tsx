"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type BoardThemeName = "obsidian" | "marble" | "walnut" | "tournament" | "chess-com-green" | "classic-wood" | "ocean";

export interface BoardTheme {
  name: BoardThemeName;
  label: string;
  lightSquareStyle: React.CSSProperties;
  darkSquareStyle: React.CSSProperties;
}

export const themes: Record<BoardThemeName, BoardTheme> = {
  obsidian: {
    name: "obsidian",
    label: "Obsidian",
    lightSquareStyle: { backgroundColor: "#1e1e24" },
    darkSquareStyle: { backgroundColor: "#09090b" },
  },
  marble: {
    name: "marble",
    label: "Marble",
    lightSquareStyle: { backgroundColor: "#ffffff" },
    darkSquareStyle: { backgroundColor: "#e2e2e5" },
  },
  walnut: {
    name: "walnut",
    label: "Walnut",
    lightSquareStyle: { backgroundColor: "#d4b797" },
    darkSquareStyle: { backgroundColor: "#855e42" },
  },
  tournament: {
    name: "tournament",
    label: "Tournament",
    lightSquareStyle: { backgroundColor: "#e2e8f0" },
    darkSquareStyle: { backgroundColor: "#64748b" },
  },
  "chess-com-green": {
    name: "chess-com-green",
    label: "Classic Green",
    lightSquareStyle: { backgroundColor: "#ebecd0" },
    darkSquareStyle: { backgroundColor: "#739552" },
  },
  "classic-wood": {
    name: "classic-wood",
    label: "Classic Wood",
    lightSquareStyle: { backgroundColor: "#f0d9b5" },
    darkSquareStyle: { backgroundColor: "#b58863" },
  },
  ocean: {
    name: "ocean",
    label: "Ocean",
    lightSquareStyle: { backgroundColor: "#eae9d2" },
    darkSquareStyle: { backgroundColor: "#4b7399" },
  }
};

interface ThemeContextType {
  boardTheme: BoardTheme;
  setBoardThemeName: (name: BoardThemeName) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeName, setThemeName] = useState<BoardThemeName>("obsidian");

  useEffect(() => {
    const saved = localStorage.getItem("chessium_board_theme");
    if (saved && themes[saved as BoardThemeName]) {
      setThemeName(saved as BoardThemeName);
    }
  }, []);

  const handleSetTheme = (name: BoardThemeName) => {
    setThemeName(name);
    localStorage.setItem("chessium_board_theme", name);
  };

  return (
    <ThemeContext.Provider value={{ boardTheme: themes[themeName], setBoardThemeName: handleSetTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useBoardTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    return { boardTheme: themes.obsidian, setBoardThemeName: () => {} };
  }
  return context;
}
