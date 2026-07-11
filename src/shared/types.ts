export type GameScreen = 'landing' | 'menu' | 'playing' | 'results' | 'leaderboard' | 'settings';

export type GameMode = 25 | 50 | 100 | 230 | 'suddendeath';

export type GameState = {
  screen: GameScreen;
  mode: GameMode;
  flags: string[];
  currentIndex: number;
  correctAnswers: number;
  startTime: number | null;
  endTime: number | null;
  currentOptions: string[];
  leaderboardMode: GameMode;
  leaderboardPage: number;
};

export type LeaderboardEntry = {
  rank: number;
  username: string;
  correctAnswers: number;
  timeSeconds: number;
  compositeScore: number;
};

export type LeaderboardPage = {
  entries: LeaderboardEntry[];
  hasNext: boolean;
};
