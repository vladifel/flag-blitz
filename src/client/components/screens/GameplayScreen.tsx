import { useEffect, useRef, useState } from 'react';
import { formatTime } from '../../../shared/constants.js';
import { getCorrectName, progressLabel, roundLimit } from '../../../shared/gameLogic.js';
import type { GameState } from '../../../shared/types.js';
import { FlagImage } from '../FlagImage.js';
import { Icon } from '../Icon.js';
import { LandingChrome } from '../LandingChrome.js';

const OPTION_LABELS = ['A', 'B', 'C', 'D'] as const;
const FEEDBACK_MS = 500;

type GameplayScreenProps = {
  state: GameState;
  onGuess: (name: string) => void;
  onQuit: () => void;
  onLeaderboard: () => void;
  onSettings: () => void;
};

type Feedback = {
  selected: string;
  correct: string;
};

function optionClass(country: string, feedback: Feedback | null): string {
  const base =
    'group flex min-h-[44px] items-center justify-between rounded-xl border px-sm py-2 text-left transition-all duration-200 md:min-h-[56px] md:px-md md:py-lg';

  if (!feedback) {
    return `${base} glass-row racing-border cursor-pointer border-primary/20 text-on-surface hover:border-primary/50 hover:bg-surface-container-highest active:scale-95`;
  }

  const isCorrect = country === feedback.correct;
  const isSelected = country === feedback.selected;

  if (isCorrect) {
    return `${base} pointer-events-none border-[#46d160] bg-[#46d160]/40 text-[#eaffef] shadow-[0_0_16px_rgba(70,209,96,0.35)]`;
  }
  if (isSelected) {
    return `${base} pointer-events-none border-error bg-error-container text-on-error-container shadow-[0_0_16px_rgba(255,180,171,0.3)]`;
  }
  return `${base} pointer-events-none border-outline-variant/20 bg-surface-variant/20 text-on-surface-variant/50`;
}

export function GameplayScreen({
  state,
  onGuess,
  onQuit,
  onLeaderboard,
  onSettings,
}: GameplayScreenProps) {
  const flagCode = state.flags[state.currentIndex] ?? '';
  const options = state.currentOptions;
  const total = roundLimit(state);

  const [now, setNow] = useState(Date.now());
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const timerRef = useRef<number | null>(null);
  const onGuessRef = useRef(onGuess);
  onGuessRef.current = onGuess;

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    setFeedback(null);
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, [state.currentIndex]);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, []);

  const elapsed = state.startTime ? (now - state.startTime) / 1000 : 0;
  const questionNumber = Math.min(state.currentIndex + 1, Math.max(total, 1));
  const progressPercent = Math.min(100, (questionNumber / Math.max(total, 1)) * 100);
  const locked = feedback !== null || !flagCode || state.currentIndex >= total;

  const handleOptionClick = (country: string) => {
    if (locked || !flagCode) {
      return;
    }

    const correct = getCorrectName(flagCode);
    setFeedback({ selected: country, correct });

    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
    }
    timerRef.current = window.setTimeout(() => {
      timerRef.current = null;
      onGuessRef.current(country);
    }, FEEDBACK_MS);
  };

  return (
    <LandingChrome onLeaderboard={onLeaderboard} onSettings={onSettings} onLogoClick={onQuit}>
      <main className="mx-auto flex min-h-0 w-full flex-1 flex-col gap-sm overflow-hidden px-margin-mobile py-sm md:gap-md md:px-0 md:py-base">
        <div className="grid shrink-0 grid-cols-2 items-end gap-sm md:gap-md">
          <div className="flex min-w-0 flex-col gap-1">
            <div className="flex items-center justify-between gap-2 px-xs">
              <span className="truncate font-label-bold text-[11px] uppercase tracking-widest text-primary md:text-label-bold">
                Question {progressLabel(state)}
              </span>
              <span className="shrink-0 font-label-bold text-[11px] text-on-surface-variant md:text-label-bold">
                {Math.round(progressPercent)}%
              </span>
            </div>
            <div className="relative h-3 w-full overflow-hidden rounded-full bg-surface-container md:h-4">
              <div className="absolute inset-0 progress-segment opacity-50" />
              <div
                className="relative z-10 h-full rounded-full bg-gradient-to-r from-primary-container to-secondary-container transition-all duration-500"
                style={{ width: `${Math.max(8, progressPercent)}%` }}
              />
            </div>
          </div>

          <div className="flex justify-end">
            <div className="glass-row racing-border flex items-center gap-sm rounded-xl px-sm py-1.5 shadow-xl md:px-md md:py-sm">
              <Icon name="timer" className="text-base text-primary md:text-[24px]" filled />
              <div className="flex flex-col">
                <span className="font-label-bold text-[10px] uppercase leading-none text-on-surface-variant md:text-xs">
                  Elapsed
                </span>
                <span className="font-headline-md text-sm leading-none text-primary timer-glow md:text-headline-md">
                  {formatTime(elapsed)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flag-card glass-row racing-border group relative flex min-h-0 flex-1 items-center justify-center overflow-hidden rounded-xl p-sm md:p-md">
          <div className="absolute left-0 top-0 h-px w-full bg-white/10" />
          <div className="relative z-10 w-full max-w-[280px]">
            <FlagImage
              code={flagCode}
              className="mx-auto h-auto w-full rounded border-4 border-white/10 shadow-2xl shadow-black/60"
            />
          </div>
          <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 items-center gap-1 opacity-60 md:bottom-4">
            <span className="h-1.5 w-1.5 animate-ping rounded-full bg-primary" />
            <span className="font-label-sm text-[10px] uppercase tracking-widest text-on-surface-variant md:text-label-sm">
              Identify Target
            </span>
          </div>
        </div>

        <div className="grid shrink-0 grid-cols-2 gap-sm md:gap-md">
          {options.map((country, index) => (
            <button
              key={`${state.currentIndex}-${country}-${index}`}
              type="button"
              aria-disabled={locked}
              className={optionClass(country, feedback)}
              onClick={() => handleOptionClick(country)}
            >
              <div className="flex min-w-0 items-center gap-sm md:gap-md">
                <span className="font-headline-md text-sm text-on-surface-variant/25 transition-opacity group-hover:text-on-surface-variant/40 md:text-headline-md">
                  {OPTION_LABELS[index]}
                </span>
                <span className="truncate font-headline-md text-xs md:text-headline-md">{country}</span>
              </div>
            </button>
          ))}
        </div>

        <div className="flex shrink-0 items-center justify-between text-xs md:text-sm">
          <span className="font-label-bold text-label-bold text-secondary">
            Correct: {state.correctAnswers}
          </span>
          <span className="text-on-surface-variant">
            {state.mode === 'suddendeath'
              ? `Streak ${state.correctAnswers}`
              : `${questionNumber} of ${total}`}
          </span>
        </div>
      </main>
    </LandingChrome>
  );
}
