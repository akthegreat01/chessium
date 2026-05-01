// Opening Explorer API integration with Lichess
export interface ExplorerMove {
  uci: string;
  san: string;
  white: number;
  draws: number;
  black: number;
  averageRating: number;
}

export interface ExplorerData {
  opening: { eco: string; name: string } | null;
  moves: ExplorerMove[];
  white: number;
  draws: number;
  black: number;
  topGames?: { id: string; white: { name: string; rating: number }; black: { name: string; rating: number }; winner: string; year: number }[];
}

export type ExplorerDB = 'masters' | 'lichess';

export async function fetchExplorerData(
  fen: string,
  db: ExplorerDB = 'masters',
  ratings: string = '2200,2500',
  speeds: string = 'blitz,rapid,classical'
): Promise<ExplorerData | null> {
  try {
    let url: string;
    if (db === 'masters') {
      url = `https://explorer.lichess.ovh/masters?fen=${encodeURIComponent(fen)}`;
    } else {
      url = `https://explorer.lichess.ovh/lichess?fen=${encodeURIComponent(fen)}&ratings=${ratings}&speeds=${speeds}`;
    }

    const res = await fetch(url);
    if (!res.ok) return null;

    const data = await res.json();

    return {
      opening: data.opening || null,
      moves: (data.moves || []).slice(0, 10).map((m: any) => ({
        uci: m.uci,
        san: m.san,
        white: m.white,
        draws: m.draws,
        black: m.black,
        averageRating: m.averageRating || 0,
      })),
      white: data.white || 0,
      draws: data.draws || 0,
      black: data.black || 0,
      topGames: (data.topGames || []).slice(0, 3).map((g: any) => ({
        id: g.id,
        white: g.white,
        black: g.black,
        winner: g.winner,
        year: g.year,
      })),
    };
  } catch (err) {
    console.error('Explorer fetch failed', err);
    return null;
  }
}
