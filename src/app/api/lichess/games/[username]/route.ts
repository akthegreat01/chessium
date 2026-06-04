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

    const response = await fetch(`https://lichess.org/api/games/user/${username}?max=5&pgnInJson=true`, {
      headers: {
        "Accept": "application/x-ndjson",
        "User-Agent": "ChessiumApp/1.0"
      },
      next: { revalidate: 60 } // Cache for 1 minute
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch games from Lichess: ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.text();
    return new Response(data, {
      headers: { 
        "Content-Type": "application/x-ndjson",
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=30"
      }
    });
  } catch (error: any) {
    console.error("Error in Lichess games API proxy:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch games" },
      { status: 500 }
    );
  }
}
