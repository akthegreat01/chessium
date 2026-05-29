"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, FileDown, Search, Loader2 } from "lucide-react";

interface ImportModalProps {
  onImport: (type: 'pgn' | 'fen', data: string) => void;
  children: React.ReactNode;
}

export default function ImportModal({ onImport, children }: ImportModalProps) {
  const [open, setOpen] = useState(false);
  const [inputData, setInputData] = useState("");
  
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [games, setGames] = useState<any[]>([]);

  const handleImport = (data: string) => {
    if (!data.trim()) return;
    const isFen = data.split('/').length > 4;
    onImport(isFen ? 'fen' : 'pgn', data.trim());
    setOpen(false);
    setInputData("");
    setGames([]);
    setUsername("");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setInputData(text);
      };
      reader.readAsText(file);
    }
  };

  const fetchChesscom = async () => {
    if (!username.trim()) return;
    setLoading(true);
    setError("");
    setGames([]);
    
    try {
      const archRes = await fetch(`https://api.chess.com/pub/player/${username}/games/archives`);
      if (!archRes.ok) throw new Error("User not found");
      const archData = await archRes.json();
      if (!archData.archives.length) throw new Error("No games found");
      
      const lastArchive = archData.archives[archData.archives.length - 1];
      const gamesRes = await fetch(lastArchive);
      const gamesData = await gamesRes.json();
      
      const recent = gamesData.games.slice(-5).reverse().map((g: any) => {
        const white = g.white.username;
        const black = g.black.username;
        const date = new Date(g.end_time * 1000).toLocaleDateString();
        return { id: g.url, white, black, date, pgn: g.pgn, platform: 'chesscom' };
      });
      setGames(recent);
    } catch (e: any) {
      setError(e.message || "Failed to fetch games");
    } finally {
      setLoading(false);
    }
  };

  const fetchLichess = async () => {
    if (!username.trim()) return;
    setLoading(true);
    setError("");
    setGames([]);
    
    try {
      const res = await fetch(`https://lichess.org/api/games/user/${username}?max=5`, {
        headers: { 'Accept': 'application/x-ndjson' }
      });
      if (!res.ok) throw new Error("User not found or API error");
      const text = await res.text();
      const lines = text.trim().split('\n').filter(l => l);
      
      const recent = lines.map(line => {
        const g = JSON.parse(line);
        const white = g.players.white.user?.name || "Anonymous";
        const black = g.players.black.user?.name || "Anonymous";
        const date = new Date(g.createdAt).toLocaleDateString();
        return { id: g.id, white, black, date, pgn: null, platform: 'lichess' };
      });
      setGames(recent);
    } catch (e: any) {
      setError(e.message || "Failed to fetch games");
    } finally {
      setLoading(false);
    }
  };

  const importFetchedGame = async (game: any) => {
    if (game.pgn) {
      handleImport(game.pgn);
    } else if (game.platform === 'lichess') {
      try {
        setLoading(true);
        const res = await fetch(`https://lichess.org/game/export/${game.id}?clocks=false&evals=false`);
        const pgn = await res.text();
        handleImport(pgn);
      } catch (e) {
        alert("Failed to download PGN from Lichess");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg bg-[#121620] border-[#1e2433] rounded-[24px] p-6 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold tracking-tight text-foreground">Import Game</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="paste" className="w-full mt-4">
          <TabsList className="grid w-full grid-cols-3 bg-[#0a0d14] border border-[#1e2433]">
            <TabsTrigger value="paste">Paste</TabsTrigger>
            <TabsTrigger value="chesscom">Chess.com</TabsTrigger>
            <TabsTrigger value="lichess">Lichess</TabsTrigger>
          </TabsList>
          
          <TabsContent value="paste" className="space-y-4 pt-4">
            <Textarea 
              placeholder="Paste PGN or FEN here..." 
              className="min-h-[160px] bg-[#0a0d14] border-[#1e2433] resize-none rounded-xl font-mono text-sm"
              value={inputData}
              onChange={(e) => setInputData(e.target.value)}
            />
            <div className="flex gap-4">
              <div className="relative flex-1">
                <input 
                  type="file" 
                  accept=".pgn,.txt" 
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <Button variant="outline" className="w-full border-[#1e2433] bg-[#0a0d14] rounded-xl gap-2 hover:bg-[#1e2433]">
                  <FileDown className="w-4 h-4" /> File
                </Button>
              </div>
              <Button className="flex-1 rounded-xl gap-2 font-bold bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => handleImport(inputData)}>
                <Upload className="w-4 h-4" /> Import
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="chesscom" className="space-y-4 pt-4">
            <div className="flex gap-2">
              <Input 
                placeholder="Chess.com Username" 
                value={username} 
                onChange={e => setUsername(e.target.value)} 
                className="bg-[#0a0d14] border-[#1e2433] rounded-xl"
                onKeyDown={e => e.key === 'Enter' && fetchChesscom()}
              />
              <Button onClick={fetchChesscom} disabled={loading} className="rounded-xl bg-primary text-primary-foreground">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              </Button>
            </div>
            <GameList games={games} error={error} onSelect={importFetchedGame} />
          </TabsContent>

          <TabsContent value="lichess" className="space-y-4 pt-4">
            <div className="flex gap-2">
              <Input 
                placeholder="Lichess Username" 
                value={username} 
                onChange={e => setUsername(e.target.value)} 
                className="bg-[#0a0d14] border-[#1e2433] rounded-xl"
                onKeyDown={e => e.key === 'Enter' && fetchLichess()}
              />
              <Button onClick={fetchLichess} disabled={loading} className="rounded-xl bg-primary text-primary-foreground">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              </Button>
            </div>
            <GameList games={games} error={error} onSelect={importFetchedGame} />
          </TabsContent>
        </Tabs>
        
      </DialogContent>
    </Dialog>
  );
}

function GameList({ games, error, onSelect }: { games: any[], error: string, onSelect: (g: any) => void }) {
  if (error) return <div className="text-sm text-red-400 p-4 bg-red-400/10 rounded-xl">{error}</div>;
  if (!games.length) return null;

  return (
    <div className="flex flex-col gap-2 max-h-[240px] overflow-y-auto pr-1">
      {games.map((g, i) => (
        <div key={i} onClick={() => onSelect(g)} className="flex items-center justify-between p-3 bg-[#0a0d14] border border-[#1e2433] rounded-xl cursor-pointer hover:border-white/20 transition-colors">
          <div>
            <div className="text-sm font-bold text-foreground">{g.white} <span className="text-secondary-foreground font-normal mx-1">vs</span> {g.black}</div>
            <div className="text-xs text-secondary-foreground mt-0.5">{g.date}</div>
          </div>
          <Button size="sm" variant="ghost" className="h-8 rounded-lg hover:bg-[#1e2433]">Import</Button>
        </div>
      ))}
    </div>
  );
}
