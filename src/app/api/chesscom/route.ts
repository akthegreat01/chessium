import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username');

  if (!username) {
    return NextResponse.json({ error: 'Username is required' }, { status: 400 });
  }

  try {
    const res = await fetch(`https://api.chess.com/pub/player/${username}/stats`, {
      headers: {
        'User-Agent': 'Chessium (Next.js Application)',
      },
    });

    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch from Chess.com' }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
