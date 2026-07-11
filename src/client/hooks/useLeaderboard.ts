import { useEffect, useState } from 'react';
import type { LeaderboardResponse } from '../../shared/api.js';
import type { GameMode, LeaderboardPage } from '../../shared/types.js';

type LeaderboardState = {
  data: LeaderboardPage | null;
  loading: boolean;
  error: string | null;
};

export function useLeaderboard(mode: GameMode, page: number): LeaderboardState {
  const [state, setState] = useState<LeaderboardState>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      try {
        const params = new URLSearchParams({
          mode: String(mode),
          page: String(page),
        });
        const res = await fetch(`/api/leaderboard?${params.toString()}`);
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        const json = (await res.json()) as LeaderboardResponse;
        if (json.type !== 'leaderboard') {
          throw new Error('Unexpected response');
        }
        if (!cancelled) {
          setState({ data: json.data, loading: false, error: null });
        }
      } catch (err) {
        console.error('Failed to load leaderboard', err);
        if (!cancelled) {
          setState({ data: null, loading: false, error: 'Could not load leaderboard.' });
        }
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [mode, page]);

  return state;
}
