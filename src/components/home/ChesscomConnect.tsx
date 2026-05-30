"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ChesscomConnect() {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleConnect = async () => {
    if (!username.trim()) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`https://api.chess.com/pub/player/${username}`);
      if (!res.ok) {
        throw new Error("Chess.com account not found.");
      }

      const supabase = createClient();
      const { error: updateError } = await supabase.auth.updateUser({
        data: { chesscom_username: username }
      });

      if (updateError) throw updateError;

      router.refresh();
    } catch (err: any) {
      setError(err.message || "Failed to connect account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#262421] border border-[#312e2b] rounded-md p-6 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative">
      <div>
        <h2 className="text-[15px] font-bold text-[#c3c3c2] mb-1">Connect Chess.com</h2>
        <p className="text-[12px] text-[#8b8987]">Link your account to automatically sync your live ratings.</p>
      </div>
      <div className="flex w-full md:w-auto items-center gap-3">
        <input 
          type="text" 
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          className="flex-1 md:w-[200px] bg-[#312e2b] border border-transparent rounded px-3 py-2 text-[13px] text-[#c3c3c2] placeholder:text-[#8b8987] focus:outline-none focus:border-[#81b64c]/50 transition-colors"
        />
        <Button 
          onClick={handleConnect}
          disabled={loading || !username.trim()}
          className="bg-[#81b64c] hover:bg-[#81b64c]/90 text-white font-semibold text-[13px] rounded min-w-[100px]"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Connect"}
        </Button>
      </div>
      {error && <p className="text-[12px] text-destructive absolute bottom-2 left-6">{error}</p>}
    </div>
  );
}
