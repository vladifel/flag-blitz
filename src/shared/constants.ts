import type { GameMode } from './types.js';

export type ModeIconName =
  | 'timer'
  | 'flag'
  | 'military_tech'
  | 'directions_run'
  | 'skull'
  | 'bolt'
  | 'sports_score';

export const LEADERBOARD_PAGE_SIZE = 5;

export const GAME_MODES: {
  mode: GameMode;
  label: string;
  description: string;
  estimate: string;
  badge?: string;
  accent?: 'primary' | 'secondary';
  icon: ModeIconName;
}[] = [
  {
    mode: 25,
    label: 'Quick',
    description: 'A fast-paced sprint to test your basic knowledge. 25 Flags.',
    estimate: 'EST. 2 MIN',
    icon: 'timer',
  },
  {
    mode: 50,
    label: 'Standard',
    description: 'The classic competitive format for the everyday pro. 50 Flags.',
    estimate: 'EST. 5 MIN',
    icon: 'flag',
  },
  {
    mode: 100,
    label: 'Pro',
    description: 'Serious challenge for the flag encyclopedias. 100 Flags.',
    estimate: 'EST. 10 MIN',
    icon: 'military_tech',
  },
  {
    mode: 230,
    label: 'Marathon',
    description: 'The ultimate test of endurance. 230 Flags back-to-back.',
    estimate: 'HARDCORE',
    badge: 'HARDCORE',
    accent: 'secondary',
    icon: 'directions_run',
  },
  {
    mode: 'suddendeath',
    label: 'Sudden Death',
    description: 'One wrong answer ends the run. How far can you go?',
    estimate: 'NO MISTAKES',
    accent: 'secondary',
    icon: 'skull',
  },
];

export function leaderboardKey(mode: GameMode): string {
  return mode === 'suddendeath' ? 'leaderboard:suddendeath' : `leaderboard:${mode}`;
}

export function modeLabel(mode: GameMode): string {
  return mode === 'suddendeath' ? 'Sudden Death' : `${mode} Flags`;
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${String(secs).padStart(2, '0')}`;
}
