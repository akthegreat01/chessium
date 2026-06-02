import { ImportedGame } from "@/types/chess";

export async function fetchChessComGames(username: string, maxMonths: number = 6): Promise<ImportedGame[]> {
  const headers = { 'User-Agent': 'Chessium (contact: dev@chessium.com)' };
  
  try {
    const archivesRes = await fetch(
      `https://api.chess.com/pub/player/${username}/games/archives`,
      { headers }
    );
    
    if (!archivesRes.ok) throw new Error("Could not fetch archives");
    
    const { archives } = await archivesRes.json();
    const recentArchives = archives.slice(-maxMonths);
    const allGames: ImportedGame[] = [];
    
    for (const archiveUrl of recentArchives) {
      const res = await fetch(archiveUrl, { headers });
      if (!res.ok) continue;
      
      const { games } = await res.json();
      allGames.push(...games.map((g: any) => ({
        id: g.url || Math.random().toString(36).substring(7),
        headers: {},
        pgn: g.pgn,
        white: g.white.username,
        black: g.black.username,
        result: g.white.result === "win" ? "1-0" : g.black.result === "win" ? "0-1" : "1/2-1/2",
        date: new Date(g.end_time * 1000).toISOString(),
        timeControl: g.time_control,
        source: "chess.com"
      })));
    }
    
    return allGames.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (error) {
    console.error("Error fetching Chess.com games:", error);
    return [];
  }
}

export async function fetchLichessGames(username: string, max: number = 50): Promise<ImportedGame[]> {
  try {
    const params = new URLSearchParams({
      max: String(max),
      evals: 'true',
      opening: 'true',
      clocks: 'true',
    });
    
    const res = await fetch(
      `https://lichess.org/api/games/user/${username}?${params}`,
      { headers: { 'Accept': 'application/x-ndjson' } }
    );
    
    if (!res.ok) throw new Error("Could not fetch Lichess games");
    
    const text = await res.text();
    const games = text.trim().split('\n').filter(Boolean).map(line => JSON.parse(line));
    
    return games.map((g: any) => ({
      id: g.id || Math.random().toString(36).substring(7),
      headers: {},
      pgn: g.pgn || "",
      white: g.players?.white?.user?.name || "Anonymous",
      black: g.players?.black?.user?.name || "Anonymous",
      result: g.status === "draw" ? "1/2-1/2" : g.winner === "white" ? "1-0" : "0-1",
      date: g.createdAt ? new Date(g.createdAt).toISOString() : new Date().toISOString(),
      timeControl: `${g.clock?.initial / 60 || 0}+${g.clock?.increment || 0}`,
      source: "lichess"
    }));
  } catch (error) {
    console.error("Error fetching Lichess games:", error);
    return [];
  }
}
