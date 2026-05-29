"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, ExternalLink } from "lucide-react";
import Link from "next/link";
import { deleteAnalysis } from "@/app/actions/analysis";

interface SaveItem {
  id: string;
  pgn: string;
  white_player: string;
  black_player: string;
  opening_name: string;
  accuracy_w: number;
  accuracy_b: number;
  result: string;
  date: string; // ISO string
}

export default function SavedAnalysesClient({ serverSaves, isLoggedIn }: { serverSaves: SaveItem[], isLoggedIn: boolean }) {
  const [saves, setSaves] = useState<SaveItem[]>(serverSaves);

  useEffect(() => {
    if (!isLoggedIn) {
      const localSaves = JSON.parse(localStorage.getItem('chessium_saves') || '[]');
      setSaves(localSaves);
    }
  }, [isLoggedIn]);

  const handleDelete = async (id: string) => {
    if (isLoggedIn) {
      const res = await deleteAnalysis(id);
      if (res?.success) {
        setSaves(saves.filter(s => s.id !== id));
      }
    } else {
      const newSaves = saves.filter(s => s.id !== id);
      setSaves(newSaves);
      localStorage.setItem('chessium_saves', JSON.stringify(newSaves));
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-6 md:p-10">
      <div className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight mb-2">My Analyses</h1>
        <p className="text-secondary-foreground text-lg">
          {isLoggedIn ? "Your cloud-synced game analyses." : "Your locally saved analyses. Log in to sync across devices."}
        </p>
      </div>

      {saves.length === 0 ? (
        <div className="bg-surface border border-white/5 rounded-3xl p-12 text-center flex flex-col items-center">
          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-6">
            <ExternalLink className="w-8 h-8 text-secondary-foreground" />
          </div>
          <h2 className="text-2xl font-bold mb-2">No saved analyses</h2>
          <p className="text-secondary-foreground mb-8">You haven't saved any games yet. Head over to the Analyzer to import and save a game.</p>
          <Button className="rounded-full px-8">
            <Link href="/analyze">Go to Analyzer</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-4">
          {saves.map((save) => (
            <div key={save.id} className="bg-surface border border-white/5 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all hover:bg-white/5">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-sm font-bold tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-full uppercase">
                    {new Date(save.date).toLocaleDateString()}
                  </span>
                  <span className="text-sm font-medium text-secondary-foreground">{save.opening_name || "Unknown Opening"}</span>
                </div>
                <h3 className="text-xl font-bold tracking-tight">
                  {save.white_player} vs {save.black_player}
                </h3>
                <div className="text-sm text-secondary-foreground mt-1">Result: {save.result || '*'}</div>
              </div>

              <div className="flex items-center gap-4">
                <Button variant="outline" className="rounded-full border-white/10 hover:bg-white/10">
                  <Link href={`/analyze?pgn=${encodeURIComponent(save.pgn)}`}>
                    Reopen Analysis
                  </Link>
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(save.id)} className="text-destructive/80 hover:text-destructive hover:bg-destructive/10 rounded-full">
                  <Trash2 className="w-5 h-5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
