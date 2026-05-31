import { useState, useEffect } from 'react';

export interface ChessComStats {
  rapid?: number;
  blitz?: number;
  bullet?: number;
}

export function useChessComStats() {
  const [username, setUsername] = useState<string | null>(null);
  const [stats, setStats] = useState<ChessComStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load username from local storage on mount
    const saved = localStorage.getItem('chesscom_username');
    if (saved) {
      setUsername(saved);
    }
  }, []);

  useEffect(() => {
    if (!username) {
      setStats(null);
      return;
    }

    const fetchStats = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/chesscom?username=${encodeURIComponent(username)}`);
        if (!res.ok) {
          throw new Error('Failed to fetch stats');
        }
        const data = await res.json();
        
        // Chess.com returns nested objects like: { chess_rapid: { last: { rating: 1200 } } }
        setStats({
          rapid: data.chess_rapid?.last?.rating,
          blitz: data.chess_blitz?.last?.rating,
          bullet: data.chess_bullet?.last?.rating,
        });
      } catch (err: any) {
        setError(err.message);
        setStats(null);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [username]);

  const saveUsername = (newUsername: string) => {
    localStorage.setItem('chesscom_username', newUsername);
    setUsername(newUsername);
  };

  const clearUsername = () => {
    localStorage.removeItem('chesscom_username');
    setUsername(null);
    setStats(null);
  };

  return { username, stats, loading, error, saveUsername, clearUsername };
}
