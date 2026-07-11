import type { GameMode, LeaderboardPage } from './types.js';

export type SubmitScoreBody = {
  mode: GameMode;
  correctAnswers: number;
  timeSeconds: number;
};

export type SubmitScoreResponse = {
  type: 'score-submitted';
};

export type LeaderboardQuery = {
  mode: GameMode;
  page: number;
};

export type LeaderboardResponse = {
  type: 'leaderboard';
  data: LeaderboardPage;
};

export type ErrorResponse = {
  status: 'error';
  message: string;
};
