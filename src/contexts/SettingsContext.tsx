"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type BoardTheme = "classic" | "green" | "blue" | "purple" | "neon" | "ocean" | "walnut";
type PieceSet = "classic" | "modern";

interface Settings {
  boardTheme: BoardTheme;
  pieceSet: PieceSet;
  moveAnimation: boolean;
  soundEnabled: boolean;
  analysisDepth: number;
  multiPv: number;
  showBestMoveArrow: boolean;
  blindfoldMode: boolean;
}

const defaultSettings: Settings = {
  boardTheme: "green",
  pieceSet: "classic",
  moveAnimation: true,
  soundEnabled: true,
  analysisDepth: 14,
  multiPv: 1,
  showBestMoveArrow: true,
  blindfoldMode: false,
};

interface SettingsContextType {
  settings: Settings;
  updateSetting: <K extends keyof Settings>(key: K, value: Settings[K]) => void;
  resetSettings: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load from localStorage on mount
    const stored = localStorage.getItem("chessium_settings");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setSettings((prev) => ({ ...prev, ...parsed }));
      } catch (e) {
        console.error("Failed to parse settings", e);
      }
    }
    setIsLoaded(true);
  }, []);

  const updateSetting = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings((prev) => {
      const next = { ...prev, [key]: value };
      localStorage.setItem("chessium_settings", JSON.stringify(next));
      return next;
    });
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    localStorage.removeItem("chessium_settings");
  };

  // Prevent hydration mismatch by not rendering children until loaded
  if (!isLoaded) {
    return <div className="min-h-screen bg-[#0a0a0b]" />;
  }

  return (
    <SettingsContext.Provider value={{ settings, updateSetting, resetSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
