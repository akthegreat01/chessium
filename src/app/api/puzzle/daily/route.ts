import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const response = await fetch("https://lichess.org/api/puzzle/daily", {
      headers: {
        "Accept": "application/json",
        "User-Agent": "ChessiumApp/1.0"
      },
      next: { revalidate: 3600 } // Cache for 1 hour using Next.js caching if supported
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch daily puzzle from Lichess: ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error in daily puzzle API proxy:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch daily puzzle" },
      { status: 500 }
    );
  }
}
