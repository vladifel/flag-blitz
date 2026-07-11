import { Hono } from 'hono';
import { redis, reddit } from '@devvit/web/server';
import type {
  ErrorResponse,
  LeaderboardResponse,
  SubmitScoreBody,
  SubmitScoreResponse,
} from '../../shared/api.js';
import type { GameMode } from '../../shared/types.js';
import { fetchLeaderboardPage, submitScore } from '../../shared/leaderboard.js';

export const api = new Hono();

const flagCache = new Map<string, ArrayBuffer>();
const VALID_MODES = new Set<GameMode>([25, 50, 100, 230, 'suddendeath']);

function parseMode(raw: string | undefined): GameMode | null {
  if (raw === 'suddendeath') {
    return 'suddendeath';
  }
  const n = Number(raw);
  if (n === 25 || n === 50 || n === 100 || n === 230) {
    return n;
  }
  return null;
}

api.post('/score', async (c) => {
  try {
    const body = await c.req.json<SubmitScoreBody>();
    if (!VALID_MODES.has(body.mode)) {
      return c.json<ErrorResponse>({ status: 'error', message: 'Invalid mode' }, 400);
    }
    if (
      typeof body.correctAnswers !== 'number' ||
      !Number.isFinite(body.correctAnswers) ||
      body.correctAnswers < 0 ||
      body.correctAnswers > 231
    ) {
      return c.json<ErrorResponse>({ status: 'error', message: 'Invalid score' }, 400);
    }
    if (
      typeof body.timeSeconds !== 'number' ||
      !Number.isFinite(body.timeSeconds) ||
      body.timeSeconds < 0 ||
      body.timeSeconds > 86_400
    ) {
      return c.json<ErrorResponse>({ status: 'error', message: 'Invalid time' }, 400);
    }

    const username = (await reddit.getCurrentUsername()) ?? 'Anonymous';
    await submitScore(
      redis,
      body.mode,
      username,
      Math.floor(body.correctAnswers),
      Math.floor(body.timeSeconds)
    );
    return c.json<SubmitScoreResponse>({ type: 'score-submitted' });
  } catch (error) {
    console.error('Score submit error:', error);
    return c.json<ErrorResponse>(
      { status: 'error', message: 'Failed to submit score' },
      400
    );
  }
});

api.get('/flag/:code', async (c) => {
  const code = c.req.param('code')?.toLowerCase();
  if (!code || !/^[a-z]{2}$/.test(code)) {
    return c.json<ErrorResponse>({ status: 'error', message: 'Invalid flag code' }, 400);
  }

  try {
    const cached = flagCache.get(code);
    if (cached) {
      return c.body(cached, 200, {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=604800',
      });
    }

    const response = await fetch(`https://flagcdn.com/w320/${code}.png`);
    if (!response.ok) {
      return c.json<ErrorResponse>({ status: 'error', message: 'Flag not found' }, 404);
    }

    const buffer = await response.arrayBuffer();
    flagCache.set(code, buffer);
    return c.body(buffer, 200, {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=86400',
    });
  } catch (error) {
    console.error('Flag proxy error:', error);
    return c.json<ErrorResponse>({ status: 'error', message: 'Failed to load flag' }, 502);
  }
});

api.get('/leaderboard', async (c) => {
  try {
    const mode = parseMode(c.req.query('mode') ?? '25');
    if (!mode) {
      return c.json<ErrorResponse>({ status: 'error', message: 'Invalid mode' }, 400);
    }
    const page = Math.max(0, parseInt(c.req.query('page') ?? '0', 10) || 0);

    const data = await fetchLeaderboardPage(redis, mode, page);
    return c.json<LeaderboardResponse>({ type: 'leaderboard', data });
  } catch (error) {
    console.error('Leaderboard error:', error);
    return c.json<ErrorResponse>(
      { status: 'error', message: 'Failed to load leaderboard' },
      400
    );
  }
});
