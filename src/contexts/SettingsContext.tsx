"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type BoardTheme = "classic" | "green" | "blue" | "purple" | "neon" | "ocean" | "walnut";
type PieceSet = "classic" | "modern";

interface Settings {
  boardTheme: BoardTheme;
  pieceSet: PieceSet;
  moveAnimation: boolean;
  soundEnabled: boolean;
  narrationEnabled: boolean;
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
  narrationEnabled: true,
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

    // Sync Chess.com/Lichess username from localStorage to Supabase profile
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        const localChesscom = localStorage.getItem("chessium_chesscom_user");
        const localLichess = localStorage.getItem("chessium_lichess_user");
        
        // Fetch current profile to see if it's missing or lacks username in DB
        supabase.from("profiles")
          .select("chess_com_username, lichess_username")
          .eq("id", user.id)
          .single()
          .then(({ data, error }) => {
            if (data) {
              const dbChesscom = data.chess_com_username;
              const dbLichess = data.lichess_username;
              
              let updateData: any = {};
              if (!dbChesscom && localChesscom) {
                updateData.chess_com_username = localChesscom;
              }
              if (!dbLichess && localLichess) {
                updateData.lichess_username = localLichess;
              }
              
              if (Object.keys(updateData).length > 0) {
                supabase.from("profiles").update(updateData).eq("id", user.id).then();
              }
            } else if (error || !data) {
              // Profile is completely missing, self-heal immediately with local storage values!
              const rawUsername = user.user_metadata?.username || user.email?.split("@")[0] || "user";
              let sanitizedUsername = rawUsername.replace(/[^a-zA-Z0-9_]/g, "");
              if (sanitizedUsername.length < 3) {
                sanitizedUsername = `user_${user.id.substring(0, 8)}`;
              }
              
              supabase.from("profiles").insert({
                id: user.id,
                username: sanitizedUsername,
                display_name: user.user_metadata?.display_name || user.user_metadata?.username || rawUsername,
                chess_com_username: localChesscom || null,
                lichess_username: localLichess || null
              }).then();
            }
          });
      }
    });
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
