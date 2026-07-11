import { useEffect, useState } from 'react';
import { modeLabel } from '../../../shared/constants.js';
import { resultsSummary } from '../../../shared/gameLogic.js';
import type { GameState } from '../../../shared/types.js';
import { Icon } from '../Icon.js';
import { LandingChrome } from '../LandingChrome.js';

type ResultsScreenProps = {
  state: GameState;
  onPlayAgain: () => void;
  onChangeMode: () => void;
  onLeaderboard: () => void;
  onSettings: () => void;
  onBack: () => void;
};

function useCountUp(target: number, durationMs = 1500): number {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let frame = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - start) / durationMs, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setValue(Math.floor(easeOut * target));
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, durationMs]);

  return value;
}

export function ResultsScreen({
  state,
  onPlayAgain,
  onChangeMode,
  onLeaderboard,
  onSettings,
  onBack,
}: ResultsScreenProps) {
  const summary = resultsSummary(state);
  const accuracy =
    summary.total > 0 ? Math.round((summary.correct / summary.total) * 100) : 0;
  const victory = summary.correct === summary.total;
  const accuracyBadge =
    accuracy >= 90 ? 'EXCELLENT' : accuracy >= 70 ? 'GOOD' : 'KEEP GOING';
  const animatedScore = useCountUp(summary.correct);

  return (
    <LandingChrome
      onLeaderboard={onLeaderboard}
      onSettings={onSettings}
      onLogoClick={onBack}
    >
      <main className="flex min-h-0 w-full flex-1 flex-col items-center justify-center overflow-y-auto px-margin-mobile py-2 text-center md:px-0 md:py-base">
        <div className="flex w-full max-w-[40rem] flex-col items-center">
          <div className="mb-4 shrink-0 md:mb-8">
            <p className="mb-1 font-headline-md text-xs uppercase tracking-[0.3em] text-on-surface-variant opacity-80 md:mb-2 md:text-sm">
              Match Complete
            </p>
            <h1 className="victory-text-gradient scale-105 font-display-hero text-[40px] italic uppercase tracking-tighter md:scale-110 md:text-display-hero">
              {victory ? 'Victory' : 'Finished'}
            </h1>
            <p className="mt-2 font-label-bold text-[10px] uppercase tracking-widest text-secondary md:mt-3 md:text-label-sm">
              {modeLabel(state.mode)}
            </p>
          </div>

          <div className="mb-4 grid w-full shrink-0 grid-cols-3 gap-2 md:mb-8 md:gap-md">
            <div className="card-inner-stroke group flex flex-col items-center justify-center rounded-xl border border-white/5 bg-surface-container-high p-2 transition-all duration-300 hover:bg-surface-container-highest md:p-md">
              <Icon
                name="emoji_events"
                className="mb-1 text-lg text-primary transition-transform group-hover:scale-110 md:mb-md md:text-2xl"
              />
              <p className="mb-1 font-label-bold text-[9px] uppercase tracking-widest text-on-surface-variant md:mb-sm md:text-xs">
                Final Score
              </p>
              <div className="flex items-baseline gap-0.5 md:gap-xs">
                <span className="font-display-hero text-xl text-primary md:text-3xl">
                  {animatedScore}
                </span>
                <span className="font-headline-md text-xs text-on-surface-variant/40 md:text-headline-md">
                  / {summary.total}
                </span>
              </div>
              <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-white/5 md:mt-lg">
                <div className="h-full bg-primary" style={{ width: `${accuracy}%` }} />
              </div>
            </div>

            <div className="card-inner-stroke group relative flex flex-col items-center justify-center overflow-hidden rounded-xl border border-white/5 bg-surface-container-high p-2 transition-all duration-300 hover:bg-surface-container-highest md:p-md">
              <div className="absolute -right-12 -top-12 h-24 w-24 rounded-full bg-secondary/10 blur-3xl" />
              <Icon
                name="target"
                className="mb-1 text-lg text-secondary transition-transform group-hover:scale-110 md:mb-md md:text-2xl"
              />
              <p className="mb-1 font-label-bold text-[9px] uppercase tracking-widest text-on-surface-variant md:mb-sm md:text-xs">
                Accuracy
              </p>
              <span className="font-display-hero text-xl text-secondary md:text-3xl">{accuracy}%</span>
              <div className="mt-2 rounded-full bg-tertiary-container/20 px-2 py-0.5 text-[8px] font-bold uppercase tracking-widest text-tertiary md:mt-md md:px-3 md:py-1 md:text-[10px]">
                {accuracyBadge}
              </div>
            </div>

            <div className="card-inner-stroke group flex flex-col items-center justify-center rounded-xl border border-white/5 bg-surface-container-high p-2 transition-all duration-300 hover:bg-surface-container-highest md:p-md">
              <Icon
                name="timer"
                className="mb-1 text-lg text-on-background transition-transform group-hover:scale-110 md:mb-md md:text-2xl"
              />
              <p className="mb-1 font-label-bold text-[9px] uppercase tracking-widest text-on-surface-variant md:mb-sm md:text-xs">
                Time Taken
              </p>
              <span className="font-display-hero text-xl text-on-background md:text-3xl">
                {summary.timeLabel}
              </span>
              {victory && (
                <p className="mt-2 text-[8px] italic text-on-surface-variant/50 md:mt-md md:text-xs">
                  Flawless!
                </p>
              )}
            </div>
          </div>

          <div className="flex w-full shrink-0 flex-col items-stretch gap-2 md:w-auto md:flex-row md:items-center md:gap-md">
            <button
              type="button"
              className="landing-game-button flex items-center justify-center gap-sm rounded-xl px-8 py-3 font-headline-md text-sm italic uppercase tracking-tight text-white md:px-12 md:py-4 md:text-headline-md"
              onClick={onPlayAgain}
            >
              <Icon name="play_arrow" filled />
              Play Again
            </button>

            <button
              type="button"
              className="flex items-center justify-center gap-sm rounded-xl border border-white/10 bg-surface-container px-6 py-3 font-label-bold text-label-bold uppercase tracking-widest text-on-surface-variant transition-all hover:border-primary/40 hover:bg-surface-container-high active:scale-95 md:px-8 md:py-4"
              onClick={onChangeMode}
            >
              <Icon name="layers" className="text-xl" />
              Change Mode
            </button>

            <button
              type="button"
              className="flex items-center justify-center gap-sm rounded-xl border border-white/5 bg-surface-container/50 px-6 py-3 font-label-bold text-label-bold uppercase tracking-widest text-on-surface-variant transition-all hover:bg-surface-container active:scale-95 md:px-8 md:py-4"
              onClick={onLeaderboard}
            >
              <Icon name="leaderboard" className="text-xl" />
              Leaderboard
            </button>
          </div>
        </div>
      </main>
    </LandingChrome>
  );
}
