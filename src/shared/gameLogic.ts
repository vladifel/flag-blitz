import { countries } from './countries.js';
import type { GameMode, GameState } from './types.js';

export function shuffleArray<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = copy[i]!;
    copy[i] = copy[j]!;
    copy[j] = temp;
  }
  return copy;
}

export function pickFlagCodes(mode: GameMode): string[] {
  const shuffled = shuffleArray(countries.map((c) => c.code));
  if (mode === 'suddendeath') {
    return shuffled;
  }
  return shuffled.slice(0, mode);
}

export function generateOptions(flagCode: string): string[] {
  const correct = countries.find((c) => c.code === flagCode);
  if (!correct) {
    return ['Unknown', 'Unknown', 'Unknown', 'Unknown'];
  }

  const distractors = shuffleArray(
    countries.filter((c) => c.code !== flagCode).map((c) => c.name)
  ).slice(0, 3);

  return shuffleArray([correct.name, ...distractors]);
}

export function getCorrectName(flagCode: string): string {
  return countries.find((c) => c.code === flagCode)?.name ?? 'Unknown';
}

export function roundLimit(state: GameState): number {
  if (state.mode === 'suddendeath') {
    return state.flags.length;
  }
  return Math.min(state.flags.length, state.mode);
}

export function progressLabel(state: GameState): string {
  const limit = roundLimit(state);
  const total = state.mode === 'suddendeath' ? '∞' : String(limit || state.mode);
  return `${Math.min(state.currentIndex + 1, limit || 1)} / ${total}`;
}

export function decodeCompositeScore(score: number): {
  correctAnswers: number;
  timeSeconds: number;
} {
  const correctAnswers = Math.ceil(score / 1_000_000);
  const timeSeconds = correctAnswers * 1_000_000 - score;
  return { correctAnswers, timeSeconds };
}

export function elapsedSeconds(startTime: number | null, endTime: number | null): number {
  if (startTime === null || endTime === null) {
    return 0;
  }
  return (endTime - startTime) / 1000;
}

export function createInitialState(): GameState {
  return {
    screen: 'landing',
    mode: 25,
    flags: [],
    currentIndex: 0,
    correctAnswers: 0,
    startTime: null,
    endTime: null,
    currentOptions: [],
    leaderboardMode: 25,
    leaderboardPage: 0,
  };
}

export function startGame(mode: GameMode): Partial<GameState> {
  const flags = pickFlagCodes(mode);
  const firstFlag = flags[0];
  const options = firstFlag ? generateOptions(firstFlag) : [];
  return {
    screen: 'playing',
    mode,
    flags,
    currentIndex: 0,
    correctAnswers: 0,
    startTime: Date.now(),
    endTime: null,
    currentOptions: options,
  };
}

export type GuessResult =
  | { type: 'continue'; patch: Partial<GameState> }
  | { type: 'gameover'; patch: Partial<GameState> };

export function handleGuess(state: GameState, selectedName: string): GuessResult {
  const limit = roundLimit(state);

  if (state.screen !== 'playing' || limit === 0) {
    return { type: 'continue', patch: {} };
  }

  // Already past the last question — force results.
  if (state.currentIndex >= limit) {
    return {
      type: 'gameover',
      patch: {
        currentIndex: Math.min(state.currentIndex, limit),
        endTime: state.endTime ?? Date.now(),
        screen: 'results',
      },
    };
  }

  const flagCode = state.flags[state.currentIndex];
  if (!flagCode) {
    return {
      type: 'gameover',
      patch: {
        currentIndex: limit,
        endTime: Date.now(),
        screen: 'results',
      },
    };
  }

  const correctName = getCorrectName(flagCode);
  const isCorrect = selectedName === correctName;
  const nextCorrect = isCorrect ? state.correctAnswers + 1 : state.correctAnswers;
  const nextIndex = state.currentIndex + 1;
  const reachedEnd = nextIndex >= limit;

  const numberedComplete = state.mode !== 'suddendeath' && reachedEnd;
  const suddenDeathFail = state.mode === 'suddendeath' && !isCorrect;
  const suddenDeathWin = state.mode === 'suddendeath' && isCorrect && reachedEnd;

  if (numberedComplete || suddenDeathFail || suddenDeathWin) {
    return {
      type: 'gameover',
      patch: {
        correctAnswers: nextCorrect,
        currentIndex: Math.min(nextIndex, limit),
        endTime: Date.now(),
        screen: 'results',
      },
    };
  }

  const nextFlag = state.flags[nextIndex];
  if (!nextFlag) {
    return {
      type: 'gameover',
      patch: {
        correctAnswers: nextCorrect,
        currentIndex: Math.min(nextIndex, limit),
        endTime: Date.now(),
        screen: 'results',
      },
    };
  }

  return {
    type: 'continue',
    patch: {
      correctAnswers: nextCorrect,
      currentIndex: nextIndex,
      currentOptions: generateOptions(nextFlag),
    },
  };
}

export function resultsSummary(state: GameState): {
  scoreLabel: string;
  timeLabel: string;
  correct: number;
  total: number;
} {
  const timeSeconds = elapsedSeconds(state.startTime, state.endTime);
  const correct = state.correctAnswers;
  // Sudden Death: denominator is questions attempted, not the full flag pool.
  const total =
    state.mode === 'suddendeath'
      ? Math.max(state.currentIndex, correct, 1)
      : roundLimit(state);
  const mins = Math.floor(timeSeconds / 60);
  const secs = Math.floor(timeSeconds % 60);
  const timeLabel = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  return {
    scoreLabel: `${correct}/${total}`,
    timeLabel,
    correct,
    total,
  };
}
