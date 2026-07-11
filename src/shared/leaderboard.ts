import { LEADERBOARD_PAGE_SIZE, leaderboardKey } from './constants.js';
import { decodeCompositeScore } from './gameLogic.js';
import type { GameMode, LeaderboardPage } from './types.js';

export type ScoreRedis = {
  zAdd(key: string, ...members: { member: string; score: number }[]): Promise<number>;
  zRange(
    key: string,
    start: number | string,
    stop: number | string,
    options?: { by: 'rank'; reverse: boolean }
  ): Promise<{ member: string; score: number }[]>;
};

export async function submitScore(
  redis: ScoreRedis,
  mode: GameMode,
  username: string,
  correctAnswers: number,
  timeSeconds: number
): Promise<void> {
  const score = correctAnswers * 1_000_000 - timeSeconds;
  await redis.zAdd(leaderboardKey(mode), { member: username, score });
}

export async function fetchLeaderboardPage(
  redis: ScoreRedis,
  mode: GameMode,
  page: number
): Promise<LeaderboardPage> {
  const start = page * LEADERBOARD_PAGE_SIZE;
  const stop = start + LEADERBOARD_PAGE_SIZE;

  const raw = await redis.zRange(leaderboardKey(mode), start, stop, {
    by: 'rank',
    reverse: true,
  });

  const hasNext = raw.length > LEADERBOARD_PAGE_SIZE;
  const slice = raw.slice(0, LEADERBOARD_PAGE_SIZE);

  const entries = slice.map((row, index) => {
    const compositeScore = row.score;
    const { correctAnswers, timeSeconds } = decodeCompositeScore(compositeScore);
    return {
      rank: start + index + 1,
      username: row.member,
      correctAnswers,
      timeSeconds,
      compositeScore,
    };
  });

  return { entries, hasNext };
}
