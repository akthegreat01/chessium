import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;

    if (!username) {
      return NextResponse.json({ error: "Username is required" }, { status: 400 });
    }

    const headers = {
      "User-Agent": "ChessiumApp/1.0 (contact: dev@chessium.com)"
    };

    // Get archives
    const archivesRes = await fetch(
      `https://api.chess.com/pub/player/${username}/games/archives`,
      { headers, next: { revalidate: 60 } }
    );

    if (!archivesRes.ok) {
      return NextResponse.json(
        { error: `Failed to fetch archives: ${archivesRes.statusText}` },
        { status: archivesRes.status }
      );
    }

    const archivesData = await archivesRes.json();
    const archives = archivesData.archives || [];

    if (archives.length === 0) {
      return NextResponse.json({ games: [] });
    }

    // Fetch games from the last archive
    const lastArchiveUrl = archives[archives.length - 1];
    const gamesRes = await fetch(lastArchiveUrl, { headers, next: { revalidate: 60 } });

    if (!gamesRes.ok) {
      return NextResponse.json(
        { error: `Failed to fetch games from archive: ${gamesRes.statusText}` },
        { status: gamesRes.status }
      );
    }

    const gamesData = await gamesRes.json();
    return NextResponse.json(gamesData);
  } catch (error: any) {
    console.error("Error in Chess.com games API proxy:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch games" },
      { status: 500 }
    );
  }
}
