"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function GamesPage() {
  const [games, setGames] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        supabase
          .from("games")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .then(({ data }) => {
            if (data) setGames(data);
            setIsLoading(false);
          });
      } else {
        setIsLoading(false);
      }
    });
  }, [supabase]);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Game Archive</h1>
          <p className="text-[#a0a0a8]">View and analyze your past matches.</p>
        </div>
      </div>

      <div className="bg-[#141416] border border-[#2a2a30] rounded-2xl overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-[#a0a0a8]">Loading games...</div>
        ) : games.length === 0 ? (
          <div className="p-8 text-center text-[#a0a0a8]">
            <p className="mb-4">No games found.</p>
            <Link
              href="/play"
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#81b64c] hover:bg-[#9fcc6b] transition-colors"
            >
              Play a Game
            </Link>
          </div>
        ) : (
          games.map((game, i) => (
            <div
              key={game.id || i}
              className="flex items-center gap-4 p-4 border-b border-[#2a2a30] last:border-0 hover:bg-[#1a1a1f] transition-colors"
            >
              <div className="w-12 h-12 bg-[#0a0a0b] rounded-lg flex items-center justify-center text-xl border border-[#2a2a30]">
                {game.player_color === "white" ? "♔" : "♚"}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-white truncate">
                    vs {game.opponent_name || "Guest"}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-medium ${
                      game.result === "win"
                        ? "bg-[#81b64c]/10 text-[#81b64c]"
                        : game.result === "loss"
                        ? "bg-[#ca3431]/10 text-[#ca3431]"
                        : "bg-[#a0a0a8]/10 text-[#a0a0a8]"
                    }`}
                  >
                    {game.result === "win"
                      ? "Won"
                      : game.result === "loss"
                      ? "Lost"
                      : "Draw"}
                  </span>
                </div>
                <div className="text-xs text-[#6b6b75]">
                  {game.time_control || "Custom"} •{" "}
                  {new Date(game.created_at).toLocaleDateString()}
                </div>
              </div>
              <div className="hidden sm:block text-right">
                <div className="text-sm font-medium text-white mb-1">Accuracy</div>
                <div className="text-xs text-[#81b64c]">{game.accuracy ? `${game.accuracy}%` : "N/A"}</div>
              </div>
              <Link
                href={`/analysis?pgn=${encodeURIComponent(game.pgn || "")}`}
                className="p-2 rounded-lg text-[#a0a0a8] hover:text-white hover:bg-[#2a2a30] transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                  />
                </svg>
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
