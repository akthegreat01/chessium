export interface ApiGame {
  id: string;
  url: string;
  pgn: string;
  white: string;
  black: string;
  date: string;
}

export async function fetchChessComGames(username: string): Promise<ApiGame[]> {
  try {
    // Fetch archives list
    const archivesRes = await fetch(`https://api.chess.com/pub/player/${username}/games/archives`);
    if (!archivesRes.ok) throw new Error("User not found or API error");
    const archivesData = await archivesRes.json();
    
    if (!archivesData.archives || archivesData.archives.length === 0) return [];
    
    // Fetch the most recent archive
    const recentArchiveUrl = archivesData.archives[archivesData.archives.length - 1];
    const gamesRes = await fetch(recentArchiveUrl);
    const gamesData = await gamesRes.json();
    
    // Return last 10 games
    const games = gamesData.games.slice(-10).reverse().map((g: any) => ({
      id: g.uuid || g.url,
      url: g.url,
      pgn: g.pgn,
      white: g.white.username,
      black: g.black.username,
      date: new Date(g.end_time * 1000).toLocaleDateString(),
    })).filter((g: any) => !!g.pgn); // Ensure pgn exists
    
    return games;
  } catch (error) {
    console.error("Error fetching chess.com games:", error);
    return [];
  }
}

export async function fetchLichessGames(username: string): Promise<ApiGame[]> {
  try {
    // Lichess API returns NDJSON (newline-delimited JSON) for games export
    const res = await fetch(`https://lichess.org/api/games/user/${username}?max=10&pgnInJson=true&clocks=false`, {
      headers: { 'Accept': 'application/x-ndjson' }
    });
    if (!res.ok) throw new Error("User not found or API error");
    
    const text = await res.text();
    const lines = text.split('\n').filter(line => line.trim() !== '');
    
    return lines.map(line => {
      const g = JSON.parse(line);
      return {
        id: g.id,
        url: `https://lichess.org/${g.id}`,
        pgn: g.pgn,
        white: g.players.white.user ? g.players.white.user.name : "Anonymous",
        black: g.players.black.user ? g.players.black.user.name : "Anonymous",
        date: new Date(g.createdAt).toLocaleDateString(),
      };
    });
  } catch (error) {
    console.error("Error fetching lichess games:", error);
    return [];
  }
}
