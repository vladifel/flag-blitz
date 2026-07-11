import rank1Url from '../../assets/leaderboard/rank1.jpg';
import rank2Url from '../../assets/leaderboard/rank2.jpg';
import rank3Url from '../../assets/leaderboard/rank3.jpg';
import rank4Url from '../../assets/leaderboard/rank4.jpg';
import rank5Url from '../../assets/leaderboard/rank5.jpg';
import { formatTime } from '../../../shared/constants.js';
import type { GameMode, GameState, LeaderboardEntry } from '../../../shared/types.js';
import { useLeaderboard } from '../../hooks/useLeaderboard.js';
import type { IconName } from '../Icon.js';
import { Icon } from '../Icon.js';
import { LandingChrome } from '../LandingChrome.js';

type LeaderboardScreenProps = {
  state: GameState;
  onModeChange: (mode: GameMode) => void;
  onPageChange: (page: number) => void;
  onBack: () => void;
  onSettings: () => void;
  onStart: () => void;
};

const MODE_TABS: { mode: GameMode; label: string; icon: IconName }[] = [
  { mode: 25, label: 'QUICK', icon: 'bolt' },
  { mode: 50, label: 'STANDARD', icon: 'sports_score' },
  { mode: 100, label: 'PRO', icon: 'military_tech' },
  { mode: 230, label: 'MARATHON', icon: 'timer' },
  { mode: 'suddendeath', label: 'SUDDEN DEATH', icon: 'skull' },
];

const AVATARS = [rank1Url, rank2Url, rank3Url, rank4Url, rank5Url];

function rankAccent(rank: number): {
  border: string;
  text: string;
  title: string;
  titleColor: string;
} {
  if (rank === 1) {
    return {
      border: 'border-l-4 border-l-yellow-400',
      text: 'text-yellow-400',
      title: 'LEGENDARY RANK',
      titleColor: 'text-yellow-400',
    };
  }
  if (rank === 2) {
    return {
      border: 'border-l-4 border-l-slate-300',
      text: 'text-slate-300',
      title: 'PRO ELITE',
      titleColor: 'text-slate-300',
    };
  }
  if (rank === 3) {
    return {
      border: 'border-l-4 border-l-orange-400',
      text: 'text-orange-400',
      title: 'PRO ELITE',
      titleColor: 'text-orange-400',
    };
  }
  if (rank <= 10) {
    return {
      border: '',
      text: 'text-on-surface-variant',
      title: 'MASTER',
      titleColor: 'text-on-surface-variant',
    };
  }
  return {
    border: '',
    text: 'text-on-surface-variant',
    title: 'COMPETITOR',
    titleColor: 'text-on-surface-variant',
  };
}

function avatarBorder(rank: number): string {
  if (rank === 1) return 'border-yellow-400';
  if (rank === 2) return 'border-slate-300';
  if (rank === 3) return 'border-orange-400';
  return 'border-primary/20';
}

function LeaderboardRow({ entry }: { entry: LeaderboardEntry }) {
  const accent = rankAccent(entry.rank);
  const avatar = AVATARS[(entry.rank - 1) % AVATARS.length];

  return (
    <div className={`glass-row racing-border flex items-center rounded-lg px-3 py-2.5 md:px-6 md:py-4 ${accent.border}`}>
      <div className="flex w-10 shrink-0 items-center md:w-16">
        <span className={`font-headline-md text-sm italic md:text-headline-md ${accent.text}`}>
          {String(entry.rank).padStart(2, '0')}
        </span>
      </div>
      <div className="flex min-w-0 flex-1 items-center gap-2 md:gap-4">
        <div className={`h-8 w-8 shrink-0 rounded-full border-2 p-0.5 md:h-10 md:w-10 ${avatarBorder(entry.rank)}`}>
          <img alt="" className="h-full w-full rounded-full object-cover" src={avatar} />
        </div>
        <div className="min-w-0">
          <p className="truncate font-label-bold text-sm text-on-surface md:text-label-bold">
            {entry.username}
          </p>
          <p className={`font-label-bold text-[9px] md:text-[10px] ${accent.titleColor}`}>
            {accent.title}
          </p>
        </div>
      </div>
      <div className="w-24 shrink-0 text-right md:w-36">
        <span className="font-headline-md text-[11px] text-on-surface md:text-base">
          {entry.correctAnswers} Flags · {formatTime(entry.timeSeconds)}
        </span>
      </div>
    </div>
  );
}

export function LeaderboardScreen({
  state,
  onModeChange,
  onPageChange,
  onBack,
  onSettings,
  onStart,
}: LeaderboardScreenProps) {
  const mode = state.leaderboardMode;
  const page = state.leaderboardPage;
  const { data, loading, error } = useLeaderboard(mode, page);
  const entries = data?.entries ?? [];
  const hasNext = data?.hasNext ?? false;

  return (
    <LandingChrome onLeaderboard={() => undefined} onSettings={onSettings} onLogoClick={onBack}>
      <main className="flex min-h-0 w-full flex-1 flex-col gap-3 overflow-y-auto px-margin-mobile py-2 md:gap-md md:px-0 md:py-base">
        <div className="racing-border flex shrink-0 flex-wrap gap-1 rounded-xl bg-surface-container-low p-1.5 md:gap-2 md:p-2">
          {MODE_TABS.map((tab) => {
            const active = tab.mode === mode;
            return (
              <button
                key={String(tab.mode)}
                type="button"
                className={`flex min-w-0 flex-1 items-center justify-center gap-1 rounded-lg px-2 py-2 font-label-bold text-[10px] uppercase transition-all md:min-w-[100px] md:gap-2 md:px-4 md:py-3 md:text-label-bold ${
                  active
                    ? 'active-tab-glow bg-secondary-container text-on-secondary-container'
                    : 'text-on-surface-variant hover:bg-surface-container-high'
                }`}
                onClick={() => onModeChange(tab.mode)}
              >
                <Icon name={tab.icon} className="text-[16px] md:text-[20px]" />
                <span className="truncate">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {loading && (
          <div className="flex flex-1 items-center justify-center">
            <p className="text-on-surface-variant">Loading rankings…</p>
          </div>
        )}

        {error && <p className="shrink-0 text-error">{error}</p>}

        {!loading && !error && entries.length === 0 && (
          <div className="flex flex-1 flex-col items-center justify-center gap-sm">
            <p className="text-on-surface-variant">No scores yet.</p>
            <p className="font-label-sm text-label-sm text-on-surface-variant">
              Be the first to post a score!
            </p>
          </div>
        )}

        {!loading && entries.length > 0 && (
          <div className="flex min-h-0 flex-1 flex-col gap-2 md:gap-3">
            <div className="flex shrink-0 items-center px-3 text-[10px] font-label-bold uppercase tracking-widest text-on-surface-variant opacity-70 md:px-6 md:text-[11px]">
              <div className="w-10 md:w-16">Rank</div>
              <div className="flex-1">Player</div>
              <div className="w-24 text-right md:w-36">Result</div>
            </div>
            <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto md:gap-3">
              {entries.map((entry) => (
                <LeaderboardRow key={`${entry.username}-${entry.rank}`} entry={entry} />
              ))}
            </div>
          </div>
        )}

        <div className="flex shrink-0 items-center justify-between gap-sm">
          <button
            type="button"
            className="rounded-md bg-surface-container px-md py-sm font-label-bold text-label-sm text-on-surface-variant transition-all hover:bg-surface-container-high disabled:opacity-40"
            disabled={page === 0}
            onClick={() => onPageChange(Math.max(0, page - 1))}
          >
            Prev
          </button>
          <p className="font-label-sm text-label-sm text-on-surface-variant">Page {page + 1}</p>
          <button
            type="button"
            className="rounded-md bg-surface-container px-md py-sm font-label-bold text-label-sm text-on-surface-variant transition-all hover:bg-surface-container-high disabled:opacity-40"
            disabled={!hasNext}
            onClick={() => onPageChange(page + 1)}
          >
            Next
          </button>
        </div>

        <div className="flex shrink-0 justify-center pb-1 pt-1 md:pt-2">
          <button
            type="button"
            className="landing-game-button flex flex-nowrap items-center justify-center gap-2 whitespace-nowrap rounded-lg px-6 py-3 font-display-hero text-sm uppercase tracking-widest text-white md:px-10 md:py-4 md:text-headline-md"
            onClick={onStart}
          >
            Challenge the Top 10
          </button>
        </div>
      </main>
    </LandingChrome>
  );
}
